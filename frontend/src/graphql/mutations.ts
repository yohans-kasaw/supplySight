import { gql } from '@apollo/client'

export const UPDATE_DEMAND = gql`
    mutation UpdateDemand($id: ID!, $demand: Int!) {
        updateDemand(id: $id, demand: $demand) {
            id
            demand
        }
    }
`

export const TRANSFER_STOCK = gql`
    mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
        transferStock(id: $id, from: $from, to: $to, qty: $qty) {
            id
            name
            sku
            warehouse
            stock
            demand
        }
    }
`
