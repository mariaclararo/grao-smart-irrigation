import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface ISensor {
    tipo: string;
    unidadeMedida: string;
    macDispositivo: string;
}

const schema = yup.object({
    tipo: yup.string().required('A seleção do tipo de sensor é obrigatória'),
    unidadeMedida: yup.string().required('A unidade de medida é obrigatória'),
    macDispositivo: yup.string().required('O MAC Address do dispositivo associado é obrigatório')
        .test('valida-mac-sensor', 'Formato de MAC inválido', (value) => {
            if (!value) return false;
            const padrao = value.replace(/[:.-]/g, "").trim();
            return /^[0-9a-fA-F]{12}$/.test(padrao);
        }),
}).required();

function CadastroSensor() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ISensor>({
        resolver: yupResolver(schema),
        defaultValues: { tipo: '', unidadeMedida: '' }
    });

    const tipoSelecionado = watch("tipo");

    const onSubmit = (data: ISensor) => {
        console.log('Sensor enviado:', data);
        alert(`Sensor do tipo ${data.tipo} cadastrado e vinculado ao MAC ${data.macDispositivo}!`);
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h2">🌱 Cadastro de Sensor Transmissor</Typography>

                <TextField label="MAC do Dispositivo Associado" {...register("macDispositivo")} placeholder="Ex: 00:1B:44:11:3A:B7" error={!!errors.macDispositivo} helperText={errors.macDispositivo?.message} />

                <FormControl error={!!errors.tipo}>
                    <InputLabel id="select-tipo-label">Tipo do Sensor</InputLabel>
                    <Select labelId="select-tipo-label" defaultValue="" {...register("tipo")}>
                        <option value="" disabled style={{ color: '#555' }}></option>
                        <MenuItem value="Umidade">Umidade</MenuItem>
                        <MenuItem value="Fluxo">Fluxo</MenuItem>
                    </Select>
                    {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
                </FormControl>

                <FormControl error={!!errors.unidadeMedida}>
                    <InputLabel id="select-unidade-label">Unidade de Medida</InputLabel>
                    <Select labelId="select-unidade-label" defaultValue="" {...register("unidadeMedida")}>
                        <option value="" disabled style={{ color: '#555' }}></option>
                        {tipoSelecionado === 'Umidade' && (
                            <MenuItem value="%">Porcentagem (%)</MenuItem>
                        )}
                        {tipoSelecionado === 'Fluxo' && [
                            <MenuItem key="GPH" value="GPH">Galões por Hora (GPH)</MenuItem>,
                            <MenuItem key="Lh" value="L/h">Litros por Hora (L/h)</MenuItem>
                        ]}
                        {!tipoSelecionado && (
                            <MenuItem value="" disabled>Escolha o tipo primeiro</MenuItem>
                        )}
                    </Select>
                    {errors.unidadeMedida && <FormHelperText>{errors.unidadeMedida.message}</FormHelperText>}
                </FormControl>

                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                    Cadastrar Sensor
                </Button>
            </Box>
        </Container>
    );
}

export default CadastroSensor;