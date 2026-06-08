import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface ILogin {
    email: string;
    senha: string;
}

const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().min(5, 'Senha deve ter no mínimo 5 caracteres').required('Senha é obrigatória'),
}).required();

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ILogin>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: ILogin) => {
        console.log('Login enviado:', data);
        alert(`Autenticando usuário: ${data.email}`);
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx = {{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h2"> 🌱 G.R.A.O. Login</Typography>
                <TextField
                    label="Email"
                    placeholder='Ex: fulano@dominio.com'
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label="Senha"
                    type="password"
                    {...register("senha")}
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                />
                
                <Button type="submit" variant="contained" fullWidth>
                    Enviar
                </Button>
            </Box>
        </Container>
    );
}

export default Login;