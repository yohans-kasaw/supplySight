export interface Product {
    id: string
    name: string
    sku: string
    warehouse: string
    stock: number
    demand: number
}

export interface ProductStatus {
    label: string
    color: 'yellow' | 'green' | 'red'
}

export interface TransferInput {
    id: string
    from: string
    to: string
    qty: number
}
