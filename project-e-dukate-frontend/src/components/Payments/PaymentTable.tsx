import React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTheme, useMediaQuery } from '@mui/material';
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
  isAdmin: boolean;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
  isAdmin,
}) => {
  const theme = useTheme();
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración responsive para las celdas
  const getCellStyles = (isHeader = false) => {
    const baseStyles = {
      color: "black",
      fontWeight: isHeader ? "bold" : "normal",
      padding: isVerySmallScreen ? "8px 4px" : "12px 8px",
      textAlign: "center",
      borderBottom: "1px solid #e0e0e0",
      fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
      wordWrap: "break-word",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "120px",
    };

    return baseStyles;
  };

  const headerCellStyles = (width: string) => ({
    ...getCellStyles(true),
    width: isVerySmallScreen ? "auto" : width,
    minWidth: isVerySmallScreen ? "60px" : "80px",
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      <Table 
        sx={{ 
          minWidth: isVerySmallScreen ? "800px" : "100%",
          tableLayout: isVerySmallScreen ? "fixed" : "auto",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyles("12%")}>
              {isVerySmallScreen ? "Paciente" : "Paciente"}
            </TableCell>
            <TableCell sx={headerCellStyles("10%")}>
              {isVerySmallScreen ? "Inicio" : "Fecha de inicio"}
            </TableCell>
            <TableCell sx={headerCellStyles("10%")}>
              {isVerySmallScreen ? "Fin" : "Fecha de finalización"}
            </TableCell>
            <TableCell sx={headerCellStyles("6%")}>
              {isVerySmallScreen ? "Ses." : "Sesiones"}
            </TableCell>
            <TableCell sx={headerCellStyles("8%")}>
              Costo
            </TableCell>
            <TableCell sx={headerCellStyles("10%")}>
              {isVerySmallScreen ? "Pagado" : "Monto pagado"}
            </TableCell>
            <TableCell sx={headerCellStyles("10%")}>
              {isVerySmallScreen ? "Pendiente" : "Monto pendiente"}
            </TableCell>
            <TableCell sx={headerCellStyles("8%")}>
              {isVerySmallScreen ? "Terapia" : "Terapia"}
            </TableCell>
            <TableCell sx={headerCellStyles("10%")}>
              {isVerySmallScreen ? "Inst." : "Institución"}
            </TableCell>
            <TableCell sx={headerCellStyles("8%")}>
              Estado
            </TableCell>
            <TableCell sx={headerCellStyles("8%")}>
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
                isAdmin={isAdmin}
                isVerySmallScreen={isVerySmallScreen}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={11}
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