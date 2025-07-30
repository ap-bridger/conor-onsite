import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { SEND_INFO_REQUEST, TRANSACTIONS } from "./TransactionTable.api";
import { useMutation, useQuery } from "@apollo/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Transaction } from "./types";
import { formatCentsToDollars } from "@/lib/formatters";
import { DataTable } from "../Table/DataTable.component";

const helper = createColumnHelper<Transaction>();
const columns = [
  helper.accessor("date", {
    header: "Date",
    cell: (info) => {
      const dt = new Date(Number(info.getValue()));
      return dt.toLocaleDateString();
    },
  }),
  helper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("amountCents", {
    header: "Amount",
    cell: (info) => {
      const value = info.getValue();
      return formatCentsToDollars(value);
    },
  }),
];
export const RequestInfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data } = useQuery(TRANSACTIONS, {
    variables: {
      status: "NEEDS_TO_BE_SENT_TO_CLIENT",
    },
  });
  const transactions = data?.transactions || [];
  const [sendInfoRequest, {}] = useMutation(SEND_INFO_REQUEST, {
    refetchQueries: [TRANSACTIONS],
  });

  const onSend = () => {
    sendInfoRequest({
      variables: {
        ids: transactions.map((transaction: Transaction) => transaction.id),
      },
      onError: () => alert("Error!"),
      onCompleted: () => alert("Success!"),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Info From Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start">
            <DataTable data={transactions} columns={columns} width="100%" />
            <Text>Add note to client</Text>
            <Textarea />
            <Button onClick={onSend}>Send Request</Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
