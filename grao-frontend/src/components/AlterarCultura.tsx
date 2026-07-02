import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import HeaderBotaoTema from './HeaderBotaoTema';

interface IAlterarCultura {
    nome: string;
    variedade: string;
    indiceKc: number;
}

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    variedade: yup.string().required('A variedade é obrigatória'),
    indiceKc: yup.number().typeError('Deve ser um número').positive('Deve ser positivo').required('Kc é obrigatório'),
}).required();

export default function AlterarCultura() {
    const navigate = useNavigate(); 
    const { id } = useParams(); 
    const { token } = useAuth();
    
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IAlterarCultura>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await api.get(`/culturas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                reset({
                    nome: response.data.nome,
                    variedade: response.data.variedade,
                    indiceKc: response.data.indiceKc
                });
            } catch (error) {
                setErro("Erro ao carregar os dados.");
            } finally {
                setCarregando(false);
            }
        };
        if (id && token) carregarDados();
    }, [id, token, reset]);

    const onSubmit = async (data: IAlterarCultura) => {
        try {
            setErro('');
            await api.put(`/culturas/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            }); 
            setSucesso('Cultura atualizada com sucesso!');
            setTimeout(() => navigate('/lista-culturas'), 2000);
        } catch (err: any) {
            setErro('Erro ao atualizar os dados.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="success" /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <Button variant="text" onClick={() => navigate('/lista-culturas')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>
                    ⬅ Voltar para a Lista
                </Button>
                <HeaderBotaoTema mostrarVoltar={ false }/>

                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Alterar Cultura</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}
                {sucesso && <Alert severity="success">{sucesso}</Alert>}

                <TextField label="Nome da Cultura" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Variedade" {...register("variedade")} error={!!errors.variedade} helperText={errors.variedade?.message} />
                <TextField label="Índice Kc Atual" type="number" slotProps={{ htmlInput: { step: 0.01 }, inputLabel: { shrink: true} }} {...register("indiceKc")} error={!!errors.indiceKc} helperText={errors.indiceKc?.message} />
                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Salvar Alterações
                </Button>
            </Box>
        </Container>
    );
}