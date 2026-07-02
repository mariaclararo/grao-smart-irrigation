import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

const schema = yup.object({
    nome: yup.string().required('Nome do setor é obrigatório'),
    areaHectares: yup.number().typeError('Deve ser número').positive().required('Obrigatório'),
    espacamentoTubos: yup.number().typeError('Deve ser número').positive().required('Obrigatório'),
    plantacaoId: yup.number().typeError('Selecione uma plantação').required('Obrigatório'),
    culturaId: yup.number().typeError('Selecione uma cultura').required('Obrigatório'),
}).required();

export default function CadastroSetor() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [erro, setErro] = useState('');
    const [plantacoes, setPlantacoes] = useState<any[]>([]);
    const [culturas, setCulturas] = useState<any[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const carregarOpcoes = async () => {
            if (!token) return;
            const usuario: any = jwtDecode(token);
            try {
                const resPlant = await api.get('/plantacoes', { headers: { Authorization: `Bearer ${token}` } });
                setPlantacoes(resPlant.data.filter((p: any) => p.proprietarioId === Number(usuario.id)));

                const resCulturas = await api.get('/culturas', { headers: { Authorization: `Bearer ${token}` } });
                setCulturas(resCulturas.data);
            } catch (err) {
                setErro("Erro ao carregar opções.");
            }
        };
        carregarOpcoes();
    }, [token]);

    const onSubmit = async (data: any) => {
        try {
            await api.post('/setores', data, { headers: { Authorization: `Bearer ${token}` } }); 
            alert(`Setor "${data.nome}" cadastrado!`);
            navigate('/lista-setores'); 
        } catch (err: any) {
            setErro('Erro ao conectar com o servidor.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderBotaoTema /> 
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>🌱 Cadastro de Setor</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField label="Nome do Setor" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message as string} />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label="Área (ha)" type="number" slotProps={{htmlInput:{step: 0.01}}} {...register("areaHectares")} error={!!errors.areaHectares} helperText={errors.areaHectares?.message as string} />
                    <TextField fullWidth label="Espaçamento (m)" type="number" slotProps={{htmlInput:{step: 0.01}}} {...register("espacamentoTubos")} error={!!errors.espacamentoTubos} helperText={errors.espacamentoTubos?.message as string} />
                </Box>

                <FormControl error={!!errors.plantacaoId}>
                    <InputLabel id="lbl-plantacao">Plantação Vinculada</InputLabel>
                    <Select labelId="lbl-plantacao" defaultValue="" {...register("plantacaoId")}>
                        <MenuItem value="" disabled>Selecione</MenuItem>
                        {plantacoes.map(p => <MenuItem key={p.id} value={p.id}>{p.nomeFazenda}</MenuItem>)}
                    </Select>
                    {errors.plantacaoId && <FormHelperText>{errors.plantacaoId.message as string}</FormHelperText>}
                </FormControl>

                <FormControl error={!!errors.culturaId}>
                    <InputLabel id="lbl-cultura">Cultura Plantada</InputLabel>
                    <Select labelId="lbl-cultura" defaultValue="" {...register("culturaId")}>
                        <MenuItem value="" disabled>Selecione</MenuItem>
                        {culturas.map(c => <MenuItem key={c.id} value={c.id}>{c.nome} - {c.variedade}</MenuItem>)}
                    </Select>
                    {errors.culturaId && <FormHelperText>{errors.culturaId.message as string}</FormHelperText>}
                </FormControl>

                <Button type="submit" variant="contained" sx={{ mt: 1, backgroundColor: '#408c42' }}>Cadastrar Setor</Button>
            </Box>
        </Container>
    );
}