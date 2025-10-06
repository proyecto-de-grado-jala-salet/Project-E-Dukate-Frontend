import React from "react";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  isAdmin?: boolean;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
  isAdmin = false,
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
      
      {/* Celda de SessionCost */}
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {isAdmin ? (
          <EditableCurrencyField
            value={values.sessionCost}
            onChange={(value) => onValueChange(payment.id, "sessionCost", value)}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "black" }}>
              {payment.sessionCost}
            </Typography>
            <Typography sx={{ color: "black" }}>bs.</Typography>
          </Box>
        )}
      </TableCell>

      {/* Celda de AmountPaid */}
      <TableCell sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}>
        {isAdmin ? (
          <EditableCurrencyField
            value={values.amountPaid}
            onChange={(value) => onValueChange(payment.id, "amountPaid", value)}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "black" }}>
              {payment.amountPaid}
            </Typography>
            <Typography sx={{ color: "black" }}>bs.</Typography>
          </Box>
        )}
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