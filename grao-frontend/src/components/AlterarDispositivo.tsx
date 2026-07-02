import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

const schema = yup.object({
    setorDeOperacaoId: yup.number().typeError('Selecione um setor').required('Obrigatorio'),
    nivelBateria: yup.number().typeError('Deve ser um número').min(0).max(100).required(),
    macAddress: yup.string().required()
}).required();

export default function AlterarDispositivo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [setores, setSetores] = useState<any[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) return;
            try {
                const usuario: any = jwtDecode(token);
                // Busca setores
                const resSetores = await api.get('/setores', { headers: { Authorization: `Bearer ${token}` } });
                const meusSetores = resSetores.data.filter((s: any) => s.plantacao?.proprietarioId === usuario.id);
                setSetores(meusSetores);
                const resDisp = await api.get(`/dispositivos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                reset({
                    setorDeOperacaoId: resDisp.data.setorDeOperacaoId,
                    nivelBateria: resDisp.data.nivelBateria,
                    macAddress: resDisp.data.macAddress
                });
            } catch (error) {
                setErro("Erro ao carregar os dados.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [id, token, reset]);

    const onSubmit = async (data: any) => {
        try {
            await api.put(`/dispositivos/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
            alert('Dispositivo atualizado!');
            navigate('/lista-dispositivos');
        } catch (err: any) {
            setErro('Erro ao atualizar os dados.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/lista-dispositivos')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>⬅ Voltar</Button>
                <HeaderBotaoTema mostrarVoltar={ false }/>
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Editar Dispositivo</Typography>

                {erro && <Alert severity="error">{erro}</Alert>}
                <TextField disabled label="Endereço MAC" slotProps={{ inputLabel: { shrink: true } }} {...register("macAddress")} error={!!errors.macAddress} />

                <TextField select label="Setor" slotProps={{ inputLabel: { shrink: true } }} {...register("setorDeOperacaoId")} error={!!errors.setorDeOperacaoId} defaultValue="">
                    {setores.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.plantacao?.nomeFazenda} - {s.nome}</MenuItem>
                    ))}
                </TextField>
                <TextField label="Bateria (%)" type="number" slotProps={{ inputLabel: { shrink: true } }} {...register("nivelBateria")} error={!!errors.nivelBateria} />

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>Salvar Alterações</Button>
            </Box>
        </Container>
    );
}