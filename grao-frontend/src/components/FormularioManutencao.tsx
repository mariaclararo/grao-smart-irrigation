import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface IManutencao {
    tipo: string;
    macAddress: string; 
    observacoes: string;
}

const schema = yup.object({
    tipo: yup.string().required('O tipo de manutenção é obrigatório'),
        macAddress: yup.string().ensure() 
        .test('mac-opcional-validacao', 'Formato de MAC inválido.', (value) => {
            //se está vazio n precisa validar nada
            if (!value || value.trim() === '') return true;
            //se colocou mac tem que estar escrito certo
            const padrao = value.replace(/[:.-]/g, "").trim();
            return /^[0-9a-fA-F]{12}$/.test(padrao);
        }),
    observacoes: yup.string().required('O relatório técnico é obrigatório')
}).required();

function FormManutencao() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IManutencao>({
        resolver: yupResolver(schema),
        defaultValues: { tipo: '', macAddress: '', observacoes: '' }
    });

    const onSubmit = (data: IManutencao) => {
        const macLimpo = data.macAddress && data.macAddress.trim() !== '' 
            ? data.macAddress.replace(/[:.-]/g, "").trim().toUpperCase()
            : 'Não associado';

        const registroLog = {
            tipo: data.tipo,
            macAddress: macLimpo,
            observacoes: data.observacoes,
            dataRegistro: new Date().toLocaleDateString()
        };

        console.log('Registro de Manutenção enviado:', registroLog);
        alert(`Manutenção de "${data.tipo}" registrada!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Registro de Manutenção</Typography>

                <FormControl error={!!errors.tipo}>
                    <InputLabel id="select-manutencao-tipo">Tipo de Manutenção</InputLabel>
                    <Select labelId="select-manutencao-tipo" defaultValue="" {...register("tipo")}>
                        <option value="" disabled style={{ color: '#555' }}></option>
                        <MenuItem value="Troca de Bateria">Troca de Bateria</MenuItem>
                        <MenuItem value="Reparo de Tubo/Vazamento">Reparo de Tubo / Vazamento</MenuItem>
                        <MenuItem value="Calibração de Sensor">Calibração de Sensor</MenuItem>
                        <MenuItem value="Troca de Dipositivo">Troca de Dispositivo</MenuItem>
                        <MenuItem value="Outras">Outras...</MenuItem>
                    </Select>
                    {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
                </FormControl>

                <TextField label="MAC do Dispositivo (Se houver)" {...register("macAddress")} placeholder="Ex: 00:1B:44:11:3A:B7" error={!!errors.macAddress} helperText={errors.macAddress?.message} />
                
                <TextField label="Relatório Técnico" multiline rows={4} {...register("observacoes")} placeholder="Descreva detalhadamente o que foi feito na manutenção" error={!!errors.observacoes} helperText={errors.observacoes?.message} />

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Registrar Manutenção
                </Button>
            </Box>
        </Container>
    );
}

export default FormManutencao;