/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as echarts from 'echarts';
import { statusColors } from '@/utils/medicalHistoryConstants';
import { formatStatusLabel } from '@/utils/medicalHistoryConstants';

interface ChartData {
  status: string;
  count: number;
}

interface GenericEChartProps {
  type: 'bar' | 'pie' | 'line';
  data: ChartData[] | null;
  title: string;
  height?: string;
  formatLabel?: (status: string) => string;
  colors?: { [key: string]: string };
}

export const GenericEChart: React.FC<GenericEChartProps> = ({
  type,
  data,
  title,
  height = '400px',
  formatLabel = formatStatusLabel,
  colors = statusColors,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const chart = echarts.init(chartRef.current);
    const statuses = data.map(m => m.status);
    const formattedStatuses = statuses.map(formatLabel);
    const counts = data.map(m => m.count);
    const chartColors = statuses.map(status => (colors as { [key: string]: string })[status] ?? '#999999');

    const baseOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: { color: '#000000', fontSize: 20 },
      },
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        formatter: (params: any) => {
          const param = Array.isArray(params) ? params[0] : params;
          const index = param.dataIndex;
          const value = type === 'pie' ? `${param.value} (${param.percent}%)` : param.value;
          return `${formattedStatuses[index]}: ${value}`;
        },
      },
    };

    const option = type === 'pie' ? {
      ...baseOption,
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: statuses.map((status, index) => ({
            value: counts[index],
            name: formattedStatuses[index],
          })),
          itemStyle: { color: (params: any) => chartColors[params.dataIndex] },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            textStyle: { fontSize: 14 },
            formatter: (params: any) => `${formattedStatuses[params.dataIndex]}: ${params.value}`,
          },
        },
      ],
    } : {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: formattedStatuses,
        axisLabel: { color: '#000000', fontSize: 15 },
      },
      yAxis: {
        type: 'value',
        name: type === 'bar' ? 'Cantidad' : 'Ingresos ($)',
        nameTextStyle: { color: '#000000', fontSize: 15 },
        axisLabel: { color: '#000000', fontSize: 15 },
      },
      series: [
        {
          data: counts,
          type: type,
          itemStyle: { color: (params: any) => chartColors[params.dataIndex] },
          smooth: type === 'line' ? true : undefined,
          lineStyle: type === 'line' ? { width: 2 } : undefined,
          areaStyle: type === 'line' ? { opacity: 0.2 } : undefined,
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [data, type, title, formatLabel, colors]);

  return <Box ref={chartRef} sx={{ height, width: '100%' }} />;
};