import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

interface ISensor {
    tipo: string;
    unidadeMedida: string;
    dispAssociadoId: number;
}

const schema = yup.object({
    tipo: yup.string().required('A seleção do tipo de sensor é obrigatória'),
    unidadeMedida: yup.string().required('A unidade de medida é obrigatória'),
    dispAssociadoId: yup.number().typeError('Selecione um dispositivo').required('O dispositivo associado é obrigatório')
}).required();

function CadastroSensor() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [erro, setErro] = useState('');
    const [dispositivos, setDispositivos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ISensor>({
        resolver: yupResolver(schema),
        defaultValues: { tipo: '', unidadeMedida: '' }
    });

    const tipoSelecionado = watch("tipo");

    useEffect(() => {
        const carregarDispositivos = async () => {
            if (!token) return;
            try {
                const usuario: any = jwtDecode(token);
                const response = await api.get('/dispositivos', { headers: { Authorization: `Bearer ${token}` } });
                const meusDisps = response.data.filter(
                    (d: any) => d.setorDeOperacao?.plantacao?.proprietarioId === Number(usuario.id)
                );
                setDispositivos(meusDisps);
            } catch (err) {
                setErro("Erro ao carregar dispositivos disponíveis.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDispositivos();
    }, [token]);

    const onSubmit = async (data: ISensor) => {
        try {
            setErro('');

            await api.post('/sensores', data);

            alert(`Sensor do tipo ${data.tipo} cadastrado`);

            navigate('/lista-sensores');

        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao conectar com o servidor.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;
    
    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderBotaoTema /> 
                <Typography variant="h2">🌱 Cadastro de Sensor Transmissor</Typography>
                {erro && <Alert severity="error">{erro}</Alert>}

                <FormControl error={!!errors.dispAssociadoId}>
                    <InputLabel id="select-disp-label">Dispositivo Associado (MAC)</InputLabel>
                    <Select labelId="select-disp-label" defaultValue="" {...register("dispAssociadoId")}>
                        <MenuItem value="" disabled>Selecione um Dispositivo</MenuItem>
                        {dispositivos.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.macAddress} ({d.setorDeOperacao?.nome})
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.dispAssociadoId && <FormHelperText>{errors.dispAssociadoId.message}</FormHelperText>}
                </FormControl>

                <FormControl error={!!errors.tipo}>
                    <InputLabel id="select-tipo-label">Tipo do Sensor</InputLabel>
                    <Select labelId="select-tipo-label" defaultValue="" {...register("tipo")}>
                        <option value="" disabled style={{ color: '#555' }}></option>
                        <MenuItem value="Umidade">Umidade</MenuItem>
                        <MenuItem value="Fluxo">Fluxo</MenuItem>
                    </Select>
                    {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
                </FormControl>

                <FormControl error={!!errors.unidadeMedida}>
                    <InputLabel id="select-unidade-label">Unidade de Medida</InputLabel>
                    <Select labelId="select-unidade-label" defaultValue="" {...register("unidadeMedida")}>
                        <option value="" disabled style={{ color: '#555' }}></option>
                        {tipoSelecionado === 'Umidade' && (
                            <MenuItem value="%">Porcentagem (%)</MenuItem>
                        )}
                        {tipoSelecionado === 'Fluxo' && [
                            <MenuItem key="GPH" value="GPH">Galões por Hora (GPH)</MenuItem>,
                            <MenuItem key="Lh" value="L/h">Litros por Hora (L/h)</MenuItem>
                        ]}
                        {!tipoSelecionado && (
                            <MenuItem value="" disabled>Escolha o tipo primeiro</MenuItem>
                        )}
                    </Select>
                    {errors.unidadeMedida && <FormHelperText>{errors.unidadeMedida.message}</FormHelperText>}
                </FormControl>

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Sensor
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroSensor;