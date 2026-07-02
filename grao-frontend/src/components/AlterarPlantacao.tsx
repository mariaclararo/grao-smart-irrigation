import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import HeaderBotaoTema from './HeaderBotaoTema';

const schema = yup.object({
    nomeFazenda: yup.string().required('Nome é obrigatório'),
    localizacao: yup.string().required('Localização é obrigatória'),
    totalHectares: yup.number().typeError('Deve ser um número').positive().required('Obrigatório')
}).required();

export default function AlterarPlantacao() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const { token } = useAuth();
    
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) return;
            try {
                const response = await api.get(`/plantacoes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                reset({
                    nomeFazenda: response.data.nomeFazenda,
                    localizacao: response.data.localizacao,
                    totalHectares: response.data.totalHectares
                });
            } catch (error) {
                setErro("Erro ao carregar os dados da plantação.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [id, token, reset]);

    const onSubmit = async (data: any) => {
        try {
            await api.put(`/plantacoes/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); 
            alert('Dados da plantação atualizados!');
            navigate('/lista-plantacoes');
        } catch (err: any) {
            setErro('Erro ao atualizar os dados.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/lista-plantacoes')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>⬅ Voltar</Button>
                <HeaderBotaoTema mostrarVoltar={ false }/>
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Editar Plantação</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField label="Nome da Fazenda" slotProps={{ inputLabel: { shrink: true } }} {...register("nomeFazenda")} error={!!errors.nomeFazenda} />
                <TextField label="Localização" slotProps={{ inputLabel: { shrink: true } }} {...register("localizacao")} error={!!errors.localizacao} />
                <TextField label="Total de Hectares" type="number" slotProps={{ htmlInput: { step: 0.1 }, inputLabel: { shrink: true } }} {...register("totalHectares")} error={!!errors.totalHectares} />

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>Salvar Alterações</Button>
            </Box>
        </Container>
    );
}