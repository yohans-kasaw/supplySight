import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express from 'express'
import type { Request } from 'express'
import http from 'http'
import cors from 'cors'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'

async function main() {
    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    })

    await server.start()

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['http://localhost:5173'],
            credentials: true,
        }),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }: { req: Request }) => {
                const ip = req.socket.remoteAddress ?? 'unknown'
                return { ip }
            },
        }),
    )

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve),
    )
    console.info(`Mock GraphQL Server ready at http://localhost:4000/graphql`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
