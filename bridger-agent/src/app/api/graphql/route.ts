import { greetings } from "@/server/modules/greet/api";
import { transactions } from "@/server/modules/transactions/api";
import { createSchema, createYoga } from "graphql-yoga";

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      # Valid status values:
      # - NEEDS_TO_BE_SENT_TO_CLIENT
      # - APPROVED
      # - EXCLUDED
      # - AUTOCATEGORIZED
      # - SENT_TO_CLIENT
      
      type Transaction {
        id: String!
        date: String!
        amountCents: Int!
        status: String!
        description: String!
        memo: String
        category: String
        vendor: String
      }
      
      type Query {
        greetings: String
        transactions(status: String!): [Transaction!]!
      }
    `,
    resolvers: {
      Query: {
        greetings,
        transactions,
      },
    },
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",

  // Yoga needs to know how to create a valid Next.js response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
