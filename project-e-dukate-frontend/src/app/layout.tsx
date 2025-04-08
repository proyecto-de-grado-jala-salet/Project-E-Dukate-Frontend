// "use client";

// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// const theme = createTheme();

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="es">
//       <body>
//         <ThemeProvider theme={theme}>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             {children}
//           </LocalizationProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#04633c', // Verde principal usado en la interfaz
    },
    background: {
      default: '#f5f5f5', // Fondo de la pantalla principal
    },
    text: {
      primary: '#04633c', // Color del texto para los elementos seleccionados
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Evitar que los botones tengan texto en mayúsculas
        },
      },
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}