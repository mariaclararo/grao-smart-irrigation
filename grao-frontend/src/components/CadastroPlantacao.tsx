import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface IPlantacao {
    nomeFazenda: string;
    localizacao: string;
    totalHectares: number;
    cnpjProdutor: string;
}

const schema = yup.object({
    nomeFazenda: yup.string().required('Nome da fazenda é obrigatório'),
    localizacao: yup.string().required('A localização é obrigatória').matches(/^[a-zA-ZÀ-ÿ\s]+-[a-zA-Z]{2}$/, 'Formato inválido. Padrão: Cidade-Estado(Sigla)'),
    totalHectares: yup.number().typeError('O total de hectares deve ser um número').positive('O valor deve ser maior que zero').required('O total de hectares é obrigatório'),
    cnpjProdutor: yup.string().required('CNPJ do proprietário é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres (apenas os números ou letras)'),
}).required();

function CadastroPlantacao() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IPlantacao>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: IPlantacao) => {
        console.log('Dados da plantação enviados:', data);
        alert(`Fazenda ${data.nomeFazenda} cadastrada!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Plantação</Typography>

                <TextField label="Nome da Fazenda" {...register("nomeFazenda")} placeholder='Ex: Fazenda Feliz' error={!!errors.nomeFazenda} helperText={errors.nomeFazenda?.message} />
                <TextField label="Localização (Cidade-Estado)" {...register("localizacao")} placeholder="Ex: Itajubá-MG" error={!!errors.localizacao} helperText={errors.localizacao?.message} />
                <TextField label="Total de Hectares (ha)" type="number" {...register("totalHectares")}  slotProps={{htmlInput:{step: 0.1}}} placeholder="Ex: 215.5" error={!!errors.totalHectares} helperText={errors.totalHectares?.message} />
                <TextField label="CNPJ do Produtor Vinculado" {...register("cnpjProdutor")} placeholder="Ex: AB123CDE456700" error={!!errors.cnpjProdutor} helperText={errors.cnpjProdutor?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Plantação
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroPlantacao;