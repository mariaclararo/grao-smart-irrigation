import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

export default function ListaDispositivos() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [dispositivos, setDispositivos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [dispSelecionado, setDispSelecionado] = useState<any>(null);

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor

    const carregarDispositivos = async () => {
        try {
            setCarregando(true);
            if (!usuarioLogado) return; //se n tiver token
            let idProdutorLogado = usuarioLogado.id; //por padrao assume q o usuario é o proprio produtor ja


            if (usuarioLogado.tipo === 'FUNCIONARIO') {
                const resFuncionario = await api.get(`/funcionarios/${usuarioLogado.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                idProdutorLogado = resFuncionario.data.empregadorId;
            }

            const response = await api.get('/dispositivos', { headers: { Authorization: `Bearer ${token}` } });

            const meusDisps = response.data.filter(
                (d: any) => d.setorDeOperacao?.plantacao?.proprietarioId === Number(idProdutorLogado)
            );
            setDispositivos(meusDisps);
        } catch (err) {
            setErro("Erro ao carregar a lista de dispositivos.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarDispositivos(); }, [token]);

    const handleDelete = async (id: number, mac: string) => {
        if (window.confirm(`Excluir o dispositivo MAC ${mac}?`)) {
            try {
                await api.delete(`/dispositivos/${id}`, { headers: { Authorization: `Bearer ${token}` } });

                alert(`Dispositivo de MAC ${mac} deletado com sucesso.`);
                carregarDispositivos();
            } catch (error) {
                alert("Erro ao excluir.");
            }
        }
    };

    const abrirModalSaude = (dispositivo: any) => {
        setDispSelecionado(dispositivo);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setDispSelecionado(null);
    };

    const getMensagemSaude = (nivel: number) => {
        if (nivel <= 20) return "Carregue o dispositivo imediatamente. Risco de perda de dados.";
        if (nivel <= 50) return "Recarregue ou troque a bateria nas próximas manutenções.";
        return "O dispositivo está operando com níveis adequados de bateria.";
    };

    const getCorBateria = (nivel: number) => {
        if (nivel > 50) return '#4caf50';
        if (nivel >= 20) return '#ffeb3b';
        return '#f44336';
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeaderBotaoTema />
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '🔌 Gerenciar Dispositivos' : '🔌 Lista de Dispositivos'}</Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>MAC Address</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Plantação - Setor</TableCell>
                            <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dispositivos.length === 0 ? (
                            <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 3 }}>Nenhum dispositivo encontrado em suas plantações.</TableCell></TableRow>
                        ) : (
                            dispositivos.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell sx={{ color: getCorBateria(d.nivelBateria), fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {d.macAddress}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>
                                        {d.setorDeOperacao?.plantacao?.nomeFazenda} - {d.setorDeOperacao?.nome}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Button variant="contained" color="info" size="small" onClick={() => abrirModalSaude(d)} sx={{ color: '#0f5c4b' }}>
                                                🔋 Verificar Bateria
                                            </Button>
                                            {isProdutor && (
                                                <>
                                                    <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-dispositivo/${d.id}`)}>
                                                        ✏️ Editar
                                                    </Button>
                                                    <Button variant="contained" color="error" size="small" onClick={() => handleDelete(d.id, d.macAddress)}>
                                                        🗑️ Excluir
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={modalAberto} onClose={fecharModal} sx={{ '& .MuiPaper-root': { backgroundColor: 'action.hover', color: 'text.primary', minWidth: '350px' } }}>
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid text.secondary', mb: 2, color: 'text.primary' }}>
                    Saúde da Bateria
                </DialogTitle>
                <DialogContent>
                    {dispSelecionado && (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h2" sx={{ color: getCorBateria(dispSelecionado.nivelBateria), fontWeight: 'bold', mb: 2 }}>
                                {dispSelecionado.nivelBateria}%
                            </Typography>
                            <DialogContentText sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                                {dispSelecionado.nivelBateria <= 20 && "⚠️ NÍVEL CRÍTICO!"}
                                {dispSelecionado.nivelBateria > 20 && dispSelecionado.nivelBateria <= 50 && "⚠️ NÍVEL BAIXO!"}
                                {dispSelecionado.nivelBateria > 50 && "✅ BATERIA OK!"}
                            </DialogContentText>
                            <DialogContentText sx={{ color: 'text.secondary', mt: 1 }}>
                                {getMensagemSaude(dispSelecionado.nivelBateria)}
                            </DialogContentText>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={fecharModal} variant="contained" color="primary" fullWidth>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}