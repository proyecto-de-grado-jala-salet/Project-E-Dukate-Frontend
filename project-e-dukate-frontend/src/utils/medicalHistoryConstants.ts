export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const statuses = [
  'ContinuaEnTratamiento',
  'AltaDefinitiva',
  'AltaTemporal',
  'AltaAbandono',
] as const;

export const statusColors: { [key: string]: string } = {
  ContinuaEnTratamiento: '#76CAFF',
  AltaDefinitiva: '#009F1D',
  AltaTemporal: '#FFA719',
  AltaAbandono: '#F24B4B',
};

export const formatStatusLabel = (status: string): string =>
  status
    .replace('ContinuaEnTratamiento', 'Continúa en Tratamiento')
    .replace('AltaDefinitiva', 'Alta Definitiva')
    .replace('AltaTemporal', 'Alta Temporal')
    .replace('AltaAbandono', 'Alta por Abandono');