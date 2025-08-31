export interface Warehouse {
    code: string
    name: string
    city: string
    country: string
}

export interface Product {
    id: string
    name: string
    sku: string
    warehouse: string
    stock: number
    demand: number
}

export interface KPI {
    date: string
    stock: number
    demand: number
}
