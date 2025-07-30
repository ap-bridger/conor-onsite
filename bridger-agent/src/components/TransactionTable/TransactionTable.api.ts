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

export const UPDATE_TRANSACTION_MEMO = gql`
  mutation UpdateTransactionMemo($id: String!, $memo: String) {
    updateTransactionMemo(id: $id, memo: $memo) {
      success
      message
      transaction {
        id
        memo
      }
    }
  }
`;
