/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { GenericEChart } from '../GenericCharts';
import { FilterOption } from '@/types/filterOption';
import { apiRequest } from '@/services/api';
import { format } from 'date-fns';
import { showNotification } from '@/services/notificationService';

interface IncomeByPeriod {
  period: string;
  totalIncome: number;
}

interface PendingVsCompletedPayments {
  pendingAmount?: number;
  completedAmount?: number;
}

interface PaymentStatusCounts {
  pendingCount: number;
  completedCount: number;
}

interface InstitutionEarnings {
  totalInstitutionEarnings: number;
}

const periodTypeOptions: FilterOption[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

const MetricCard: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <Box
    sx={{
      bgcolor: '#ffffff',
      borderRadius: '12px',
      p: 3,
      boxShadow: 1,
      textAlign: 'center',
      minWidth: '200px',
      flex: 1,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
      {label}
    </Typography>
    <Typography variant="h4" color="#4CAF50">
      {typeof value === 'number' ? `${value.toFixed(2)} bs.` : '-'}
    </Typography>
  </Box>
);

export const PaymentMetricsCharts: React.FC = () => {
  // Filter states for each chart
  const [totalIncomePeriodType, setTotalIncomePeriodType] = useState<string>('weekly');
  const [totalIncomeStartYear, setTotalIncomeStartYear] = useState<string>('');
  const [totalIncomeEndYear, setTotalIncomeEndYear] = useState<string>('');
  const [totalIncomeWeekRange, setTotalIncomeWeekRange] = useState<{ startDate: Date; endDate: Date } | null>(null);
  const [totalIncomeStartDate, setTotalIncomeStartDate] = useState<Date | null>(null);
  const [totalIncomeEndDate, setTotalIncomeEndDate] = useState<Date | null>(null);
  const [institutionEarningsStartDate, setInstitutionEarningsStartDate] = useState<Date | null>(null);
  const [institutionEarningsEndDate, setInstitutionEarningsEndDate] = useState<Date | null>(null);
  const [statusCountsStartDate, setStatusCountsStartDate] = useState<Date | null>(null);
  const [statusCountsEndDate, setStatusCountsEndDate] = useState<Date | null>(null);

  // Data states
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [totalIncomeData, setTotalIncomeData] = useState<IncomeByPeriod[] | null>(null);
  const [pendingVsCompletedData, setPendingVsCompletedData] = useState<PendingVsCompletedPayments | null>(null);
  const [statusCountsData, setStatusCountsData] = useState<PaymentStatusCounts | null>(null);
  const [institutionEarningsData, setInstitutionEarningsData] = useState<InstitutionEarnings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableYears = async () => {
    try {
      const years = await apiRequest<number[]>('paymentMetrics', 'GET', undefined, 'available-years');
      setAvailableYears(Array.isArray(years) ? years : []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching available years:', error);
      setAvailableYears([]);
      const errorMessage = error.message.includes('Not Found')
        ? 'El endpoint de años disponibles no está configurado en el servidor.'
        : error.message || 'Error al cargar los años disponibles';
      setError(errorMessage);
    }
  };

  const fetchTotalIncome = async () => {
    try {
      let query = `?periodType=${totalIncomePeriodType}`;
      if (totalIncomePeriodType === 'weekly' && totalIncomeWeekRange) {
        query += `&startDate=${format(totalIncomeWeekRange.startDate, 'yyyy-MM-dd')}T00:00:00Z`;
        query += `&endDate=${format(totalIncomeWeekRange.endDate, 'yyyy-MM-dd')}T23:59:59Z`;
      } else if (totalIncomePeriodType === 'monthly' && totalIncomeStartDate && totalIncomeEndDate) {
        if (totalIncomeEndDate < totalIncomeStartDate) {
          setError('La fecha final no puede ser anterior a la fecha inicial.');
          setTotalIncomeData([]);
          return;
        }
        query += `&startDate=${format(totalIncomeStartDate, 'yyyy-MM-dd')}T00:00:00Z`;
        query += `&endDate=${format(totalIncomeEndDate, 'yyyy-MM-dd')}T23:59:59Z`;
      } else if (totalIncomePeriodType === 'yearly') {
        if (totalIncomeStartYear && /^\d{4}$/.test(totalIncomeStartYear)) {
          query += `&startDate=${totalIncomeStartYear}-01-01T00:00:00Z`;
        }
        if (totalIncomeEndYear && /^\d{4}$/.test(totalIncomeEndYear)) {
          query += `&endDate=${totalIncomeEndYear}-12-31T23:59:59Z`;
        }
      }
      const data = await apiRequest<IncomeByPeriod[]>('paymentMetrics', 'GET', undefined, 'total-income', query);
      setTotalIncomeData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching total income:', error);
      setTotalIncomeData([]);
      setError(error.message || 'Error al cargar los ingresos totales');
    }
  };

  const fetchPendingVsCompleted = async () => {
    try {
      const data = await apiRequest<PendingVsCompletedPayments>('paymentMetrics', 'GET', undefined, 'pending-vs-completed');
      setPendingVsCompletedData(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching pending vs completed:', error);
      setPendingVsCompletedData(null);
      setError(error.message || 'Error al cargar los montos pendientes vs completados');
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const queryParams = [];
      if (statusCountsStartDate) {
        queryParams.push(`startDate=${format(statusCountsStartDate, 'yyyy-MM-dd')}T00:00:00Z`);
      }
      if (statusCountsEndDate) {
        queryParams.push(`endDate=${format(statusCountsEndDate, 'yyyy-MM-dd')}T23:59:59Z`);
      }
      const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const data = await apiRequest<PaymentStatusCounts>('paymentMetrics', 'GET', undefined, 'status-counts', query);
      setStatusCountsData(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching status counts:', error);
      setStatusCountsData(null);
      setError(error.message || 'Error al cargar los conteos de pagos');
    }
  };

  const fetchInstitutionEarnings = async () => {
    try {
      const queryParams = [];
      if (institutionEarningsStartDate) {
        queryParams.push(`startDate=${format(institutionEarningsStartDate, 'yyyy-MM-dd')}T00:00:00Z`);
      }
      if (institutionEarningsEndDate) {
        queryParams.push(`endDate=${format(institutionEarningsEndDate, 'yyyy-MM-dd')}T23:59:59Z`);
      }
      const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const data = await apiRequest<InstitutionEarnings>('paymentMetrics', 'GET', undefined, 'institution-earnings', query);
      setInstitutionEarningsData(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching institution earnings:', error);
      const errorMessage = error.message.includes('Not Found')
        ? 'El endpoint de ganancias de la institución no está configurado en el servidor.'
        : error.message || 'Error al cargar las ganancias de la institución';
      setError(errorMessage);
      setInstitutionEarningsData(null);
    }
  };

  const retryFetch = () => {
    setError(null);
    fetchAvailableYears();
    fetchTotalIncome();
    fetchPendingVsCompleted();
    fetchStatusCounts();
    fetchInstitutionEarnings();
  };

  useEffect(() => {
    fetchAvailableYears();
    fetchPendingVsCompleted();
  }, []);

  useEffect(() => {
    if (availableYears.length > 0) {
      fetchTotalIncome();
      fetchStatusCounts();
      fetchInstitutionEarnings();
    }
  }, [
    totalIncomePeriodType,
    totalIncomeStartYear,
    totalIncomeEndYear,
    totalIncomeWeekRange,
    totalIncomeStartDate,
    totalIncomeEndDate,
    statusCountsStartDate,
    statusCountsEndDate,
    institutionEarningsStartDate,
    institutionEarningsEndDate,
    availableYears,
  ]);

  const resetTotalIncomeFilters = () => {
    setTotalIncomePeriodType('weekly');
    setTotalIncomeStartYear('');
    setTotalIncomeEndYear('');
    setTotalIncomeWeekRange(null);
    setTotalIncomeStartDate(null);
    setTotalIncomeEndDate(null);
    setError(null);
  };

  const resetStatusCountsFilters = () => {
    setStatusCountsStartDate(null);
    setStatusCountsEndDate(null);
    setError(null);
  };

  const resetInstitutionEarningsFilters = () => {
    setInstitutionEarningsStartDate(null);
    setInstitutionEarningsEndDate(null);
    setError(null);
  };

  const yearOptions: FilterOption[] = availableYears.map(year => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const totalIncomeFilters = availableYears.length > 0 ? [
    {
      label: 'Período',
      type: 'dropdown' as const,
      value: totalIncomePeriodType,
      onChange: (value: string) => {
        setTotalIncomePeriodType(value);
        if (value !== 'weekly') {
          setTotalIncomeWeekRange(null);
        }
        if (value !== 'monthly') {
          setTotalIncomeStartDate(null);
          setTotalIncomeEndDate(null);
        }
        if (value !== 'yearly') {
          setTotalIncomeStartYear('');
          setTotalIncomeEndYear('');
        }
      },
      options: periodTypeOptions,
    },
    ...(totalIncomePeriodType === 'weekly'
      ? [{
          label: 'Rango de Semanas',
          type: 'week-range' as const,
          value: totalIncomeWeekRange,
          onChange: setTotalIncomeWeekRange,
        }]
      : totalIncomePeriodType === 'monthly'
      ? [
          {
            label: 'Fecha Inicial',
            type: 'date' as const,
            value: totalIncomeStartDate ? format(totalIncomeStartDate, 'yyyy-MM-dd') : '',
            onChange: (value: string) => setTotalIncomeStartDate(value ? new Date(value) : null),
          },
          {
            label: 'Fecha Final',
            type: 'date' as const,
            value: totalIncomeEndDate ? format(totalIncomeEndDate, 'yyyy-MM-dd') : '',
            onChange: (value: string) => {
              const newEndDate = value ? new Date(value) : null;
              if (newEndDate && totalIncomeStartDate && newEndDate < totalIncomeStartDate) {
                showNotification('La fecha final no puede ser anterior a la fecha inicial.', 'error');
                return;
              }
              setTotalIncomeEndDate(newEndDate);
            },
            minDate: totalIncomeStartDate ? format(totalIncomeStartDate, 'yyyy-MM-dd') : undefined,
          },
        ]
      : [
          {
            label: 'Año Inicial',
            type: 'dropdown' as const,
            value: totalIncomeStartYear,
            onChange: setTotalIncomeStartYear,
            options: yearOptions,
          },
          {
            label: 'Año Final',
            type: 'dropdown' as const,
            value: totalIncomeEndYear,
            onChange: setTotalIncomeEndYear,
            options: yearOptions,
          },
        ]),
  ] : [];

  const statusCountsFilters = availableYears.length > 0 ? [
    {
      label: 'Fecha Inicial',
      type: 'date' as const,
      value: statusCountsStartDate ? format(statusCountsStartDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => setStatusCountsStartDate(value ? new Date(value) : null),
    },
    {
      label: 'Fecha Final',
      type: 'date' as const,
      value: statusCountsEndDate ? format(statusCountsEndDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => {
        const newEndDate = value ? new Date(value) : null;
        if (newEndDate && statusCountsStartDate && newEndDate < statusCountsStartDate) {
          showNotification('La fecha final no puede ser anterior a la fecha inicial.', 'error');
          return;
        }
        setStatusCountsEndDate(newEndDate);
      },
      minDate: statusCountsStartDate ? format(statusCountsStartDate, 'yyyy-MM-dd') : undefined,
    },
  ] : [];

  const institutionEarningsFilters = availableYears.length > 0 ? [
    {
      label: 'Fecha Inicial',
      type: 'date' as const,
      value: institutionEarningsStartDate ? format(institutionEarningsStartDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => setInstitutionEarningsStartDate(value ? new Date(value) : null),
    },
    {
      label: 'Fecha Final',
      type: 'date' as const,
      value: institutionEarningsEndDate ? format(institutionEarningsEndDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => {
        const newEndDate = value ? new Date(value) : null;
        if (newEndDate && institutionEarningsStartDate && newEndDate < institutionEarningsStartDate) {
          showNotification('La fecha final no puede ser anterior a la fecha inicial.', 'error');
          return;
        }
        setInstitutionEarningsEndDate(newEndDate);
      },
      minDate: institutionEarningsStartDate ? format(institutionEarningsStartDate, 'yyyy-MM-dd') : undefined,
    },
  ] : [];

  const chartDataPendingVsCompleted = pendingVsCompletedData
    ? [
        { status: 'Pending', count: pendingVsCompletedData.pendingAmount ?? 0 },
        { status: 'Completed', count: pendingVsCompletedData.completedAmount ?? 0 },
      ]
    : null;

  const chartDataStatusCounts = statusCountsData
    ? [
        { status: 'Pending', count: statusCountsData.pendingCount },
        { status: 'Completed', count: statusCountsData.completedCount },
      ]
    : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#000' }}>
        Métricas de Pagos
      </Typography>
      {error && (
        <Box sx={{ mt: 2, bgcolor: 'error.light', p: 2, borderRadius: '8px', textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={retryFetch}>
            Reintentar
          </Button>
        </Box>
      )}
      {availableYears.length === 0 && !error && (
        <Typography color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          No hay datos de pagos registrados.
        </Typography>
      )}
      {(availableYears.length > 0 || pendingVsCompletedData) && (
        <>
          <Box
            sx={{
              mt: 3,
            }}
          >
            {institutionEarningsFilters.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <GenericFilterContainer
                  filters={institutionEarningsFilters}
                  onResetFilters={resetInstitutionEarningsFilters}
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              {pendingVsCompletedData ? (
                <>
                  <MetricCard label="Monto Pendiente" value={pendingVsCompletedData.pendingAmount} />
                  <MetricCard label="Monto Completado" value={pendingVsCompletedData.completedAmount} />
                </>
              ) : (
                <Typography color="textSecondary" align="center" sx={{ width: '100%' }}>
                  No hay datos disponibles para los montos.
                </Typography>
              )}
              {institutionEarningsData ? (
                <MetricCard label="Ganancias Totales" value={institutionEarningsData.totalInstitutionEarnings} />
              ) : (
                <Typography color="textSecondary" align="center" sx={{ width: '100%' }}>
                  No hay datos disponibles para las ganancias.
                </Typography>
              )}
            </Box>
          </Box>
          {availableYears.length > 0 && (
            <>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: '#ffffff',
                  borderRadius: '12px',
                  p: 2,
                  margin: '30px 0 0 0',
                  boxShadow: 1,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>
                  {totalIncomePeriodType === 'yearly' ? 'Gráfico de Barras' : 'Gráfico de Líneas'}
                </Typography>
                {totalIncomeFilters.length > 0 && (
                  <Box sx={{ m: 3 }}>
                    <GenericFilterContainer
                      filters={totalIncomeFilters}
                      onResetFilters={resetTotalIncomeFilters}
                    />
                  </Box>
                )}
                {!totalIncomeData || !Array.isArray(totalIncomeData) || totalIncomeData.length === 0 ? (
                  <Typography color="textSecondary" align="center">
                    No hay datos disponibles para mostrar.
                  </Typography>
                ) : (
                  <GenericEChart
                    type={totalIncomePeriodType === 'yearly' ? 'bar' : 'line'}
                    data={totalIncomeData.map((item) => ({
                      status: item.period,
                      count: item.totalIncome,
                    }))}
                    title="Ingresos Totales por Período"
                    height="500px"
                    formatLabel={(status) => status}
                    colors={{}}
                  />
                )}
              </Box>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: '#ffffff',
                  borderRadius: '12px',
                  p: 2,
                  margin: '30px 0 0 0',
                  boxShadow: 1,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>
                  Gráfico de Conteo de Pagos
                </Typography>
                {statusCountsFilters.length > 0 && (
                  <Box sx={{ m: 3 }}>
                    <GenericFilterContainer
                      filters={statusCountsFilters}
                      onResetFilters={resetStatusCountsFilters}
                    />
                  </Box>
                )}
                {!chartDataStatusCounts ? (
                  <Typography color="textSecondary" align="center">
                    No hay datos disponibles para mostrar.
                  </Typography>
                ) : (
                  <GenericEChart
                    type="pie"
                    data={chartDataStatusCounts}
                    title=""
                    height="400px"
                    formatLabel={(status) => (status === 'Pending' ? 'Pendientes' : 'Completados')}
                    colors={{ Pending: '#FF6384', Completed: '#36A2EB' }}
                  />
                )}
              </Box>
            </>
          )}
          {pendingVsCompletedData && (
            <Box
              sx={{
                width: '100%',
                bgcolor: '#ffffff',
                borderRadius: '12px',
                p: 2,
                margin: '30px 0 0 0',
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>
                Montos Pendientes vs. Completados
              </Typography>
              {!chartDataPendingVsCompleted ? (
                <Typography color="textSecondary" align="center">
                  No hay datos disponibles para mostrar.
                  </Typography>
              ) : (
                <GenericEChart
                  type="pie"
                  data={chartDataPendingVsCompleted}
                  title=""
                  height="400px"
                  formatLabel={(status) => (status === 'Pending' ? 'Pendientes' : 'Completados')}
                  colors={{ Pending: '#FF6384', Completed: '#36A2EB' }}
                />
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PaymentMetricsCharts;