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
  isMobile?: boolean;
  isVerySmallScreen?: boolean;
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
  payment,
  editedValues,
  onValueChange,
  getPatientName,
  formatDate,
  isAdmin = false,
  isMobile = false,
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
    padding: isMobile ? "6px 2px" : isVerySmallScreen ? "8px 4px" : "12px 8px",
    textAlign: "center" as const,
    fontSize: isMobile ? '0.7rem' : isVerySmallScreen ? '0.75rem' : '0.875rem',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderBottom: "1px solid #e0e0e0",
  });

  // Formatear nombres para pantallas pequeñas
  const formatPatientName = (name: string) => {
    if (isMobile && name.length > 10) {
      return name.substring(0, 8) + '..';
    }
    if (isVerySmallScreen && name.length > 15) {
      return name.substring(0, 13) + '..';
    }
    return name;
  };

  // Formatear fechas para pantallas pequeñas
  const formatDateResponsive = (date: string | null) => {
    const formattedDate = formatDate(date);
    if (isMobile) {
      // Para móvil: DD/MM
      return formattedDate.split('/').slice(0, 2).join('/');
    }
    if (isVerySmallScreen) {
      // Para pantallas pequeñas: DD/MM/YY
      return formattedDate.split('/').slice(0, 3).join('/');
    }
    return formattedDate;
  };

  // Mostrar moneda condicionalmente
  const showCurrency = !isMobile;

  return (
    <TableRow key={payment.id}>
      {/* Paciente */}
      <TableCell sx={getCellStyles()}>
        <Typography 
          sx={{ 
            fontSize: 'inherit',
            fontWeight: 'medium',
          }}
          title={getPatientName(payment.patientId)} // Tooltip con nombre completo
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
          <Box sx={{ minWidth: isMobile ? 60 : 70 }}>
            <EditableCurrencyField
              value={values.sessionCost}
              onChange={(value) => onValueChange(payment.id, "sessionCost", value)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Typography sx={{ color: "black", fontSize: 'inherit' }}>
              {payment.sessionCost}
            </Typography>
            {showCurrency && (
              <Typography sx={{ color: "black", fontSize: '0.7rem' }}>
                bs.
              </Typography>
            )}
          </Box>
        )}
      </TableCell>

      {/* Monto Pagado */}
      <TableCell sx={getCellStyles()}>
        {isAdmin ? (
          <Box sx={{ minWidth: isMobile ? 60 : 70 }}>
            <EditableCurrencyField
              value={values.amountPaid}
              onChange={(value) => onValueChange(payment.id, "amountPaid", value)}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Typography sx={{ color: "black", fontSize: 'inherit' }}>
              {payment.amountPaid}
            </Typography>
            {showCurrency && (
              <Typography sx={{ color: "black", fontSize: '0.7rem' }}>
                bs.
              </Typography>
            )}
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
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.pendingAmount}
          </Typography>
          {showCurrency && (
            <Typography sx={{ fontSize: '0.7rem' }}>
              bs.
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.specialistAmount}
          </Typography>
          {showCurrency && (
            <Typography sx={{ fontSize: '0.7rem' }}>
              bs.
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell sx={getCellStyles()}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 'inherit' }}>
            {payment.institutionAmount}
          </Typography>
          {showCurrency && (
            <Typography sx={{ fontSize: '0.7rem' }}>
              bs.
            </Typography>
          )}
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
            borderRadius: "6px",
            padding: isMobile ? "1px 3px" : "2px 6px",
            fontSize: isMobile ? '0.6rem' : '0.7rem',
            lineHeight: 1.2,
            minWidth: isMobile ? 45 : 55,
          }}
        >
          {payment.status === "Completed" 
            ? (isMobile ? "OK" : "Comp.") 
            : (isMobile ? "Pen." : "Pend.")
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
          }}
        >
          <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
            {payment.totalAmount}
          </Typography>
          {showCurrency && (
            <Typography sx={{ fontSize: '0.7rem' }}>
              bs.
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};