import { Container, Typography, Button, Box, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import { useTheme } from '@mui/material/styles';
import HeaderBotaoTema from './HeaderBotaoTema';

export default function Home() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const theme = useTheme();

  //para definir se vai mostrar home de funcionário ou home de produtor
  let usuario: any = null;
  let isProdutor = false;

  if (token) {
    usuario = jwtDecode(token);
    isProdutor = usuario.tipo === 'PRODUTOR'; //se for produtor é true
  }
  const handleDeletePerfil = async () => {
    if (!token) {
      alert("Erro de autenticação: Nenhum token encontrado.");
      return;
    }
    const confirmacao = window.confirm(
      "⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente a sua conta?\n\nEsta ação apagará todos os seus dados, plantações e funcionários. Isso não pode ser desfeito."
    );

    if (confirmacao) {
      try {
        const usuario: any = jwtDecode(token);
        const idProdutorLogado = usuario.id;

        await api.delete(`/produtores/${idProdutorLogado}`);

        alert("Conta excluída com sucesso!");
        logout();
      } catch (error) {
        alert("Erro ao tentar excluir a conta. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 4 }}>

      <HeaderBotaoTema mostrarVoltar={false} /> {/*chama o tema*/}
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '15px', boxShadow: 3, width: '100%' }}>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#408c42', mb: 1, textAlign: 'center' }}>
          🌱 Painel do Produtor G.R.A.O.
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
          Gestão de Recursos de Água e Otimização
        </Typography>

        {/*flexbox melhor q grid pra centralizar*/}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mb: 3 }}>

          {/* só aparece se for pra produtor */}
          {isProdutor && (
            <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>👤 Meu Perfil</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/alterar-perfil')} sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'bold', color: '#fff', '&:hover': { backgroundColor: '#614343' } }}>✏️ Alterar Meus Dados</Button>
                <Button variant="contained" color="error" fullWidth onClick={handleDeletePerfil} sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 'bold', color: '#fff' }}>🗑️ Deletar Conta</Button>
              </Box>
            </Paper>
          )}

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>🚜 Funcionários</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-funcionario')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Novo Funcionário</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-funcionarios')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '👥 Ver e Gerenciar funcionários' : '👥 Visualizar Funcionários'}
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>🍃 Culturas</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-cultura')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Nova Cultura</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-culturas')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '🌱 Ver e Ajustar Culturas' : '🌱 Visualizar Culturas'}</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>🔌 Dispositivos</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-dispositivo')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Novo Dispositivo</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-dispositivos')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '📡 Ver e Ajustar Dispositivos' : '📡 Visualizar Dispositivos'}</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>🌾 Plantações</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-plantacao')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Nova Plantação</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-plantacoes')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '🗺️ Ver e Gerenciar Plantações' : '🗺️ Visualizar Plantações'}</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>📡 Sensores</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-sensor')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Novo Sensor</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-sensores')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '🔬 Ver e Ajustar Sensores' : '🔬 Visualizar Sensores'}</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? '#614343' : '#f5f5f5', borderRadius: '10px', width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }, minWidth: '280px' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>📐 Setores</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {isProdutor && (
                <Button variant="contained" fullWidth onClick={() => navigate('/cadastro-setor')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#408c42', '&:hover': { backgroundColor: '#614343' } }}>➕ Novo Setor</Button>
              )}
              <Button variant="contained" fullWidth onClick={() => navigate('/lista-setores')} sx={{ textTransform: 'none', fontWeight: 'bold', color: '#fff', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#614343' } }}>
                {isProdutor ? '🗺️ Ver e Gerenciar Setores' : '🗺️ Visualizar Setores'}
                </Button>
            </Box>
          </Paper>

        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="error" onClick={logout} sx={{ fontWeight: 'bold', textTransform: 'none' }}>
            🚪 Sair do G.R.A.O
          </Button>
        </Box>

      </Box>
    </Container>
  );
}