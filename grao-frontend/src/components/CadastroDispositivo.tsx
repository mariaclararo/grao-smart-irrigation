import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

interface IDispositivo {
    setorDeOperacaoId: number;
    nivelBateria: number;
    macAddress: string;
}

const schema = yup.object({
    setorDeOperacaoId: yup.number().typeError('Selecione um setor').required('O setor é obrigatório'),
    nivelBateria: yup.number().typeError('O nível de bateria deve ser um número').min(0, 'O nível mínimo é 0%').max(100, 'O nível máximo é 100%').required('O nível de bateria é obrigatório'),
    macAddress: yup.string().required('O MAC Address é obrigatório')
        .test('valida-mac', 'Formato de MAC inválido.', (value) => {
            if (!value) return false;
            const padrao = value.replace(/[:.-]/g, "").trim();
            return /^[0-9a-fA-F]{12}$/.test(padrao);
        }),
}).required();

function CadastroDispositivo() {
    const navigate = useNavigate();
    const [erro, setErro] = useState('');
    const { token } = useAuth();
    const [setores, setSetores] = useState<any[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IDispositivo>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarSetores = async () => {
            if (!token) return;
            try {
                const usuario: any = jwtDecode(token);
                const response = await api.get('/setores', { headers: { Authorization: `Bearer ${token}` } });
                console.log("Todos os Setores do Banco:", response.data);
                console.log("Meu ID de Produtor é:", Number(usuario.id));
                const meusSetores = response.data.filter(
                    (s: any) => s.plantacao?.proprietarioId === Number(usuario.id)
                );
                setSetores(meusSetores);
            } catch (err) {
                setErro("Erro ao carregar os setores disponíveis.");
            }
        };
        carregarSetores();
    }, [token]);

    const onSubmit = async (data: IDispositivo) => {
        try {
            setErro('');

            // Envia o POST para a rota correspondente no seu server do Fastify
            await api.post('/dispositivos', data);

            alert(`Dispositivo MAC ${data.macAddress} cadastrado!`);

            navigate('/lista-dispositivos');

        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao conectar com o servidor.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderBotaoTema />                
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>🔌 Novo Dispositivo</Typography>

                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField select label="Setor de Operação (Suas Plantações)" {...register("setorDeOperacaoId")} error={!!errors.setorDeOperacaoId} helperText={errors.setorDeOperacaoId?.message} defaultValue="">
                    {setores.length === 0 && <MenuItem disabled value="">Nenhum setor cadastrado</MenuItem>}
                    {setores.map((setor) => (
                        <MenuItem key={setor.id} value={setor.id}>
                            {setor.plantacao?.nomeFazenda} - {setor.nome}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField label="Endereço MAC" {...register("macAddress")} placeholder="Ex: 00:1B:44:11:3A:B7" error={!!errors.macAddress} helperText={errors.macAddress?.message} />
                <TextField label="Nível Inicial da Bateria (%)" type="number" {...register("nivelBateria")} error={!!errors.nivelBateria} helperText={errors.nivelBateria?.message} />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>Cadastrar Dispositivo</Button>
            </Box>
        </Container>
    );
}

export default CadastroDispositivo;