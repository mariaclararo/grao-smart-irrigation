import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import HeaderBotaoTema from './HeaderBotaoTema';
import { jwtDecode } from 'jwt-decode';

interface ICultura {
    id: number;
    nome: string;
    variedade: string;
    indiceKc: number;
}

export default function ListaCulturas() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [culturas, setCulturas] = useState<ICultura[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor

    const carregarCulturas = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/culturas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCulturas(response.data);
        } catch (err) {
            setErro("Erro ao carregar a lista de culturas.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarCulturas();
    }, [token]);

    const handleDeleteCultura = async (id: number, nome: string) => {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir a cultura ${nome}?`);
        if (confirmacao) {
            try {
                await api.delete(`/culturas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Cultura excluída com sucesso!");
                carregarCulturas();
            } catch (error) {
                alert("Erro ao excluir a cultura.");
            }
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="success" /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeaderBotaoTema />
            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '🍃 Gerenciar Culturas' : '🍃 Lista de Culturas'}</Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Variedade</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Índice Kc Atual</TableCell>
                            {isProdutor && (
                                <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {culturas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>Nenhuma cultura encontrada no sistema.</TableCell>
                            </TableRow>
                        ) : (
                            culturas.map((cultura) => (
                                <TableRow key={cultura.id}>
                                    <TableCell sx={{ color: 'text.primary' }}>{cultura.nome}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{cultura.variedade}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{cultura.indiceKc.toFixed(3)}</TableCell>
                                    {isProdutor && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-cultura/${cultura.id}`)}>
                                                    ✏️ Editar
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDeleteCultura(cultura.id, cultura.nome)}>
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