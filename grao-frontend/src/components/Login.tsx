import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/axios';
import HeaderBotaoTema from './HeaderBotaoTema';

interface ILogin {
    email: string;
    senha: string;
}

const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().min(5, 'Senha deve ter no mínimo 5 caracteres').required('Senha é obrigatória'),
}).required();

function Login() {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [erroRequisicao, setErroRequisicao] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ILogin>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: ILogin) => {
        try {
            setErroRequisicao('');

            const response = await api.post('/auth/login', {
                email: data.email,
                senha: data.senha
            });

            const { token } = response.data;
            setToken(token);
            alert('Autenticação concluída.')
            navigate('/'); // Manda para a rota protegida default (Home)

        } catch (err: any) {
            setErroRequisicao(err.response?.data?.message || 'Erro ao conectar com o servidor.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderBotaoTema mostrarVoltar={ false }/> {/*chama o tema*/}
                <Typography variant="h2" sx={{ textAlign: 'center', mb: 1 }}> 🌱 G.R.A.O. Login</Typography>

                {erroRequisicao && <Alert severity="error">{erroRequisicao}</Alert>}

                <TextField
                    label="Email"
                    placeholder='Ex: fulano@dominio.com'
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label="Senha"
                    type="password"
                    {...register("senha")}
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                />

                <Button type="submit" variant="contained" fullWidth>
                    Enviar
                </Button>

                <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/cadastro-produtor')} 
                    sx={{ textTransform: 'none', fontWeight: 'bold', color: '#bea9a9', '&:hover': { color: '#fff' } }}
                >
                    Não tem uma conta? Cadastre-se como Produtor
                </Button>
            </Box>
        </Container>
    );
}

export default Login;