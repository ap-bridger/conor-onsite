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

export const AUTOCATEGORIZED_TRANSACTIONS = gql(`
    query AutocategorizedTransactions {
        transactions(status: "AUTOCATEGORIZED") {
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

export const SYNCED_TRANSACTIONS = gql(`
    query SyncedTransactions {
        transactions(statuses: ["APPROVED", "EXCLUDED"]) {
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

export const NEEDS_ACTION_TRANSACTIONS = gql(`
    query NeedsActionTransactions {
        transactions(statuses: ["NEEDS_TO_BE_SENT_TO_CLIENT", "SENT_TO_CLIENT"]) {
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

export const GET_UNIQUE_VENDORS = gql`
  query GetUniqueVendors {
    getUniqueVendors
  }
`;

export const GET_UNIQUE_CATEGORIES = gql`
  query GetUniqueCategories {
    getUniqueCategories
  }
`;

export const UPDATE_TRANSACTION_VENDOR = gql`
  mutation UpdateTransactionVendor($id: String!, $vendor: String!) {
    updateTransactionVendor(id: $id, vendor: $vendor) {
      success
      message
      transaction {
        id
        vendor
      }
    }
  }
`;

export const UPDATE_TRANSACTION_CATEGORY = gql`
  mutation UpdateTransactionCategory($id: String!, $category: String!) {
    updateTransactionCategory(id: $id, category: $category) {
      success
      message
      transaction {
        id
        category
      }
    }
  }
`;
