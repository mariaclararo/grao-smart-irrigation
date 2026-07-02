import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios'; 
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';
import HeaderBotaoTema from './HeaderBotaoTema';

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    areaHectares: yup.number().typeError('Deve ser número').required('Obrigatório'),
    espacamentoTubos: yup.number().typeError('Deve ser número').required('Obrigatório'),
    plantacaoId: yup.number().typeError('Obrigatório').required(),
    culturaId: yup.number().typeError('Obrigatório').required(),
}).required();

export default function AlterarSetor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [erro, setErro] = useState('');
    const [plantacoes, setPlantacoes] = useState<any[]>([]);
    const [culturas, setCulturas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { plantacaoId: '', culturaId: '' }
    });

    const plantacaoSelecionada = watch("plantacaoId");
    const culturaSelecionada = watch("culturaId");

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) return;
            try {
                const usuario: any = jwtDecode(token);
                
                const resPlant = await api.get('/plantacoes', { headers: { Authorization: `Bearer ${token}` } });
                setPlantacoes(resPlant.data.filter((p: any) => p.proprietarioId === Number(usuario.id)));

                const resCulturas = await api.get('/culturas', { headers: { Authorization: `Bearer ${token}` } });
                setCulturas(resCulturas.data);

                const resSetor = await api.get(`/setores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                reset({
                    nome: resSetor.data.nome,
                    areaHectares: resSetor.data.areaHectares,
                    espacamentoTubos: resSetor.data.espacamentoTubos,
                    plantacaoId: resSetor.data.plantacaoId,
                    culturaId: resSetor.data.culturaId
                });
            } catch (err) {
                setErro("Erro ao carregar os dados.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [id, token, reset]);

    const onSubmit = async (data: any) => {
        try {
            await api.put(`/setores/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); 
            alert('Setor atualizado com sucesso!');
            navigate('/lista-setores'); 
        } catch (err: any) {
            setErro('Erro ao atualizar.');
        }
    };

    if (carregando) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="text" onClick={() => navigate('/lista-setores')} sx={{ alignSelf: 'flex-start', color: '#bea9a9' }}>⬅ Voltar</Button>
                <HeaderBotaoTema mostrarVoltar={ false }/>
                <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>⚙️ Editar Setor</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField label="Nome do Setor" slotProps={{ inputLabel: { shrink: true } }} {...register("nome")} error={!!errors.nome} />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label="Área (ha)" type="number" slotProps={{ htmlInput:{step: 0.01}, inputLabel: { shrink: true } }} {...register("areaHectares")} />
                    <TextField fullWidth label="Espaçamento (m)" type="number" slotProps={{ htmlInput:{step: 0.01}, inputLabel: { shrink: true } }} {...register("espacamentoTubos")} />
                </Box>

                <FormControl>
                    <InputLabel id="lbl-plantacao" shrink>Plantação Vinculada</InputLabel>
                    <Select labelId="lbl-plantacao" notched {...register("plantacaoId")} value={plantacaoSelecionada || ""}>
                        {plantacoes.map(p => <MenuItem key={p.id} value={p.id}>{p.nomeFazenda}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="lbl-cultura" shrink>Cultura Plantada</InputLabel>
                    <Select labelId="lbl-cultura" notched {...register("culturaId")} value={culturaSelecionada || ""}>
                        {culturas.map(c => <MenuItem key={c.id} value={c.id}>{c.nome} - {c.variedade}</MenuItem>)}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="success" sx={{ mt: 2, fontWeight: 'bold' }}>Salvar Alterações</Button>
            </Box>
        </Container>
    );
}