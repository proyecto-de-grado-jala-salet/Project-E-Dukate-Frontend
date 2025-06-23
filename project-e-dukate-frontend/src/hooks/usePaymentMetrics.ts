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
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [totalIncomeData, setTotalIncomeData] = useState<IncomeByPeriod[] | null>(null);
  const [pendingVsCompletedData, setPendingVsCompletedData] = useState<PendingVsCompletedPayments | null>(null);
  const [statusCountsData, setStatusCountsData] = useState<PaymentStatusCounts | null>(null);
  const [institutionEarningsData, setInstitutionEarningsData] = useState<InstitutionEarnings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const retryFetch = () => {
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
    fetchPendingVsCompleted(setPendingVsCompletedData, setError);
    fetchStatusCounts(statusCountsStartDate, statusCountsEndDate, setStatusCountsData, setError);
    fetchInstitutionEarnings(
      institutionEarningsStartDate,
      institutionEarningsEndDate,
      setInstitutionEarningsData,
      setError
    );
  };

  useEffect(() => {
    fetchAvailableYears(setAvailableYears, setError);
    fetchPendingVsCompleted(setPendingVsCompletedData, setError);
  }, []);

  useEffect(() => {
    if (availableYears.length > 0) {
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
      fetchStatusCounts(statusCountsStartDate, statusCountsEndDate, setStatusCountsData, setError);
      fetchInstitutionEarnings(
        institutionEarningsStartDate,
        institutionEarningsEndDate,
        setInstitutionEarningsData,
        setError
      );
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

  const institutionEarningsFilters: Filter[] = availableYears.length > 0 ? [
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

  return {
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
  };
};