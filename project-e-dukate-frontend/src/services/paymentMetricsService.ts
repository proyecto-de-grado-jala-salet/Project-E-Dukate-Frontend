/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from '@/services/api';
import { format } from 'date-fns';

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

export const fetchAvailableYears = async (
  setAvailableYears: (years: number[]) => void,
  setError: (error: string | null) => void
) => {
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

export const fetchTotalIncome = async (
  periodType: string,
  weekRange: { startDate: Date; endDate: Date } | null,
  startDate: Date | null,
  endDate: Date | null,
  startYear: string,
  endYear: string,
  setTotalIncomeData: (data: IncomeByPeriod[] | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    let query = `?periodType=${periodType}`;
    if (periodType === 'weekly' && weekRange) {
      query += `&startDate=${format(weekRange.startDate, 'yyyy-MM-dd')}T00:00:00Z`;
      query += `&endDate=${format(weekRange.endDate, 'yyyy-MM-dd')}T23:59:59Z`;
    } else if (periodType === 'monthly' && startDate && endDate) {
      if (endDate < startDate) {
        setError('La fecha final no puede ser anterior a la fecha inicial.');
        setTotalIncomeData([]);
        return;
      }
      query += `&startDate=${format(startDate, 'yyyy-MM-dd')}T00:00:00Z`;
      query += `&endDate=${format(endDate, 'yyyy-MM-dd')}T23:59:59Z`;
    } else if (periodType === 'yearly') {
      if (startYear && /^\d{4}$/.test(startYear)) {
        query += `&startDate=${startYear}-01-01T00:00:00Z`;
      }
      if (endYear && /^\d{4}$/.test(endYear)) {
        query += `&endDate=${endYear}-12-31T23:59:59Z`;
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

export const fetchPendingVsCompleted = async (
  setPendingVsCompletedData: (data: PendingVsCompletedPayments | null) => void,
  setError: (error: string | null) => void
) => {
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

export const fetchStatusCounts = async (
  startDate: Date | null,
  endDate: Date | null,
  setStatusCountsData: (data: PaymentStatusCounts | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    const queryParams = [];
    if (startDate) {
      queryParams.push(`startDate=${format(startDate, 'yyyy-MM-dd')}T00:00:00Z`);
    }
    if (endDate) {
      queryParams.push(`endDate=${format(endDate, 'yyyy-MM-dd')}T23:59:59Z`);
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

export const fetchInstitutionEarnings = async (
  startDate: Date | null,
  endDate: Date | null,
  setInstitutionEarningsData: (data: InstitutionEarnings | null) => void,
  setError: (error: string | null) => void
) => {
  try {
    const queryParams = [];
    if (startDate) {
      queryParams.push(`startDate=${format(startDate, 'yyyy-MM-dd')}T00:00:00Z`);
    }
    if (endDate) {
      queryParams.push(`endDate=${format(endDate, 'yyyy-MM-dd')}T23:59:59Z`);
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