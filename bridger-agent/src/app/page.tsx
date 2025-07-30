"use client";

import { apolloClient } from "@/client/graphql/apollo-client";
import { TransactionTable } from "@/components/TransactionTable/TransactionTable";
import { ApolloProvider } from "@apollo/client";

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-7xl">
          <TransactionTable />
        </main>
      </div>
    </ApolloProvider>
  );
}
