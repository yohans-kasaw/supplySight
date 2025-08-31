export type Warehouse = {
    code: string
    name: string
    city: string
    country: string
}

export type Product = {
    id: string
    name: string
    sku: string
    warehouse: string
    stock: number
    demand: number
}

export type KPI = {
    date: string
    stock: number
    demand: number
}
