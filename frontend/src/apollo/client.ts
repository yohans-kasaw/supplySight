import { ApolloClient, InMemoryCache, HttpLink  } from '@apollo/client'

const VITE_GRAPHQL_URL: string = (import.meta.env.VITE_GRAPHQL_URL as string)

if (!VITE_GRAPHQL_URL) {
    throw new Error(
        'VITE_GRAPHQL_URL is not defined. Please check your .env file.',
    )
}

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
})
