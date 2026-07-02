import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';


interface IFuncionario {
    id: number;
    especialidade: string;
    empregadorId: number;
    usuario: {
        id: number;
        nome: string;
        email: string;
        tipo: string;
    };
    empregador: {
        id: number;
        cnpj: string;
    };
}

export default function ListaFuncionarios() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const usuarioLogado: any = token ? jwtDecode(token) : null;
    const isProdutor = usuarioLogado.tipo === 'PRODUTOR'; //true se for produtor


    const carregarFuncionarios = async () => {
        try {
            setCarregando(true);

            if (!usuarioLogado) return; //se n tiver token
            let idProdutorLogado = usuarioLogado.id; //por padrao assume q o usuario é o proprio produtor ja

            if (!isProdutor) {
                const resFuncionario = await api.get(`/funcionarios/${usuarioLogado.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                idProdutorLogado = resFuncionario.data.empregadorId;
            }

            const response = await api.get('/funcionarios', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const funcionarios = response.data.filter(
                (func: IFuncionario) => func.empregadorId === idProdutorLogado
            );
            setFuncionarios(funcionarios); //mostra so os funcs do produtos usando o sistema
        } catch (err) {
            setErro("Erro ao carregar a lista de funcionários.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, [token]);

    const handleDeleteFuncionario = async (id: number, nome: string) => {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir o funcionário ${nome}?`);

        if (confirmacao) {
            try {
                await api.delete(`/funcionarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Funcionário excluído com sucesso!");
                carregarFuncionarios(); //atualiza tabela pos delete
            } catch (error) {
                alert("Erro ao excluir o funcionário.");
            }
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="success" /></Container>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <HeaderBotaoTema />

            <Typography variant="h3" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                {isProdutor ? '👥 Gerenciar Funcionários' : '👥 Lista de Funcionários'}</Typography>

            {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Especialidade</TableCell>
                            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Email</TableCell>
                            {isProdutor && (
                                <TableCell align="center" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {funcionarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isProdutor ? 4 : 3} align="center" sx={{ color: 'text.secondary', py: 3 }}>Nenhum funcionário encontrado.</TableCell>
                            </TableRow>
                        ) : (
                            funcionarios.map((func) => (
                                <TableRow key={func.id}>
                                    <TableCell sx={{ color: 'text.primary' }}>{func.usuario?.nome}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{func.especialidade}</TableCell>
                                    <TableCell sx={{ color: 'text.primary' }}>{func.usuario?.email}</TableCell>
                                    {isProdutor && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/alterar-funcionario/${func.id}`)}>
                                                    ✏️ Editar
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDeleteFuncionario(func.id, func.usuario?.nome)}>
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