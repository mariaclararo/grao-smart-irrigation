//usando arquivo de tema para padronizar em todas as telas de formulário -> 2 temas: claro e escuro
import { createTheme } from '@mui/material/styles';

//igual para os dois temas
const configuracoesComuns: any = {
    typography: {
        fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
        h2: { color : '#408c42', fontWeight: 'bold', fontSize: '1.75rem', textAlign: 'center', marginBottom: '24px' },
    },
    components: {
        MuiTextField: { defaultProps: { variant: 'filled', fullWidth: true } },
        MuiFormControl: { defaultProps: { variant: 'filled', fullWidth: true } },
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
                root: { color: '#442828', fontWeight: 'bold', '&.Mui-focused': { color: '#408c42' } },
            },
        },
        MuiFormHelperText: {
            styleOverrides: { root: { fontWeight: '500', marginLeft: '4px', '&.Mui-error': { color: '#ff0000' } } },
        },
        MuiButton: {
            styleOverrides: { root: { borderRadius: '10px', padding: '12px', fontWeight: 'bold', fontSize: '1rem', textTransform: 'none' } },
        },
    },
};

//tema escuro
export const graoDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#408c42', contrastText: '#ffffff' },
        background: { default: '#442828', paper: '#513434' },
        text: { primary: '#ffffff' }, // Texto principal branco
    },
    ...configuracoesComuns,
});

//tema claro
export const graoLightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#408c42', contrastText: '#ffffff' },
        background: { default: '#f4f4f4', paper: '#ffffff' }, // Fundo cinza claro, caixas brancas
        text: { primary: '#333333' }, // Texto principal escuro
    },
    ...configuracoesComuns,
});