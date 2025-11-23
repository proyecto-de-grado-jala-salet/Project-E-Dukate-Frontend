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
  isVerySmallScreen?: boolean;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
  isAdmin = false,
  isVerySmallScreen = false,
}) => {
  const defaultValues = {
    sessionCost: payment.sessionCost.toString(),
    amountPaid: payment.amountPaid.toString(),
  };

  const values = editedValues || defaultValues;

  // Estilos responsive para celdas
  const getCellStyles = () => ({
    color: "black",
    padding: isVerySmallScreen ? "8px 4px" : "12px 8px",
    textAlign: "center" as const,
    fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
    borderBottom: "1px solid #e0e0e0",
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  });

  // Formatear números para pantallas pequeñas
  const formatNumber = (num: number) => {
    if (isVerySmallScreen && num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Formatear fechas para pantallas pequeñas
  const formatDateCompact = (date: string | null) => {
    if (!date) return "-";
    if (isVerySmallScreen) {
      const dateObj = new Date(date);
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    }
    return formatDate(date);
  };

  return (
    <TableRow key={payment.id}>
      {/* Paciente */}
      <TableCell sx={getCellStyles()}>
        <Box sx={{ 
          maxWidth: "100px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {getPatientName(payment.patientId)}
        </Box>
      </TableCell>

      {/* Fechas */}
      <TableCell sx={getCellStyles()}>
        {formatDateCompact(payment.firstPaymentDate)}
      </TableCell>
      <TableCell sx={getCellStyles()}>
        {formatDateCompact(payment.lastPaymentDate)}
      </TableCell>

      {/* Sesiones */}
      <TableCell sx={getCellStyles()}>
        {formatNumber(payment.sessionCount)}
      </TableCell>
      
      {/* Costo */}
      <TableCell sx={getCellStyles()}>
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
              gap: 0.5,
              flexWrap: "nowrap",
            }}
          >
            <Typography sx={{ 
              color: "black", 
              fontSize: "inherit",
              lineHeight: 1 
            }}>
              {formatNumber(payment.sessionCost)}
            </Typography>
            <Typography sx={{ 
              color: "black", 
              fontSize: "0.7rem",
              lineHeight: 1 
            }}>
              {isVerySmallScreen ? "" : "bs."}
            </Typography>
          </Box>
        )}
      </TableCell>

      {/* Monto Pagado */}
      <TableCell sx={getCellStyles()}>
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
              gap: 0.5,
              flexWrap: "nowrap",
            }}
          >
            <Typography sx={{ 
              color: "black", 
              fontSize: "inherit",
              lineHeight: 1 
            }}>
              {formatNumber(payment.amountPaid)}
            </Typography>
            <Typography sx={{ 
              color: "black", 
              fontSize: "0.7rem",
              lineHeight: 1 
            }}>
              {isVerySmallScreen ? "" : "bs."}
            </Typography>
          </Box>
        )}
      </TableCell>

      {/* Montos restantes */}
      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "nowrap",
          }}
        >
          <Typography sx={{ 
            color: "black", 
            fontSize: "inherit",
            lineHeight: 1 
          }}>
            {formatNumber(payment.pendingAmount)}
          </Typography>
          <Typography sx={{ 
            color: "black", 
            fontSize: "0.7rem",
            lineHeight: 1 
          }}>
            {isVerySmallScreen ? "" : "bs."}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "nowrap",
          }}
        >
          <Typography sx={{ 
            color: "black", 
            fontSize: "inherit",
            lineHeight: 1 
          }}>
            {formatNumber(payment.specialistAmount)}
          </Typography>
          <Typography sx={{ 
            color: "black", 
            fontSize: "0.7rem",
            lineHeight: 1 
          }}>
            {isVerySmallScreen ? "" : "bs."}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "nowrap",
          }}
        >
          <Typography sx={{ 
            color: "black", 
            fontSize: "inherit",
            lineHeight: 1 
          }}>
            {formatNumber(payment.institutionAmount)}
          </Typography>
          <Typography sx={{ 
            color: "black", 
            fontSize: "0.7rem",
            lineHeight: 1 
          }}>
            {isVerySmallScreen ? "" : "bs."}
          </Typography>
        </Box>
      </TableCell>

      {/* Estado */}
      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: payment.status === "Completed" ? "#d4edda" : "#fff3cd",
            color: payment.status === "Completed" ? "#155724" : "#856404",
            borderRadius: "8px",
            padding: "2px 6px",
            fontSize: isVerySmallScreen ? "0.7rem" : "0.75rem",
            minWidth: isVerySmallScreen ? "60px" : "80px",
          }}
        >
          {payment.status === "Completed" 
            ? (isVerySmallScreen ? "Comp." : "Completado") 
            : (isVerySmallScreen ? "Pend." : "Pendiente")}
        </Box>
      </TableCell>

      {/* Total */}
      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "nowrap",
            fontWeight: "bold",
          }}
        >
          <Typography sx={{ 
            color: "black", 
            fontSize: "inherit",
            lineHeight: 1,
            fontWeight: "inherit"
          }}>
            {formatNumber(payment.totalAmount)}
          </Typography>
          <Typography sx={{ 
            color: "black", 
            fontSize: "0.7rem",
            lineHeight: 1 
          }}>
            {isVerySmallScreen ? "" : "bs."}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};