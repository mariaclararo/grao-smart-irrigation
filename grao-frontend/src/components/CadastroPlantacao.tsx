import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/axios';
import HeaderBotaoTema from './HeaderBotaoTema';

interface ICultura {
    id: number;
    nome: string;
    variedade: string;
}

interface IPlantacao {
    nomeFazenda: string;
    localizacao: string;
    totalHectares: number;
    cnpjProdutor: string;
    culturaId: number;
}

const schema = yup.object({
    nomeFazenda: yup.string().required('Nome da fazenda é obrigatório'),
    localizacao: yup.string().required('A localização é obrigatória').matches(/^[a-zA-ZÀ-ÿ\s]+-[a-zA-Z]{2}$/, 'Formato inválido. Padrão: Cidade-Estado(Sigla)'),
    totalHectares: yup.number().typeError('O total de hectares deve ser um número').positive('O valor deve ser maior que zero').required('O total de hectares é obrigatório'),
    cnpjProdutor: yup.string().required('CNPJ do proprietário é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres (apenas os números ou letras)'),
    culturaId: yup.number().typeError('Selecione uma cultura').required('Cultura é obrigatória'),
}).required();

function CadastroPlantacao() {
    const navigate = useNavigate();
    const [erro, setErro] = useState('');
    const [culturas, setCulturas] = useState<ICultura[]>([]); //estado que guarda as culturas existentes no bd
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IPlantacao>({
        resolver: yupResolver(schema),
    });

    //get assim que abre para buscar todas as culturas cadastradas
    useEffect(() => {
        const carregarCulturas = async () => {
            try{
                const response = await api.get('/culturas');
                setCulturas(response.data);
            } catch(error) {
                console.error("Erro ao carregar culturas do banco de dados:", error);
            }
        };
        carregarCulturas();
    }, []);

    const onSubmit = async (data: IPlantacao) => {
        try {
            setErro('');
            
            //envia post para rota correspondente do fastfy
            await api.post('/plantacoes', data); 
            
            alert(`Fazenda ${data.nomeFazenda} cadastrada com sucesso!`);
            
            navigate('/lista-plantacoes'); 
            
        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao conectar com o servidor.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <HeaderBotaoTema />
                <Typography variant="h2">🌱 Cadastro de Plantação</Typography>
                
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField label="Nome da Fazenda" {...register("nomeFazenda")} placeholder='Ex: Fazenda Feliz' error={!!errors.nomeFazenda} helperText={errors.nomeFazenda?.message} />
                <TextField label="Localização (Cidade-Estado)" {...register("localizacao")} placeholder="Ex: Itajubá-MG" error={!!errors.localizacao} helperText={errors.localizacao?.message} />
                <TextField label="Total de Hectares (ha)" type="number" {...register("totalHectares")}  slotProps={{htmlInput:{step: 0.1}}} placeholder="Ex: 215.5" error={!!errors.totalHectares} helperText={errors.totalHectares?.message} />
                <TextField label="CNPJ do Produtor Vinculado" {...register("cnpjProdutor")} placeholder="Ex: AB123CDE456700" error={!!errors.cnpjProdutor} helperText={errors.cnpjProdutor?.message} />
                <TextField
                    select
                    label = "Cultura do Setor Principal"
                    defaultValue=""
                    {...register("culturaId")}
                    error={!!errors.culturaId}
                    helperText={errors.culturaId?.message}
                >
                    <MenuItem value="" disabled> Selecione a cultura</MenuItem>
                    {culturas.map((cultura) => (
                        <MenuItem key={cultura.id} value={cultura.id}>
                            {cultura.nome} - {cultura.variedade}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Plantação
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroPlantacao;