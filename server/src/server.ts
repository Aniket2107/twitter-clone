import { makeExecutableSchema } from '@graphql-tools/schema'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import resolvers from './resolvers'
import { typeDefs } from './typeDefs'

import * as dotenv from 'dotenv'

dotenv.config()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const prisma = new PrismaClient()

new ApolloServer({
  schema,
  context: ({ req }) => ({
    request: req,
    prisma,
  }),
}).listen({ port: 4000 }, () =>
  console.log(`Server ready at: http://localhost:4000`),
)
