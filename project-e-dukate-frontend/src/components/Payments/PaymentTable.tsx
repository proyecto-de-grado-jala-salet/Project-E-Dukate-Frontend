import React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { PaymentTableRow } from "./PaymentTableRow";
import { Payment } from "../../types/payments";

interface PaymentTableProps {
  payments: Payment[];
  editedValues: { [key: string]: { sessionCost: string; amountPaid: string } };
  onValueChange: (
    id: string,
    field: "sessionCost" | "amountPaid",
    value: string
  ) => void;
  getPatientName: (patientId: string) => string;
  formatDate: (date: string | null) => string;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "15%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Paciente
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Fecha de inicio
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Fecha de finalización
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "5%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Sesiones
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Costo
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Monto pagado
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Monto pendiente
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Terapia
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "10%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Institución
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "5%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Estado
            </TableCell>
            <TableCell
              sx={{
                color: "black",
                fontWeight: "bold",
                padding: "16px 24px",
                width: "5%",
                textAlign: "center",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <PaymentTableRow
                key={payment.id}
                payment={payment}
                editedValues={editedValues[payment.id]}
                onValueChange={onValueChange}
                getPatientName={getPatientName}
                formatDate={formatDate}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={12}
                sx={{
                  color: "black",
                  padding: "32px 24px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                }}
              >
                No se encontraron elementos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};