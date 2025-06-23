import { InputRange } from 'react-date-range';
import { startOfWeek } from 'date-fns';
import { endOfWeek } from 'date-fns';
import { addDays } from 'date-fns';
import { subDays } from 'date-fns';
import { startOfDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const staticRanges = [
  {
    label: "Hoy",
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
    isSelected: () => false,
  },
  {
    label: "Ayer",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(subDays(new Date(), 1)),
    }),
    isSelected: () => false,
  },
  {
    label: "Últimos 7 días",
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 6)),
      endDate: endOfDay(new Date()),
    }),
    isSelected: () => false,
  },
  {
    label: "Esta semana",
    range: () => ({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1, locale: es }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1, locale: es }),
    }),
    isSelected: () => false,
  },
  {
    label: "Semana pasada",
    range: () => ({
      startDate: startOfWeek(subDays(new Date(), 7), {
        weekStartsOn: 1,
        locale: es,
      }),
      endDate: endOfWeek(subDays(new Date(), 7), {
        weekStartsOn: 1,
        locale: es,
      }),
    }),
    isSelected: () => false,
  },
  {
    label: "Este mes",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
    isSelected: () => false,
  },
  {
    label: "Mes pasado",
    range: () => ({
      startDate: startOfMonth(subDays(new Date(), 30)),
      endDate: endOfMonth(subDays(new Date(), 1)),
    }),
    isSelected: () => false,
  },
];

export const inputRanges: InputRange[] = [
  {
    label: "Días hasta hoy",
    range: (value: number) => ({
      startDate: startOfDay(subDays(new Date(), value - 1)),
      endDate: endOfDay(new Date()),
    }),
    getCurrentValue: (range) => {
      if (
        !range.endDate ||
        !range.startDate ||
        endOfDay(range.endDate).getTime() !== endOfDay(new Date()).getTime()
      ) {
        return "";
      }
      const diff = Math.ceil(
        (range.endDate.getTime() - startOfDay(range.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return diff >= 1 ? diff.toString() : "";
    },
  },
  {
    label: "Días desde hoy",
    range: (value: number) => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(addDays(new Date(), value - 1)),
    }),
    getCurrentValue: (range) => {
      if (
        !range.startDate ||
        !range.endDate ||
        startOfDay(range.startDate).getTime() !==
          startOfDay(new Date()).getTime()
      ) {
        return "";
      }
      const diff = Math.ceil(
        (endOfDay(range.endDate).getTime() - range.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return diff >= 1 ? diff.toString() : "";
    },
  },
];
