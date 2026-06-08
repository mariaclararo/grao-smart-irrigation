//usando arquivo de tema para padronizar em todas as telas de formulário
import { createTheme } from '@mui/material/styles';

const graoTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#408c42',
            contrastText: '#ffffff',
        },
        background: {
            default: '#442828',
            paper: '#513434',
        },
    },
    typography: {
        fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
        h2: {
            color : '#408c42',
            fontWeight: 'bold',
            fontSize: '1.75rem',
            textAlign: 'center',
            marginBottom: '24px',
        },
    },
    components: {
        //customização global dos textfields e selects para seguir paleta do projeto e formato padronizado
        MuiTextField: {
            defaultProps: { variant: 'filled', fullWidth: true},
        },
        MuiFormControl: {
            defaultProps: { variant: 'filled', fullWidth: true},
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#bea9a9',
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: '#bea9a9' },
                    '& .MuiInputBase-input': { color: '#151515' },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#442828',
                    fontWeidth: 'bold',
                    '&.Mui-focused': { clor: '#408c42'},
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontWeight: '500',
                    marginLeft: '4px',
                    '&.Mui-error': { color: '#ff0000'}, //cor do alerta
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                },
            },
        },
    },
});

export default graoTheme;