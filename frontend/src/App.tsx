import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { WAREHOUSES_QUERY, PRODUCTS_QUERY } from './graphql/queries'
import { UPDATE_DEMAND, TRANSFER_STOCK } from './graphql/mutations'
import { Product } from './types/product'
import { Filters } from './components/Filters'
import { ProductCard } from './components/ProductCard'
import { ProductDrawer } from './components/ProductDrawer'
import { KPICard } from './components/KPICard'
import { StockDemandChart } from './components/StockDemandChart'
import { DateRangeProvider } from './hooks/useDateRange'
import { AppHeader } from './components/AppHeader'
import {
    ArchiveBoxIcon,
    CubeIcon,
    ChartBarIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'
import './App.css'

function AppContent() {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [warehouse, setWarehouse] = useState('')
    const [page, setPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const pageSize = 10 // Fixed to 10 rows per page as per spec

    const { data: wData, loading: wLoading } = useQuery(WAREHOUSES_QUERY)
    const {
        data: pData,
        loading: pLoading,
        refetch,
    } = useQuery(PRODUCTS_QUERY, {
        variables: {
            search,
            status: status ? status.toLowerCase() : null,
            warehouse: warehouse || null,
            page,
            pageSize,
        },
    })

    const [updateDemand, { loading: updLoading }] = useMutation(UPDATE_DEMAND, {
        onCompleted: () => {
            void refetch()
            setIsDrawerOpen(false)
            setSelectedProduct(null)
        },
    })

    const [transferStock, { loading: xferLoading }] = useMutation(
        TRANSFER_STOCK,
        {
            onCompleted: () => {
                void refetch()
                setIsDrawerOpen(false)
                setSelectedProduct(null)
            },
        },
    )

    useEffect(() => {
        setPage(1)
    }, [search, status, warehouse])

    const warehouses = (wData?.warehouses ?? []) as { code: string }[]
    const products: Product[] = (pData?.products?.products ?? []) as Product[]
    const totalProducts = Number(pData?.products?.total ?? 0)
    const totalPages = Math.ceil(totalProducts / pageSize)

    const warehouseCodes = useMemo(
        () => warehouses.map((w) => w.code),
        [warehouses],
    )

    const kpis = useMemo(() => {
        if (!pData?.products?.products)
            return { totalStock: 0, totalDemand: 0, fillRate: 0 }

        const allProducts = pData.products.products
        const totalStock = allProducts.reduce(
            (sum: number, p: Product) => sum + p.stock,
            0,
        )
        const totalDemand = allProducts.reduce(
            (sum: number, p: Product) => sum + p.demand,
            0,
        )
        const fillableStock = allProducts.reduce(
            (sum: number, p: Product) => sum + Math.min(p.stock, p.demand),
            0,
        )
        const fillRate =
            totalDemand > 0 ? (fillableStock / totalDemand) * 100 : 0

        return { totalStock, totalDemand, fillRate }
    }, [pData?.products?.products])

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product)
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
        setSelectedProduct(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200">
            <AppHeader totalProducts={totalProducts} />

            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <KPICard
                            title="Total Stock"
                            value={kpis.totalStock.toLocaleString()}
                            subtitle="units in inventory"
                            icon={<CubeIcon />}
                            color="blue"
                        />
                        <KPICard
                            title="Total Demand"
                            value={kpis.totalDemand.toLocaleString()}
                            subtitle="units required"
                            icon={<ChartBarIcon />}
                            color="purple"
                        />
                        <KPICard
                            title="Fill Rate"
                            value={`${kpis.fillRate.toFixed(1)}%`}
                            subtitle="demand fulfillment"
                            icon={<CheckCircleIcon />}
                            color={
                                kpis.fillRate >= 90
                                    ? 'green'
                                    : kpis.fillRate >= 70
                                      ? 'amber'
                                      : 'purple'
                            }
                        />
                    </div>

                    <div className="mb-8">
                        <StockDemandChart />
                    </div>

                    <Filters
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        warehouse={warehouse}
                        setWarehouse={setWarehouse}
                        warehouseCodes={warehouseCodes}
                        loading={pLoading}
                    />
                </div>

                {(wLoading || pLoading) && (
                    <div className="flex flex-col justify-center items-center py-16">
                        <div className="relative">
                            <div className="spinner h-12 w-12"></div>
                            <div className="spinner-overlay h-12 w-12"></div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium">Loading inventory...</p>
                    </div>
                )}

                {!pLoading && products.length === 0 && (
                    <div className="glass-card p-16 text-center max-w-5xl mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ArchiveBoxIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Try adjusting your search or filter criteria to find what you're looking for
                        </p>
                    </div>
                )}

                <div className="grid gap-4 animate-in max-w-5xl mx-auto">
                    {products.map((p, index) => (
                        <div
                            key={`${p.id}-${p.warehouse}`}
                            className="animate-in"
                            style={{ animationDelay: `${String(index * 50)}ms` }}
                        >
                            <ProductCard product={p} onClick={handleProductClick} />
                        </div>
                    ))}
                </div>

                {totalProducts > 0 && (
                    <div className="mt-12 flex justify-between items-center glass-card p-6 max-w-5xl mx-auto">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-bold text-indigo-600">{(page - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-bold text-indigo-600">{Math.min(page * pageSize, totalProducts)}</span> of{' '}
                                <span className="font-bold text-indigo-600">{totalProducts}</span> results
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setPage((p) => p - 1); }}
                                disabled={page === 1}
                                className="btn btn-secondary"
                            >
                                Previous
                            </button>
                            <div className="flex items-center px-3 py-2 bg-indigo-100/50 backdrop-blur-sm rounded-xl">
                                <span className="text-sm font-bold text-indigo-700">{page}</span>
                                <span className="text-sm text-indigo-500 mx-1">of</span>
                                <span className="text-sm font-bold text-indigo-700">{totalPages}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setPage((p) => p + 1); }}
                                disabled={page === totalPages}
                                className="btn btn-primary border border-indigo-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                <ProductDrawer
                    product={selectedProduct}
                    isOpen={isDrawerOpen}
                    onClose={handleCloseDrawer}
                    allWarehouses={warehouseCodes}
                    onUpdateDemand={async (id, demand) => {
                        try {
                            await updateDemand({
                                variables: { id, demand: Number(demand) },
                            })
                        } catch (e: unknown) {
                            alert((e as Error)?.message ?? String(e))
                        }
                    }}
                    onTransfer={async ({ id, from, to, qty }) => {
                        try {
                            await transferStock({
                                variables: { id, from, to, qty: Number(qty) },
                            })
                        } catch (e: unknown) {
                            console.error('Transfer error:', e)
                            alert((e as Error)?.message ?? 'Transfer failed')
                        }
                    }}
                    busy={updLoading || xferLoading}
                />
            </main>
        </div>
    )
}

export default function App() {
    return (
        <DateRangeProvider>
            <AppContent />
        </DateRangeProvider>
    )
}
