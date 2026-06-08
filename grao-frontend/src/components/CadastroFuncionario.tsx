import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

interface IFuncionario {
    nome: string;
    email: string;
    senha: string;
    especialidade: string;
    cnpjEmpregador: string;
}

const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().min(5, 'Senha deve ter no mínimo 5 caracteres').required('Senha é obrigatória'),
    especialidade: yup.string().required('A especialidade é obrigatória'),
    cnpjEmpregador: yup.string().required('CNPJ do empregador é obrigatório').matches(/^[a-zA-Z0-9]{14}$/, 'CNPJ deve conter 14 caracteres (apenas os números ou letras)'),
}).required();

function CadastroFuncionario() {
    const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<IFuncionario>({
            resolver: yupResolver(schema),
        });

    const onSubmit = (data: IFuncionario) => {
        console.log('Funcionario enviado:', data);
        alert(`Funcionário ${data.nome} cadastrado!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Funcionário</Typography>

                <TextField label="Nome Completo" placeholder="Ex: Ciclano de Sousa" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Especialidade / Cargo"{...register("especialidade")} placeholder="Ex: Técnico de Campo, Agrônomo" error={!!errors.especialidade} helperText={errors.especialidade?.message} />
                <TextField label="CNPJ do Empregador" placeholder="Ex: AB123CDE456700" {...register("cnpjEmpregador")} error={!!errors.cnpjEmpregador} helperText={errors.cnpjEmpregador?.message} />
                <TextField label="Email" placeholder="Ex: func@dominio.com" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                <TextField label="Senha" type="password" {...register("senha")} error={!!errors.senha} helperText={errors.senha?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Funcionário
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroFuncionario;