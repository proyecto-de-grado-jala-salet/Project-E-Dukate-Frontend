"use client";

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { usePaymentMetrics } from '@/hooks/usePaymentMetrics';
import {
  MetricCard,
  TotalIncomeChart,
  StatusCountsChart,
  PendingVsCompletedChart,
} from '@/components/Metrics/PaymentMetrics';
import { GenericFilterContainer } from '@/components/GenericFilters';

export const PaymentMetrics: React.FC = () => {
  const {
    availableYears,
    totalIncomeData,
    pendingVsCompletedData,
    statusCountsData,
    institutionEarningsData,
    error,
    totalIncomePeriodType,
    totalIncomeFilters,
    statusCountsFilters,
    institutionEarningsFilters,
    resetTotalIncomeFilters,
    resetStatusCountsFilters,
    resetInstitutionEarningsFilters,
    retryFetch,
  } = usePaymentMetrics();

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

  const chartDataTotalIncome = totalIncomeData
    ? totalIncomeData.map((item) => ({
        status: item.period,
        count: item.totalIncome,
      }))
    : [];

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
          <Box sx={{ mt: 3 }}>
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
              <TotalIncomeChart
                filters={totalIncomeFilters}
                data={chartDataTotalIncome}
                periodType={totalIncomePeriodType}
                onResetFilters={resetTotalIncomeFilters}
              />
              <StatusCountsChart
                filters={statusCountsFilters}
                data={chartDataStatusCounts || []}
                onResetFilters={resetStatusCountsFilters}
              />
            </>
          )}
          {pendingVsCompletedData && (
            <PendingVsCompletedChart data={chartDataPendingVsCompleted || []} />
          )}
        </>
      )}
    </Box>
  );
};

export default PaymentMetrics;