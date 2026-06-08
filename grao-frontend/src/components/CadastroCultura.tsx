import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface ICultura {
    nome: string;
    variedade: string;
    indiceKc: number;
}

const schema = yup.object({
    nome: yup.string().required('O nome da cultura é obrigatório'),
    variedade: yup.string().required('A variedade é obrigatória'),
    indiceKc: yup.number().typeError('O índice Kc deve ser um número').positive('O índice Kc deve ser maior que zero').required('O índice Kc é obrigatório para o cálculo de evapotranspiração'),
}).required();

function CadastroCultura() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ICultura>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: ICultura) => {
        console.log('Cultura enviada:', data);
        alert(`Cultura ${data.nome} (${data.variedade}) cadastrada com sucesso!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Cultura</Typography>

                <TextField label="Nome da Cultura" {...register("nome")} placeholder="Ex: Café" error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Variedade" {...register("variedade")} placeholder="Ex: Catuaí 144, Bourbon" error={!!errors.variedade} helperText={errors.variedade?.message} />
                <TextField label="Índice Kc Base" type="number" slotProps={{htmlInput:{step: 0.01}}} {...register("indiceKc")} placeholder="Ex: 0.73" error={!!errors.indiceKc} helperText={errors.indiceKc?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Cultura
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroCultura;