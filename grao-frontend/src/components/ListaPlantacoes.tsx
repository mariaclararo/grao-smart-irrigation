import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';


export default function ListaPlantacoes() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [plantacoes, setPlantacoes] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor


    const carregarPlantacoes = async () => {
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

            const response = await api.get('/plantacoes', { headers: { Authorization: `Bearer ${token}` } });

            const minhasPlantacoes = response.data.filter(
                (p: any) => p.proprietarioId === Number(idProdutorLogado)
            );
            setPlantacoes(minhasPlantacoes);
        } catch (err) {
            setErro("Erro ao carregar a lista de plantações.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { carregarPlantacoes(); }, [token]);

    const handleDelete = async (id: number, nome: string) => {
        if (window.confirm(`ATENÇÃO: Excluir a fazenda "${nome}" apagará todos os setores e dispositivos associados a ela.\n\nDeseja continuar?`)) {
            try {
                await api.delete(`/plantacoes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                alert(`Plantação "${nome}" deletada com sucesso!`);
                carregarPlantacoes();
            } catch (error) {
                alert("Erro ao excluir a plantação.");
            }
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeaderBotaoTema />
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '🌾 Gerenciar Plantações' : '🌾 Lista de Plantações'}</Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Nome da Fazenda</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Localização</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}>Área (Hectares)</TableCell>
                            {isProdutor && (
                                <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plantacoes.length === 0 ? (
                            <TableRow><TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>Nenhuma plantação cadastrada no seu perfil.</TableCell></TableRow>
                        ) : (
                            plantacoes.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{p.nomeFazenda}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{p.localizacao}</TableCell>
                                    <TableCell align="center" sx={{ color: 'text.primary' }}>{p.totalHectares} ha</TableCell>
                                    {isProdutor && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-plantacao/${p.id}`)}>
                                                    ✏️ Editar
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDelete(p.id, p.nomeFazenda)}>
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