import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios'; 
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

const schema = yup.object({
    tipo: yup.string().required('A seleção do tipo é obrigatória'),
    unidadeMedida: yup.string().required('A unidade é obrigatória'),
    dispAssociadoId: yup.number().typeError('Selecione um dispositivo').required('Obrigatório')
}).required();

export default function AlterarSensor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [erro, setErro] = useState('');
    const [dispositivos, setDispositivos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { tipo: '', unidadeMedida: '', dispAssociadoId: '' } 
    });

    const tipoSelecionado = watch("tipo");
    const dispSelecionado = watch("dispAssociadoId");
    const unidadeSelecionada = watch("unidadeMedida");

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) return;
            try {
                const usuario: any = jwtDecode(token);
                
                const resDisps = await api.get('/dispositivos', { headers: { Authorization: `Bearer ${token}` } });
                const meusDisps = resDisps.data.filter((d: any) => d.setorDeOperacao?.plantacao?.proprietarioId === Number(usuario.id));
                setDispositivos(meusDisps);

                const resSensor = await api.get(`/sensores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                reset({
                    tipo: resSensor.data.tipo,
                    unidadeMedida: resSensor.data.unidadeMedida,
                    dispAssociadoId: resSensor.data.dispAssociadoId
                });
            } catch (err) {
                setErro("Erro ao carregar dados do sensor.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [id, token, reset]);

    const onSubmit = async (data: any) => {
        try {
            await api.put(`/sensores/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); 
            alert('Sensor atualizado com sucesso!');
            navigate('/lista-sensores'); 
        } catch (err: any) {
            setErro('Erro ao atualizar os dados.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/lista-sensores')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>⬅ Voltar</Button>
                <HeaderBotaoTema mostrarVoltar={ false }/>
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Editar Sensor</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}

                <FormControl error={!!errors.dispAssociadoId}>
                    <InputLabel id="select-disp-label" shrink>Dispositivo Associado (MAC)</InputLabel>
                    <Select 
                        labelId="select-disp-label" 
                        notched 
                        {...register("dispAssociadoId")} 
                        value={dispSelecionado || ""} 
                    >
                        {dispositivos.map((d) => (
                            <MenuItem key={d.id} value={d.id}>{d.macAddress} ({d.setorDeOperacao?.nome})</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="select-tipo-label" shrink>Tipo do Sensor (Fixo)</InputLabel>
                    <Select 
                        labelId="select-tipo-label" 
                        notched 
                        disabled
                        {...register("tipo")} 
                        value={tipoSelecionado || ""} 
                        sx={{ backgroundColor: '#e0e0e0', opacity: 0.8 }}
                    >
                        <MenuItem value="Umidade">Umidade</MenuItem>
                        <MenuItem value="Fluxo">Fluxo</MenuItem>
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="select-unidade-label" shrink>Unidade de Medida (Fixa)</InputLabel>
                    <Select 
                        labelId="select-unidade-label" 
                        notched 
                        disabled // 🛠️ Bloqueia a edição
                        {...register("unidadeMedida")} 
                        value={unidadeSelecionada || ""}
                        sx={{ backgroundColor: '#e0e0e0', opacity: 0.8 }}
                    >
                        {tipoSelecionado === 'Umidade' && <MenuItem value="%">Porcentagem (%)</MenuItem>}
                        {tipoSelecionado === 'Fluxo' && [<MenuItem key="GPH" value="GPH">GPH</MenuItem>, <MenuItem key="Lh" value="L/h">L/h</MenuItem>]}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>Salvar Alterações</Button>
            </Box>
        </Container>
    );
}