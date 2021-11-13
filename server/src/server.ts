import { makeExecutableSchema } from '@graphql-tools/schema'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import resolvers from './resolvers'
import { typeDefs } from './typeDefs'

import * as dotenv from 'dotenv'

dotenv.config()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const prisma = new PrismaClient()

//

//postgres://lgrgkkzxwcnvun:59f594ad00148293b6378156a02687d45951414c2c5c9357e248301cb9af7cca@ec2-54-145-188-92.compute-1.amazonaws.com:5432/d46sbg973bqpvd

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    request: req,
    prisma,
  }),
})

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`Server ready at: ${url}`))
  .catch((err) => console.error(err))
