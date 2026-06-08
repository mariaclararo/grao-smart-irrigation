import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface ISetor {
    nome: string;
    areaHectares: number;
    espacamentoTubos: number;
    plantacaoId: string;
    culturaId: string;
}

const schema = yup.object({
    nome: yup.string().required('Nome do setor é obrigatório'),
    areaHectares: yup.number().typeError('A área deve ser um número').positive('A área deve ser maior que zero').required('A área do setor é obrigatória'),
    espacamentoTubos: yup.number().typeError('O espaçamento deve ser um número').positive('O espaçamento deve ser maior que zero').required('O espaçamento dos tubos é obrigatório'),
    plantacaoId: yup.string().required('Indicar a fazenda vinculada é obrigatório'),
    culturaId: yup.string().required('Indicar a cultura é obrigatório'),
}).required();

function CadastroSetor() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISetor>({
        resolver: yupResolver(schema),
        defaultValues: { plantacaoId: '', culturaId: '' }
    });

    const onSubmit = (data: ISetor) => {
        const dadosFormatados = {
            ...data,
            plantacaoId: Number(data.plantacaoId),
            culturaId: Number(data.culturaId)
        };
        console.log('Setor Enviado:', dadosFormatados);
        alert(`Setor "${data.nome}" cadastrado!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Setor</Typography>

                <TextField label="Nome do Setor / Identificação" {...register("nome")} placeholder='Ex: Talhão Sul' error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Área do Setor (ha)" type="number" slotProps={{htmlInput:{step: 0.01}}} {...register("areaHectares")} placeholder="Ex: 624.42" error={!!errors.areaHectares} helperText={errors.areaHectares?.message} />
                <TextField label="Espaçamento dos Tubos (m)" type="number" slotProps={{htmlInput:{step: 0.01}}} {...register("espacamentoTubos")} placeholder="Ex: 0.75" error={!!errors.espacamentoTubos} helperText={errors.espacamentoTubos?.message} />
                <TextField label="Plantação Vinculada" {...register("plantacaoId")} placeholder='Ex: Fazenda Feliz' error={!!errors.plantacaoId} helperText={errors.plantacaoId?.message} />
                <TextField label="Cultura Plantada" {...register("culturaId")} placeholder="Ex: Café Arábica - Catuaí" error={!!errors.culturaId} helperText={errors.culturaId?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Setor
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroSetor;