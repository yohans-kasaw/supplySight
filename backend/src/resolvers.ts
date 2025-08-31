import { GraphQLError } from 'graphql'
import type { KPI, Product, Warehouse } from './types.ts'
import {
    products as productsStore,
    warehouses as warehousesStore,
} from './data.ts'
import { statusOf, parseRange, formatDate } from './utils.ts'

let products = productsStore
const warehouses = warehousesStore

export const resolvers = {
    Query: {
        products: (
            _: unknown,
            args: {
                search?: string
                status?: string
                warehouse?: string
                page?: number
                pageSize?: number
            },
        ): { products: Product[]; total: number } => {
            const { search, status, warehouse, page = 1, pageSize = 10 } = args

            // Enforce 10 rows per page as per spec
            const actualPageSize = Math.min(pageSize, 10)

            let result = products.slice()

            if (search && search.trim()) {
                const q = search.trim().toLowerCase()
                result = result.filter(
                    (p) =>
                        p.id.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q) ||
                        p.name.toLowerCase().includes(q),
                )
            }

            if (warehouse && warehouse.trim()) {
                const w = warehouse.trim().toUpperCase()
                result = result.filter((p) => p.warehouse.toUpperCase() === w)
            }

            if (status && status.trim()) {
                const s = status.trim().toLowerCase()
                result = result.filter((p) => statusOf(p) === s)
            }

            const total = result.length
            const start = (page - 1) * actualPageSize
            const end = start + actualPageSize
            const paginatedProducts = result.slice(start, end)

            return { products: paginatedProducts, total }
        },

        warehouses: (): Warehouse[] => {
            return warehouses
                .slice()
                .sort((a, b) => a.code.localeCompare(b.code))
        },

        kpis: (_: unknown, args: { range: string }): KPI[] => {
            const days = parseRange(args.range)

            const baseStock = products.reduce((sum, p) => sum + p.stock, 0)
            const baseDemand = products.reduce((sum, p) => sum + p.demand, 0)

            const today = new Date()
            const out: KPI[] = []

            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)

                const factorStock = 0.9 + ((i % 7) - 3) * 0.02
                const factorDemand = 0.9 + (((i + 3) % 7) - 3) * 0.02

                out.push({
                    date: formatDate(d),
                    stock: Math.max(0, Math.round(baseStock * factorStock)),
                    demand: Math.max(0, Math.round(baseDemand * factorDemand)),
                })
            }
            return out
        },
    },

    Mutation: {
        updateDemand: (
            _: unknown,
            args: { id: string; demand: number },
        ): Product => {
            const { id, demand } = args
            if (!Number.isInteger(demand) || demand < 0) {
                throw new GraphQLError('demand must be a non-negative integer')
            }
            const p = products.find((pr) => pr.id === id)
            if (!p) {
                throw new GraphQLError(`Product with id ${id} not found`)
            }
            p.demand = demand
            return p
        },

        transferStock: (
            _: unknown,
            args: { id: string; from: string; to: string; qty: number },
        ): Product => {
            const { id, from, to, qty } = args
            if (!Number.isInteger(qty) || qty <= 0) {
                throw new GraphQLError('qty must be a positive integer')
            }
            const src = products.find(
                (p) => p.id === id && p.warehouse === from,
            )
            if (!src) {
                const any = products.find((p) => p.id === id)
                if (!any) {
                    throw new GraphQLError(
                        `Product with id ${id} not found in inventory`,
                    )
                }
                throw new GraphQLError(
                    `Product ${id} is not located in warehouse ${from} (current: ${any.warehouse})`,
                )
            }
            if (qty > src.stock) {
                throw new GraphQLError(
                    `Insufficient stock in ${from}. Requested ${qty}, available ${src.stock}`,
                )
            }

            src.stock -= qty

            let dest = products.find((p) => p.id === id && p.warehouse === to)
            if (!dest) {
                dest = {
                    id: id,
                    name: src.name,
                    sku: src.sku,
                    warehouse: to,
                    stock: 0,
                    demand: 0,
                }
                products.push(dest)
            }

            dest.stock += qty

            return dest
        },
    },
}
