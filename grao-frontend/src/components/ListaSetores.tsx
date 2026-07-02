import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

export default function ListaSetores() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [setores, setSetores] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor

    const carregarSetores = async () => {
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

            const response = await api.get('/setores', { headers: { Authorization: `Bearer ${token}` } });

            // Filtra os setores para mostrar apenas os do produtor logado
            const meusSetores = response.data.filter(
                (s: any) => s.plantacao?.proprietarioId === Number(idProdutorLogado)
            );
            setSetores(meusSetores);
        } catch (err) {
            console.error("Erro ao carregar a lista de setores.", err);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarSetores(); }, [token]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Deseja realmente excluir este setor e todos os seus dispositivos associados?")) {
            try {
                await api.delete(`/setores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                alert("Setor excluído com sucesso!");
                carregarSetores();
            } catch (error) {
                alert("Erro ao excluir o setor.");
            }
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeaderBotaoTema />

            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '📐 Gerenciar Setores' : '📐 Lista de Setores'}</Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Nome / Área</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Plantação</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Cultura (Kc)</TableCell>
                            {isProdutor && (
                                <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {setores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                    Nenhum setor encontrado nas suas plantações.
                                </TableCell>
                            </TableRow>
                        ) : (
                            setores.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                        {s.nome} <br />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.areaHectares} ha | Tubos: {s.espacamentoTubos}m</Typography>
                                    </TableCell>

                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {s.plantacao?.nomeFazenda}
                                    </TableCell>

                                    <TableCell sx={{ color: 'text.primary' }}>
                                        {s.cultura ? `${s.cultura.nome} (${s.cultura.indiceKc})` : 'Sem cultura'}
                                    </TableCell>
                                    {isProdutor && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-setor/${s.id}`)}>
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