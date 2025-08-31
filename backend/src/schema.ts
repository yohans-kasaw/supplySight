export const typeDefs = `
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type ProductsPage {
    products: [Product!]!
    total: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type ProductKPIs {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
  }

  type Query {
    products(search: String, status: String, warehouse: String, page: Int, pageSize: Int): ProductsPage!
    productKPIs(search: String, status: String, warehouse: String): ProductKPIs!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`
