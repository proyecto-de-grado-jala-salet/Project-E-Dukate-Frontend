import React from "react";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import { EditableCurrencyField } from "./EditableCurrencyField";
import { Payment } from "@/types/payments";

interface PaymentTableRowProps {
  payment: Payment;
  editedValues: { sessionCost: string; amountPaid: string } | undefined;
  onValueChange: (
    id: string,
    field: "sessionCost" | "amountPaid",
    value: string
  ) => void;
  getPatientName: (patientId: string) => string;
  formatDate: (date: string | null) => string;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
}) => {
  const defaultValues = {
    sessionCost: payment.sessionCost.toString(),
    amountPaid: payment.amountPaid.toString(),
  };

  const values = editedValues || defaultValues;

  return (
    <TableRow key={payment.id}>
      <TableCell sx={{ color: "black", padding: "6px", textAlign: "center" }}>
        {getPatientName(payment.patientId)}
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {formatDate(payment.firstPaymentDate)}
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {formatDate(payment.lastPaymentDate)}
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {payment.sessionCount}
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        <EditableCurrencyField
          value={values.sessionCost}
          onChange={(value) => onValueChange(payment.id, "sessionCost", value)}
        />
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        <EditableCurrencyField
          value={values.amountPaid}
          onChange={(value) => onValueChange(payment.id, "amountPaid", value)}
        />
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {payment.pendingAmount} bs.
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {payment.specialistAmount} bs.
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {payment.institutionAmount} bs.
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: payment.status === "Completed" ? "#d4edda" : "#fff3cd",
            color: payment.status === "Completed" ? "#155724" : "#856404",
            borderRadius: "12px",
            padding: "4px 8px",
          }}
        >
          {payment.status === "Completed" ? "Completado" : "Pendiente"}
        </Box>
      </TableCell>
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {payment.totalAmount} bs.
      </TableCell>
    </TableRow>
  );
};