import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface IDispositivo {
    setorDeOperacao: string;
    nivelBateria: number;
    macAddress: string;
}

const schema = yup.object({
    setorDeOperacao: yup.string().required('O setor de operação é obrigatório'),
    nivelBateria: yup.number().typeError('O nível de bateria deve ser um número').min(0, 'O nível mínimo é 0%').max(100, 'O nível máximo é 100%').required('O nível de bateria é obrigatório'),
    macAddress: yup.string().required('O MAC Address é obrigatório')
        .test('valida-mac', 'Formato de MAC inválido.', (value) => {
            if (!value) return false;
            const padrao = value.replace(/[:.-]/g, "").trim();
            return /^[0-9a-fA-F]{12}$/.test(padrao);
        }),
}).required();

function CadastroDispositivo() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IDispositivo>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: IDispositivo) => {
        console.log('Dispositivo Enviado:', data);
        alert(`Dispositivo MAC ${data.macAddress} cadastrado!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Dispositivo</Typography>

                <TextField label="Setor de Operação" {...register("setorDeOperacao")} placeholder="Ex: Talhão Sul" error={!!errors.setorDeOperacao} helperText={errors.setorDeOperacao?.message} />
                <TextField label="Endereço MAC" {...register("macAddress")} placeholder="Ex: 00:1B:44:11:3A:B7" error={!!errors.macAddress} helperText={errors.macAddress?.message} />
                <TextField label="Nível Inicial da Bateria (%)" type="number" {...register("nivelBateria")} placeholder="Ex: 100" error={!!errors.nivelBateria} helperText={errors.nivelBateria?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Dispositivo
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroDispositivo;