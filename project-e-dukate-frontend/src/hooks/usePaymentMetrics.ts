import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  fetchAvailableYears,
  fetchTotalIncome,
  fetchPendingVsCompleted,
  fetchStatusCounts,
  fetchInstitutionEarnings,
} from '@/services/paymentMetricsService';
import { showNotification } from '@/services/notificationService';
import { FilterOption, Filter } from '@/types/filterOption';
import { periodTypeOptions } from '@/utils/paymentConstants';

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

export const usePaymentMetrics = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [totalIncomePeriodType, setTotalIncomePeriodType] = useState<string>('weekly');
  const [totalIncomeStartYear, setTotalIncomeStartYear] = useState<string>('');
  const [totalIncomeEndYear, setTotalIncomeEndYear] = useState<string>('');
  const [totalIncomeWeekRange, setTotalIncomeWeekRange] = useState<{ startDate: Date; endDate: Date } | null>(null);
  const [totalIncomeStartDate, setTotalIncomeStartDate] = useState<Date | null>(null);
  const [totalIncomeEndDate, setTotalIncomeEndDate] = useState<Date | null>(null);
  const [metricCardStartDate, setMetricCardStartDate] = useState<Date | null>(null);
  const [metricCardEndDate, setMetricCardEndDate] = useState<Date | null>(null);
  const [pendingVsCompletedStartDate, setPendingVsCompletedStartDate] = useState<Date | null>(null);
  const [pendingVsCompletedEndDate, setPendingVsCompletedEndDate] = useState<Date | null>(null);
  const [statusCountsStartDate, setStatusCountsStartDate] = useState<Date | null>(null);
  const [statusCountsEndDate, setStatusCountsEndDate] = useState<Date | null>(null);
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [totalIncomeData, setTotalIncomeData] = useState<IncomeByPeriod[] | null>(null);
  const [metricCardPendingVsCompletedData, setMetricCardPendingVsCompletedData] = useState<PendingVsCompletedPayments | null>(null);
  const [pendingVsCompletedData, setPendingVsCompletedData] = useState<PendingVsCompletedPayments | null>(null);
  const [statusCountsData, setStatusCountsData] = useState<PaymentStatusCounts | null>(null);
  const [institutionEarningsData, setInstitutionEarningsData] = useState<InstitutionEarnings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchAvailableYears(setAvailableYears, setError);
    fetchTotalIncome(
      totalIncomePeriodType,
      totalIncomeWeekRange,
      totalIncomeStartDate,
      totalIncomeEndDate,
      totalIncomeStartYear,
      totalIncomeEndYear,
      setTotalIncomeData,
      setError
    );
    fetchPendingVsCompleted(
      metricCardStartDate,
      metricCardEndDate,
      setMetricCardPendingVsCompletedData,
      setError
    );
    fetchPendingVsCompleted(
      pendingVsCompletedStartDate,
      pendingVsCompletedEndDate,
      setPendingVsCompletedData,
      setError
    );
    fetchStatusCounts(statusCountsStartDate, statusCountsEndDate, setStatusCountsData, setError);
    fetchInstitutionEarnings(
      metricCardStartDate,
      metricCardEndDate,
      setInstitutionEarningsData,
      setError
    );
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchAvailableYears(setAvailableYears, setError);
        await fetchPendingVsCompleted(
          metricCardStartDate,
          metricCardEndDate,
          setMetricCardPendingVsCompletedData,
          setError
        );
        await fetchPendingVsCompleted(
          pendingVsCompletedStartDate,
          pendingVsCompletedEndDate,
          setPendingVsCompletedData,
          setError
        );
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [metricCardEndDate, metricCardStartDate, pendingVsCompletedEndDate, pendingVsCompletedStartDate]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (availableYears.length > 0) {
        setLoading(true);
        try {
          await Promise.all([
            fetchTotalIncome(
              totalIncomePeriodType,
              totalIncomeWeekRange,
              totalIncomeStartDate,
              totalIncomeEndDate,
              totalIncomeStartYear,
              totalIncomeEndYear,
              setTotalIncomeData,
              setError
            ),
            fetchStatusCounts(statusCountsStartDate, statusCountsEndDate, setStatusCountsData, setError),
            fetchInstitutionEarnings(
              metricCardStartDate,
              metricCardEndDate,
              setInstitutionEarningsData,
              setError
            ),
            fetchPendingVsCompleted(
              metricCardStartDate,
              metricCardEndDate,
              setMetricCardPendingVsCompletedData,
              setError
            ),
            fetchPendingVsCompleted(
              pendingVsCompletedStartDate,
              pendingVsCompletedEndDate,
              setPendingVsCompletedData,
              setError
            )
          ]);
        } catch (error) {
          console.error('Error fetching additional data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdditionalData();
  }, [
    totalIncomePeriodType,
    totalIncomeStartYear,
    totalIncomeEndYear,
    totalIncomeWeekRange,
    totalIncomeStartDate,
    totalIncomeEndDate,
    statusCountsStartDate,
    statusCountsEndDate,
    metricCardStartDate,
    metricCardEndDate,
    pendingVsCompletedStartDate,
    pendingVsCompletedEndDate,
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

  const resetMetricCardFilters = () => {
    setMetricCardStartDate(null);
    setMetricCardEndDate(null);
    setError(null);
  };

  const resetPendingVsCompletedFilters = () => {
    setPendingVsCompletedStartDate(null);
    setPendingVsCompletedEndDate(null);
    setError(null);
  };

  const yearOptions: FilterOption[] = availableYears.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const totalIncomeFilters: Filter[] = availableYears.length > 0 ? [
    {
      label: 'Período',
      type: 'dropdown' as const,
      value: totalIncomePeriodType,
      onChange: (value: string) => {
        setTotalIncomePeriodType(value);
        if (value !== 'weekly') setTotalIncomeWeekRange(null);
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

  const statusCountsFilters: Filter[] = availableYears.length > 0 ? [
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

  const metricCardFilters: Filter[] = availableYears.length > 0 ? [
    {
      label: 'Fecha Inicial',
      type: 'date' as const,
      value: metricCardStartDate ? format(metricCardStartDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => setMetricCardStartDate(value ? new Date(value) : null),
    },
    {
      label: 'Fecha Final',
      type: 'date' as const,
      value: metricCardEndDate ? format(metricCardEndDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => {
        const newEndDate = value ? new Date(value) : null;
        if (newEndDate && metricCardStartDate && newEndDate < metricCardStartDate) {
          showNotification('La fecha final no puede ser anterior a la fecha inicial.', 'error');
          return;
        }
        setMetricCardEndDate(newEndDate);
      },
      minDate: metricCardStartDate ? format(metricCardStartDate, 'yyyy-MM-dd') : undefined,
    },
  ] : [];

  const pendingVsCompletedFilters: Filter[] = availableYears.length > 0 ? [
    {
      label: 'Fecha Inicial',
      type: 'date' as const,
      value: pendingVsCompletedStartDate ? format(pendingVsCompletedStartDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => setPendingVsCompletedStartDate(value ? new Date(value) : null),
    },
    {
      label: 'Fecha Final',
      type: 'date' as const,
      value: pendingVsCompletedEndDate ? format(pendingVsCompletedEndDate, 'yyyy-MM-dd') : '',
      onChange: (value: string) => {
        const newEndDate = value ? new Date(value) : null;
        if (newEndDate && pendingVsCompletedStartDate && newEndDate < pendingVsCompletedStartDate) {
          showNotification('La fecha final no puede ser anterior a la fecha inicial.', 'error');
          return;
        }
        setPendingVsCompletedEndDate(newEndDate);
      },
      minDate: pendingVsCompletedStartDate ? format(pendingVsCompletedStartDate, 'yyyy-MM-dd') : undefined,
    },
  ] : [];

  return {
    availableYears,
    totalIncomeData,
    metricCardPendingVsCompletedData,
    pendingVsCompletedData,
    statusCountsData,
    institutionEarningsData,
    error,
    totalIncomePeriodType,
    totalIncomeFilters,
    statusCountsFilters,
    metricCardFilters,
    pendingVsCompletedFilters,
    resetTotalIncomeFilters,
    resetStatusCountsFilters,
    resetMetricCardFilters,
    resetPendingVsCompletedFilters,
    retryFetch,
    loading,
  };
};