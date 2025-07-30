import { gql } from "@apollo/client";

export const TRANSACTIONS = gql(`
    query Transactions($status: String!) {
        transactions(status: $status) {
            id
            date
            description
            vendor
            category
            amountCents
            status
            memo
        }
    }
`);
