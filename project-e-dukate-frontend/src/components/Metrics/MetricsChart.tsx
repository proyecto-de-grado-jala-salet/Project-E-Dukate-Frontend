/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import * as echarts from 'echarts';
import { MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statusColors } from '@/utils/medicalHistoryConstants';
import { formatStatusLabel } from '@/utils/medicalHistoryConstants';

interface ChartProps {
  metricsData: MedicalHistoryMetricsDto | null;
}

const BarChart: React.FC<ChartProps> = ({ metricsData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !metricsData || !metricsData.metrics) return;

    const chart = echarts.init(chartRef.current);
    const statuses = metricsData.metrics.map(m => m.status);
    const formattedStatuses = statuses.map(formatStatusLabel);
    const counts = metricsData.metrics.map(m => m.count);
    const colors = statuses.map(status => statusColors[status as keyof typeof statusColors] || '#999999');

    const option = {
      title: {
        text: 'Métricas de Historiales Médicos',
        left: 'center',
        textStyle: { color: '#000000', fontSize: 20, }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const param = params[0];
          return `${formattedStatuses[param.dataIndex]}: ${param.value}`;
        }
      },
      xAxis: {
        type: 'category',
        data: formattedStatuses,
        axisLabel: {
          color: '#000000',
          fontSize: 15,
        }
      },
      yAxis: {
        type: 'value',
        name: 'Cantidad',
        nameTextStyle: { color: '#000000', fontSize: 15, },
        axisLabel: { color: '#000000', fontSize: 15, }
      },
      series: [
        {
          data: counts,
          type: 'bar',
          itemStyle: {
            color: (params: any) => colors[params.dataIndex]
          }
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [metricsData]);

  return <Box ref={chartRef} sx={{ height: '500px', width: '100%' }} />;
};

const PieChart: React.FC<ChartProps> = ({ metricsData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !metricsData || !metricsData.metrics) return;

    const chart = echarts.init(chartRef.current);
    const statuses = metricsData.metrics.map(m => m.status);
    const formattedStatuses = statuses.map(formatStatusLabel);
    const counts = metricsData.metrics.map(m => m.count);
    const colors = statuses.map(status => statusColors[status as keyof typeof statusColors] || '#999999');

    const option = {
      title: {
        text: 'Métricas de Historiales Médicos',
        left: 'center',
        textStyle: { color: '#000000', fontSize: 20 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${formattedStatuses[params.dataIndex]}: ${params.value} (${params.percent}%)`;
        }
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: statuses.map((status, index) => ({
            value: counts[index],
            name: formattedStatuses[index]
          })),
          itemStyle: {
            color: (params: any) => colors[params.dataIndex]
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            textStyle: { fontSize: 14 },
            formatter: (params: any) => `${formattedStatuses[params.dataIndex]}: ${params.value}`
          }
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [metricsData]);

  return <Box ref={chartRef} sx={{ height: '400px', width: '100%' }} />;
};

interface MetricsChartsProps {
  metricsData: MedicalHistoryMetricsDto | null;
}

export const MetricsCharts: React.FC<MetricsChartsProps> = ({ metricsData }) => {
  return (
    <>
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: '12px',
        p: 2,
        boxShadow: 1
      }}
    >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>Gráfico de Barras</Typography>
      {metricsData && !metricsData.metrics && (
        <Typography color="textSecondary" align="center">
          No hay datos disponibles para mostrar.
        </Typography>
      )}
      {metricsData?.metrics && (
        <>
          <BarChart metricsData={metricsData} />
        </>
      )}
    </Box>
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: '12px',
        p: 2,
        margin: "30px 0 0 0",
        boxShadow: 1
      }}
    >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>Gráfico Circular</Typography>
      {metricsData && !metricsData.metrics && (
        <Typography color="textSecondary" align="center">
          No hay datos disponibles para mostrar.
        </Typography>
      )}
      {metricsData?.metrics && (
        <>
          <PieChart metricsData={metricsData} />
        </>
      )}
    </Box>
    </>
  );
};