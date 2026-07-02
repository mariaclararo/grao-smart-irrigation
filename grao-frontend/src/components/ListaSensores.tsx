import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

export default function ListaSensores() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [sensores, setSensores] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor

    const carregarSensores = async () => {
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
            const response = await api.get('/sensores', { headers: { Authorization: `Bearer ${token}` } });
            const meusSensores = response.data.filter(
                (s: any) => s.dispAssociado?.setorDeOperacao?.plantacao?.proprietarioId === Number(idProdutorLogado)
            );
            setSensores(meusSensores);
        } catch (err) {
            setErro("Erro ao carregar a lista de sensores.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarSensores(); }, [token]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Excluir este sensor e todos os seus dados/leituras?")) {
            try {
                await api.delete(`/sensores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                alert("Sensor excluído com sucesso!");
                carregarSensores();
            } catch (error) {
                alert("Erro ao excluir o sensor.");
            }
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeaderBotaoTema />
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '🔬 Gerenciar Sensores' : '🔬 Lista de Sensores'}</Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Tipo / Medida</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>MAC do Dispositivo</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Setor Associado</TableCell>
                            {isProdutor && (
                                <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sensores.length === 0 ? (
                            <TableRow><TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>Nenhum sensor encontrado.</TableCell></TableRow>
                        ) : (
                            sensores.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{s.tipo} ({s.unidadeMedida})</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{s.dispAssociado?.macAddress}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{s.dispAssociado?.setorDeOperacao?.nome}</TableCell>
                                    {isProdutor && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-sensor/${s.id}`)}>
                                                    ✏️ Editar
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDelete(s.id)}>
                                                    🗑️ Excluir
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}