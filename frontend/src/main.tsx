import { ApolloProvider } from '@apollo/client/react'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
})

const rootElm = document.getElementById('root')
if (!rootElm) {
    throw new Error('Failed to find the root element with ID "root".')
}

createRoot(rootElm).render(
    <ApolloProvider client={apolloClient}>
        <StrictMode>
            <App />
        </StrictMode>
    </ApolloProvider>,
)
