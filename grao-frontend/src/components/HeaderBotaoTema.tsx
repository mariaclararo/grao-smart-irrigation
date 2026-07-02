//para usar o botao de mudar tema e voltar para o painel em todos os formulários
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeModeContext } from '../App';

//para n mostrar botao de painel na pag principal
interface HeaderBotaoTemaProps {
    mostrarVoltar?: boolean;
}

export default function HeaderBotaoTema({ mostrarVoltar = true }: HeaderBotaoTemaProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const { toggleTheme } = useContext(ThemeModeContext);
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: mostrarVoltar ? 'space-between' : 'flex-end', alignItems: 'center', mb: 2 }}>
            
            {/*aqui so mostra o botao de retornal ao painel se for true*/}
            {mostrarVoltar ? (
                <Button variant="text" onClick={() => navigate('/')} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    ⬅ Voltar ao Painel
                </Button>
            ) : (
                <Box /> 
            )}

            {/* botao de trocar de tema*/}
            <Button 
                onClick={toggleTheme} 
                variant="contained" 
                sx={{ 
                    backgroundColor: 'background.paper', 
                    color: 'text.primary', 
                    boxShadow: 2,
                    '&:hover': { backgroundColor: 'primary.main', color: '#fff' } 
                }}
            >
                {theme.palette.mode === 'dark' ? '☀︎' : '⏾'}
            </Button>
        </Box>
    );
}