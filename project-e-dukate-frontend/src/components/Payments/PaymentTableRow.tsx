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
  isSmallScreen?: boolean;
  isVerySmallScreen?: boolean;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
  isAdmin = false,
  isSmallScreen = false,
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
    fontSize: isVerySmallScreen ? '0.75rem' : isSmallScreen ? '0.8rem' : '0.875rem',
    wordWrap: 'break-word' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  // Formatear nombres largos para pantallas pequeñas
  const formatPatientName = (name: string) => {
    if (isVerySmallScreen && name.length > 12) {
      return name.substring(0, 10) + '...';
    }
    if (isSmallScreen && name.length > 15) {
      return name.substring(0, 13) + '...';
    }
    return name;
  };

  // Formatear fechas para pantallas pequeñas
  const formatDateResponsive = (date: string | null) => {
    const formattedDate = formatDate(date);
    if (isVerySmallScreen) {
      return formattedDate.replace(/\//g, '/').substring(0, 5);
    }
    return formattedDate;
  };

  return (
    <TableRow key={payment.id}>
      {/* Paciente */}
      <TableCell sx={getCellStyles()}>
        <Typography 
          sx={{ 
            fontSize: 'inherit',
            lineHeight: 1.2 
          }}
        >
          {formatPatientName(getPatientName(payment.patientId))}
        </Typography>
      </TableCell>

      {/* Fechas */}
      <TableCell sx={getCellStyles()}>
        {formatDateResponsive(payment.firstPaymentDate)}
      </TableCell>
      <TableCell sx={getCellStyles()}>
        {formatDateResponsive(payment.lastPaymentDate)}
      </TableCell>

      {/* Sesiones */}
      <TableCell sx={getCellStyles()}>
        {payment.sessionCount}
      </TableCell>
      
      {/* Costo de Sesión */}
      <TableCell sx={getCellStyles()}>
        {isAdmin ? (
          <EditableCurrencyField
            value={values.sessionCost}
            onChange={(value) => onValueChange(payment.id, "sessionCost", value)}
            size={isVerySmallScreen ? "small" : "medium"}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              flexDirection: isVerySmallScreen ? 'column' : 'row',
            }}
          >
            <Typography sx={{ color: "black", fontSize: 'inherit' }}>
              {payment.sessionCost}
            </Typography>
            <Typography sx={{ color: "black", fontSize: '0.7rem' }}>
              {isVerySmallScreen ? '' : 'bs.'}
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
            size={isVerySmallScreen ? "small" : "medium"}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              flexDirection: isVerySmallScreen ? 'column' : 'row',
            }}
          >
            <Typography sx={{ color: "black", fontSize: 'inherit' }}>
              {payment.amountPaid}
            </Typography>
            <Typography sx={{ color: "black", fontSize: '0.7rem' }}>
              {isVerySmallScreen ? '' : 'bs.'}
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
            flexDirection: isVerySmallScreen ? 'column' : 'row',
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.pendingAmount}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem' }}>
            {isVerySmallScreen ? '' : 'bs.'}
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
            flexDirection: isVerySmallScreen ? 'column' : 'row',
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.specialistAmount}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem' }}>
            {isVerySmallScreen ? '' : 'bs.'}
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
            flexDirection: isVerySmallScreen ? 'column' : 'row',
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.institutionAmount}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem' }}>
            {isVerySmallScreen ? '' : 'bs.'}
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
            padding: isVerySmallScreen ? "2px 4px" : "4px 8px",
            fontSize: isVerySmallScreen ? '0.65rem' : '0.75rem',
            lineHeight: 1,
          }}
        >
          {payment.status === "Completed" 
            ? (isVerySmallScreen ? "Comp." : "Completado") 
            : (isVerySmallScreen ? "Pend." : "Pendiente")
          }
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
            flexDirection: isVerySmallScreen ? 'column' : 'row',
          }}
        >
          <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
            {payment.totalAmount}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem' }}>
            {isVerySmallScreen ? '' : 'bs.'}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};