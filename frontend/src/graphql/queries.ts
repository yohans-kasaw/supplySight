import { gql } from '@apollo/client'

export const WAREHOUSES_QUERY = gql`
    query Warehouses {
        warehouses {
            code
            name
        }
    }
`

export const PRODUCTS_QUERY = gql`
    query Products(
        $search: String
        $status: String
        $warehouse: String
        $page: Int
        $pageSize: Int
    ) {
        products(
            search: $search
            status: $status
            warehouse: $warehouse
            page: $page
            pageSize: $pageSize
        ) {
            products {
                id
                name
                sku
                warehouse
                stock
                demand
            }
            total
        }
    }
`

export const KPIS_QUERY = gql`
    query KPIs($range: String!) {
        kpis(range: $range) {
            date
            stock
            demand
        }
    }
`
