import { createTheme, SxProps, Theme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#04633c' },
    background: { default: '#f5f5f5' },
    text: { primary: '#000000' },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none' } },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
          backgroundColor: 'white',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 32px 8px 8px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D8D8D8',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D8D8D8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D8D8D8',
          },
        },
      },
    },
  },
});

export const baseSelectStyles = {
  textTransform: "none" as const,
  borderRadius: "10px",
  backgroundColor: "white",
  ".MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    padding: "8px 32px 8px 8px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D8D8D8",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D8D8D8",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D8D8D8",
  }
} satisfies SxProps<Theme>;