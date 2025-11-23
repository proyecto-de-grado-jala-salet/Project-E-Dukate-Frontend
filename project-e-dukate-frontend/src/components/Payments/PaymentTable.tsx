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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración responsive de columnas
  const getColumnStyles = (columnKey: string) => {
    const baseStyles = {
      color: "black",
      fontWeight: "bold",
      padding: "12px 8px",
      textAlign: "center",
      borderBottom: "1px solid #e0e0e0",
    };

    const columnConfig = {
      // Para pantallas muy pequeñas
      paciente: {
        width: isVerySmallScreen ? '20%' : isSmallScreen ? '18%' : '15%',
        fontSize: isVerySmallScreen ? '0.75rem' : '0.875rem',
      },
      fechaInicio: {
        width: isVerySmallScreen ? '12%' : isSmallScreen ? '10%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      fechaFinalizacion: {
        width: isVerySmallScreen ? '12%' : isSmallScreen ? '10%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      sesiones: {
        width: isVerySmallScreen ? '8%' : isSmallScreen ? '6%' : '5%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      costo: {
        width: isVerySmallScreen ? '10%' : isSmallScreen ? '9%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      montoPagado: {
        width: isVerySmallScreen ? '10%' : isSmallScreen ? '9%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      montoPendiente: {
        width: isVerySmallScreen ? '10%' : isSmallScreen ? '9%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      terapia: {
        width: isVerySmallScreen ? '10%' : isSmallScreen ? '9%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      institucion: {
        width: isVerySmallScreen ? '10%' : isSmallScreen ? '9%' : '10%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      estado: {
        width: isVerySmallScreen ? '8%' : isSmallScreen ? '6%' : '5%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
      total: {
        width: isVerySmallScreen ? '8%' : isSmallScreen ? '6%' : '5%',
        fontSize: isVerySmallScreen ? '0.7rem' : '0.8rem',
      },
    };

    return {
      ...baseStyles,
      ...columnConfig[columnKey as keyof typeof columnConfig],
    };
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        overflow: "auto",
        maxWidth: "100%",
      }}
    >
      <Table 
        sx={{ 
          minWidth: isVerySmallScreen ? 800 : 1000,
          tableLayout: 'fixed',
          width: '100%'
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={getColumnStyles('paciente')}>
              {isVerySmallScreen ? 'Pac.' : 'Paciente'}
            </TableCell>
            <TableCell sx={getColumnStyles('fechaInicio')}>
              {isVerySmallScreen ? 'Inicio' : 'Fecha de inicio'}
            </TableCell>
            <TableCell sx={getColumnStyles('fechaFinalizacion')}>
              {isVerySmallScreen ? 'Fin' : 'Fecha de finalización'}
            </TableCell>
            <TableCell sx={getColumnStyles('sesiones')}>
              {isVerySmallScreen ? 'Ses.' : 'Sesiones'}
            </TableCell>
            <TableCell sx={getColumnStyles('costo')}>
              Costo
            </TableCell>
            <TableCell sx={getColumnStyles('montoPagado')}>
              {isVerySmallScreen ? 'Pagado' : 'Monto pagado'}
            </TableCell>
            <TableCell sx={getColumnStyles('montoPendiente')}>
              {isVerySmallScreen ? 'Pendiente' : 'Monto pendiente'}
            </TableCell>
            <TableCell sx={getColumnStyles('terapia')}>
              {isVerySmallScreen ? 'Terap.' : 'Terapia'}
            </TableCell>
            <TableCell sx={getColumnStyles('institucion')}>
              {isVerySmallScreen ? 'Inst.' : 'Institución'}
            </TableCell>
            <TableCell sx={getColumnStyles('estado')}>
              Estado
            </TableCell>
            <TableCell sx={getColumnStyles('total')}>
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
                isSmallScreen={isSmallScreen}
                isVerySmallScreen={isVerySmallScreen}
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