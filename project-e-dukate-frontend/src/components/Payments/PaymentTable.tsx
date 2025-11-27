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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración de columnas que se ajustan automáticamente
  const getColumnStyles = (columnKey: string) => {
    const baseStyles = {
      color: "black",
      fontWeight: "bold",
      textAlign: "center" as const,
      borderBottom: "1px solid #e0e0e0",
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    const paddingConfig = {
      mobile: "6px 2px",
      small: "8px 4px",
      normal: "12px 8px"
    };

    const getPadding = () => {
      if (isMobile) return paddingConfig.mobile;
      if (isVerySmallScreen) return paddingConfig.small;
      return paddingConfig.normal;
    };

    const getFontSize = () => {
      if (isMobile) return '0.7rem';
      if (isVerySmallScreen) return '0.75rem';
      return '0.875rem';
    };

    // Usar porcentajes en lugar de widths fijos
    const columnConfig = {
      paciente: { width: '15%' },
      fechaInicio: { width: '10%' },
      fechaFinalizacion: { width: '10%' },
      sesiones: { width: '8%' },
      costo: { width: '9%' },
      montoPagado: { width: '9%' },
      montoPendiente: { width: '9%' },
      terapia: { width: '9%' },
      institucion: { width: '9%' },
      estado: { width: '6%' },
      total: { width: '6%' },
    };

    return {
      ...baseStyles,
      ...columnConfig[columnKey as keyof typeof columnConfig],
      padding: getPadding(),
      fontSize: getFontSize(),
    };
  };

  // Textos adaptativos para headers
  const getHeaderText = (key: string) => {
    if (isMobile) {
      const mobileTexts = {
        paciente: 'Paciente',
        fechaInicio: 'Inicio',
        fechaFinalizacion: 'Fin',
        sesiones: 'Ses.',
        costo: 'Costo',
        montoPagado: 'Pagado',
        montoPendiente: 'Pendiente',
        terapia: 'Terapia',
        institucion: 'Inst.',
        estado: 'Estado',
        total: 'Total',
      };
      return mobileTexts[key as keyof typeof mobileTexts];
    }

    if (isVerySmallScreen) {
      const smallTexts = {
        paciente: 'Paciente',
        fechaInicio: 'F. Inicio',
        fechaFinalizacion: 'F. Fin',
        sesiones: 'Sesiones',
        costo: 'Costo',
        montoPagado: 'M. Pagado',
        montoPendiente: 'M. Pendiente',
        terapia: 'Terapia',
        institucion: 'Institución',
        estado: 'Estado',
        total: 'Total',
      };
      return smallTexts[key as keyof typeof smallTexts];
    }

    // Textos completos para pantallas normales
    const normalTexts = {
      paciente: 'Paciente',
      fechaInicio: 'Fecha de inicio',
      fechaFinalizacion: 'Fecha de finalización',
      sesiones: 'Sesiones',
      costo: 'Costo',
      montoPagado: 'Monto pagado',
      montoPendiente: 'Monto pendiente',
      terapia: 'Terapia',
      institucion: 'Institución',
      estado: 'Estado',
      total: 'Total',
    };
    return normalTexts[key as keyof typeof normalTexts];
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        display: "block",
      }}
    >
      <Table 
        sx={{ 
          width: "100%",
          maxWidth: "100%",
          tableLayout: 'fixed',
          minWidth: '100%',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={getColumnStyles('paciente')}>
              {getHeaderText('paciente')}
            </TableCell>
            <TableCell sx={getColumnStyles('fechaInicio')}>
              {getHeaderText('fechaInicio')}
            </TableCell>
            <TableCell sx={getColumnStyles('fechaFinalizacion')}>
              {getHeaderText('fechaFinalizacion')}
            </TableCell>
            <TableCell sx={getColumnStyles('sesiones')}>
              {getHeaderText('sesiones')}
            </TableCell>
            <TableCell sx={getColumnStyles('costo')}>
              {getHeaderText('costo')}
            </TableCell>
            <TableCell sx={getColumnStyles('montoPagado')}>
              {getHeaderText('montoPagado')}
            </TableCell>
            <TableCell sx={getColumnStyles('montoPendiente')}>
              {getHeaderText('montoPendiente')}
            </TableCell>
            <TableCell sx={getColumnStyles('terapia')}>
              {getHeaderText('terapia')}
            </TableCell>
            <TableCell sx={getColumnStyles('institucion')}>
              {getHeaderText('institucion')}
            </TableCell>
            <TableCell sx={getColumnStyles('estado')}>
              {getHeaderText('estado')}
            </TableCell>
            <TableCell sx={getColumnStyles('total')}>
              {getHeaderText('total')}
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
                isMobile={isMobile}
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
                  width: "100%",
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