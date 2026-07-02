import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import HeaderBotaoTema from './HeaderBotaoTema';

interface IAlterarFuncionarioForm {
    nome: string;
    email: string;
    especialidade: string;
    cnpjEmpregador: string;
}

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    especialidade: yup.string().required('A especialidade é obrigatória'),
    cnpjEmpregador: yup.string().required('CNPJ do empregador é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres (apenas os números ou letras)'),
}).required();

function AlterarFuncionario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IAlterarFuncionarioForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarDadosFuncionario = async () => {
            try {
                const response = await api.get(`/funcionarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const dados = response.data;

                reset({
                    nome: dados.usuario.nome,
                    email: dados.usuario.email,
                    especialidade: dados.especialidade,
                    cnpjEmpregador: dados.empregador?.cnpj || ''
                });
            } catch (error) {
                setErro("Não foi possível carregar os dados deste funcionário.");
            } finally {
                setCarregando(false);
            }
        };

        if (id && token) {
            carregarDadosFuncionario();
        }
    }, [id, token, reset]);

    const onSubmit = async (data: IAlterarFuncionarioForm) => {
        try {
            setErro('');
            setSucesso('');

            const payload = { ...data, senha: "" };

            await api.put(`/funcionarios/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSucesso('Dados do funcionário atualizados com sucesso!');

            setTimeout(() => {
                navigate('/lista-funcionarios');
            }, 2000);

        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao conectar com o servidor.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="success" /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

                <Button variant="text" onClick={() => navigate('/lista-funcionarios')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>
                    ⬅ Voltar para a Lista
                </Button>

                <HeaderBotaoTema mostrarVoltar={ false }/>

                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Alterar Funcionário</Typography>

                {erro && <Alert severity="error">{erro}</Alert>}
                {sucesso && <Alert severity="success">{sucesso}</Alert>}

                <TextField label="Nome Completo" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Especialidade / Cargo" {...register("especialidade")} error={!!errors.especialidade} helperText={errors.especialidade?.message} />
                <TextField label="CNPJ do Empregador" {...register("cnpjEmpregador")} error={!!errors.cnpjEmpregador} helperText={errors.cnpjEmpregador?.message} />
                <TextField label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Salvar Alterações
                </Button>
            </Box>
        </Container>
    );
}

export default AlterarFuncionario;