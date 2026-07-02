import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

interface IAlterarPerfilProdutor {
    nome: string;
    email: string;
    cnpj: string;
    plano: string;
}

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres'),
    plano: yup.string().required('A escolha do plano é obrigatória'),
}).required();

function AlterarPerfilProdutor() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<IAlterarPerfilProdutor>({
        resolver: yupResolver(schema),
    });

    const planoSelecionado = watch("plano");

    useEffect(() => {
        const carregarDadosDoPerfil = async () => {
            try {
                if (!token) return;

                const usuarioDecodificado: any = jwtDecode(token);
                const idProdutorLogado = usuarioDecodificado.id;

                const response = await api.get(`/produtores/${idProdutorLogado}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const dados = response.data;

                let planoTexto = 'start';
                if (dados.planoId === 2) planoTexto = 'prime';
                if (dados.planoId === 3) planoTexto = 'master';

                reset({
                    nome: dados.usuario.nome,
                    email: dados.usuario.email,
                    cnpj: dados.cnpj,
                    plano: planoTexto
                });

            } catch (error) {
                setErro("Não foi possível carregar seus dados atuais.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosDoPerfil();
    }, [token, reset]);

    const onSubmit = async (data: IAlterarPerfilProdutor) => {
        try {
            setErro('');
            setSucesso('');

            if (!token) return;
            const usuarioDecodificado: any = jwtDecode(token);
            const idProdutorLogado = usuarioDecodificado.id;

            const payload = { ...data, senha: "" };

            await api.put(`/produtores/${idProdutorLogado}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSucesso('Perfil atualizado com sucesso!');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao atualizar os dados. Tente novamente.');
        }
    };

    const opcoesPlanos = [
        { id: 'start', titulo: 'G.R.A.O Start', hectares: 'Até 20 hectares', valor: 'R$ 450/mês' },
        { id: 'prime', titulo: 'G.R.A.O Prime', hectares: '21 a 100 hectares', valor: 'R$ 900/mês' },
        { id: 'master', titulo: 'G.R.A.O Master', hectares: 'Acima de 100 hectares', valor: 'R$ 1500/mês' },
    ];

    if (carregando) {
        return (
            <Container sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="success" />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

                <HeaderBotaoTema />

                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Alterar Perfil</Typography>

                {erro && <Alert severity="error">{erro}</Alert>}
                {sucesso && <Alert severity="success">{sucesso}</Alert>}

                <TextField label="Nome Completo" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Novo E-mail" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                <TextField label="CNPJ do Produtor" {...register("cnpj")} error={!!errors.cnpj} helperText={errors.cnpj?.message} />

                <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 1.5, color: '#fff' }}>Seu Plano:</Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                        {opcoesPlanos.map((plano) => (
                            <Paper
                                key={plano.id}
                                onClick={() => setValue("plano", plano.id, { shouldValidate: true })}
                                sx={{
                                    padding: '14px 6px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    backgroundColor: planoSelecionado === plano.id ? '#ffffff' : '#bea9a9',
                                    color: '#151515',
                                    border: planoSelecionado === plano.id ? '3px solid #408c42' : '3px solid transparent',
                                    transition: 'all 0.15s ease-in-out',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{plano.titulo.split(' ')[1]}</Typography>
                                <Typography variant="caption" sx={{ color: '#444', fontSize: '0.7rem' }}>{plano.hectares}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1e4620' }}>{plano.valor}</Typography>
                            </Paper>
                        ))}
                    </Box>
                    {errors.plano && <Typography variant="caption" sx={{ color: '#408c42', display: 'block', mt: 1, ml: 0.5 }}>{errors.plano.message}</Typography>}
                </Box>

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Salvar Alterações
                </Button>
            </Box>
        </Container>
    );
}

export default AlterarPerfilProdutor;