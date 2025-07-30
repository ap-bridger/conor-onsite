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

export const SEND_INFO_REQUEST = gql(`
    mutation SendInfoRequest($ids: [String!]!) {
        sendInfoRequest(ids: $ids) {
            id
            status
        }
    }`);
