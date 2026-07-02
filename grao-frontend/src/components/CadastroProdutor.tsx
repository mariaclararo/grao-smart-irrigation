import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Grid, Paper, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/axios';
import HeaderBotaoTema from './HeaderBotaoTema';

interface IProdutor {
    nome: string;
    email: string;
    senha: string;
    cnpj: string;
    plano: string;
}

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().min(5, 'Senha deve ter no mínimo 5 caracteres').required('Senha é obrigatória'),
    cnpj: yup.string().required('CNPJ é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres (apenas os números ou letras)'),
    plano: yup.string().required('A escolha do plano é obrigatória'),
}).required();

function CadastroProdutor() {
    const navigate = useNavigate();
    const [erro, setErro] = useState('');
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<IProdutor>({
        resolver: yupResolver(schema),
        defaultValues: { plano: ''}
    });

    const planoSelecionado = watch("plano");

    const onSubmit = async (data: IProdutor) => {
        try {
            setErro('');
            
            await api.post('/produtores', data); 
            
            alert(`Cadastro de ${data.nome} realizado!`);
            
            navigate('/login'); 
            
        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao realizar o cadastro. Tente novamente.');
        }
    };
    

    const opcoesPlanos = [
        {id: 'start', titulo: 'G.R.A.O Start', hectares: 'Até 20 hectares', valor: 'R$ 450/mês' },
        {id: 'prime', titulo: 'G.R.A.O Prime', hectares: '21 a 100 hectares', valor: 'R$ 900/mês' },
        {id: 'master', titulo: 'G.R.A.O Master', hectares: 'Acima de 100 hectares', valor: 'R$ 1500/mês' },
    ];

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4}}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
                <HeaderBotaoTema mostrarVoltar={ false }/> {/*chama o tema*/}
                <Button 
                    variant="text" 
                    onClick={() => navigate('/login')} 
                    sx={{ alignSelf: 'flex-start', color: 'text.secondary', mt: -1, mb: 1, fontWeight: 'bold' }}>
                    ⬅ Voltar ao Login
                </Button>
                <Typography variant="h2">🌱 Cadastro de Produtor</Typography>
                {erro && <Alert severity="error">{erro}</Alert>}
                <TextField label="Nome Completo" placeholder="Ex: Fulano da Silva" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="CNPJ (14 dígitos alfanuméricos)" placeholder='Ex: AB123CDE456700' {...register("cnpj")} error={!!errors.cnpj} helperText={errors.cnpj?.message} />
                <TextField label="Email" placeholder='Ex: fulano@dominio.com' {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                <TextField label="Senha" type="password" {...register("senha")} error={!!errors.senha} helperText={errors.senha?.message} />

                <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 1.5, color: '#fff' }}>Plano de Assinatura:</Typography>
                    <Grid container spacing={1.5}>
                        {opcoesPlanos.map((plano) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plano.id}>
                                <Paper
                                    onClick={() => setValue("plano", plano.id, { shouldValidate: true })}
                                    sx={{
                                        padding: '14px 6px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        backgroundColor: planoSelecionado === plano.id ? '#ffffff' : '#bea9a9',
                                        color: '#151515',
                                        border: planoSelecionado === plano.id ? '3px solid #408c42' : '3px solid transparent',
                                        transition: 'all 0.15s ease-in-out',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.5
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{plano.titulo.split(' ')[1]}</Typography>
                                    <Typography variant="caption" sx={{ color: '#444', fontSize: '0.7rem' }}>{plano.hectares}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1e4620' }}>{plano.valor}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    {errors.plano && <Typography variant="caption" sx={{ color: '#ff9800', display: 'block', mt: 1, ml: 0.5 }}>{errors.plano.message}</Typography>}
                </Box>
                
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Cadastrar Produtor
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroProdutor;