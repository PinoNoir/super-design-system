import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  components: {
    MuiStepButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-base)',
          fontSize: 'var(--font-size-h2)',
          lineHeight: '1rem',
          fontFamily: 'var(--font-family-headings)',
          fontWeight: 'var(--font-weight-light)',
          marginBlock: 'var(--space-16)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          zIndex: 10000,
        },
        paper: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
          overflowY: 'unset',
          maxWidth: 'calc(50% - 64px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {},
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-base)',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontFamily: 'var(--font-family-body)',
          fontWeight: '400',
          '& .MuiSwitch-switchBase': {
            color: 'var(--color-neutral-70)',
          },
          '& .MuiSwitch-switchBase + .MuiSwitch-track': {
            backgroundColor: 'var(--color-neutral-40)',
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'var(--color-blue-50)',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--color-blue-30)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--color-neutral-70)',
          padding: '0',
          marginInlineEnd: 'var(--space-4)',
          '&.Mui-checked': {
            color: 'var(--color-blue-50)',
          },
          '&.Mui-disabled': {
            color: 'var(--color-neutral-30)',
            cursor: 'not-allowed',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'var(--color-neutral-70)',
          padding: '0',
          marginInlineEnd: 'var(--space-4)',
          '&.Mui-checked': {
            color: 'var(--color-blue-50)',
          },
          '&.Mui-disabled': {
            color: 'var(--color-neutral-30)',
            cursor: 'not-allowed',
          },
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-base)',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontFamily: 'var(--font-family-body)',
          fontWeight: '400',
          marginBlockEnd: '1rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderBlockStart: '1px solid var(--color-neutral-20)',
          padding: '24px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-neutral-100)',
          color: 'var(--theme-text-inverted)',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-base)',
          fontSize: 'var(--font-size-body)',
          lineHeight: '1.25rem',
          fontFamily: 'var(--font-family-body)',
          fontWeight: '400',
          marginBlockEnd: '0',
          marginRight: '0',
          marginLeft: '0',
        },
        label: {
          fontSize: 'var(--font-size-body)',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiAutocomplete-inputRoot': {
            padding: '0',
            backgroundColor: 'var(--color-transparent)',
            borderRadius: '0',
            border: '1px solid var(--color-neutral-60)',
            '&.Mui-focused': {
              border: '1px solid var(--color-teal-50)',
              outline: '2px solid transparent',
              boxShadow: '0px 0px 0px 2px var(--color-teal-20), 0px 0px 0px 2px var(--color-teal-20)',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          all: 'unset',
          color: 'var(--theme-text-base)',
          letterSpacing: 0,
          fontFamily: 'var(--font-family-body)',
          fontWeight: '700',
          fontSize: '0.875rem',
          lineHeight: 'var(--font-line-height-body)',
          marginBlockEnd: '0.25rem',
          padding: '0',
          position: 'relative',
          display: 'flex',
          zIndex: '1',
          pointerEvents: 'none',
          transform: 'none',
          transition: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {},
      styleOverrides: {
        root: {
          height: '32px',
          width: '100%',
        },
      },
    },
    MuiInputBase: {
      defaultProps: {},
      styleOverrides: {
        root: {
          height: '32px',
          width: '100%',
        },
        input: {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#748487',
          padding: '0 8px',
          borderRadius: 0,
          '&::placeholder': {
            color: 'var(--color-neutral-60)',
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {},
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '0 8px',
          border: '1px solid var(--color-neutral-60)',
          transition: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid var(--color-teal-50)',
            outline: '2px solid transparent',
            boxShadow: '0px 0px 0px 2px var(--color-teal-20), 0px 0px 0px 2px var(--color-teal-20)',
          },
          '&.MuiOutlinedInput-input::placeholder': {
            color: 'var(--color-neutral-60)',
            opacity: 1,
          },
          '& fieldset': {
            border: 'none',
          },
        },
        input: {
          height: '32px',
          width: '100%',
          padding: '0 8px 0 0',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    common: {
      black: '#26353b',
      white: '#fff',
    },
    primary: {
      main: '#029B97',
      light: '#67C3C1',
      dark: '#027C79',
      contrastText: '#fff',
    },
    secondary: {
      main: '#A2ADAF',
      light: '#D1D6D7',
      dark: '#748487',
      contrastText: '#fff',
    },
    error: {
      main: '#E12339',
      light: '#ED7B88',
      dark: '#B41C2E',
      contrastText: '#fff',
    },
    warning: {
      main: '#EBAA20',
      light: '#F3CC79',
      dark: '#BC881A',
      contrastText: '#2E474B',
    },
    info: {
      main: '#2A7AB7',
      light: '#BFD7E9',
      dark: '#1D5580',
      contrastText: '#fff',
    },
    success: {
      main: '#16A550',
      light: '#88DDAA',
      dark: '#11793A',
      contrastText: '#fff',
    },
    grey: {
      50: '#E8EBEB',
      100: '#D1D6D7',
      200: '#B9C2C3',
      300: '#A2ADAF',
      400: '#8B999B',
      500: '#748487',
      600: '#5D7073',
      700: '#455B5F',
      800: '#2E474B',
      900: '#26353b',
    },
    text: {
      primary: '#26353b',
      secondary: '#748487',
      disabled: '#B9C2C3',
    },
    action: {
      active: '#26353b',
      hover: 'rgba(0, 0, 0, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.16)',
      selectedOpacity: 0.16,
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
    contrastThreshold: 4,
  },
});

export default lightTheme;
