import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { useState, useMemo, createContext } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { graoDarkTheme, graoLightTheme } from './theme/Theme';

import Login from './components/Login';
import CadastroProdutor from './components/CadastroProdutor';
import CadastroFuncionario from './components/CadastroFuncionario';
import CadastroPlantacao from './components/CadastroPlantacao';
import CadastroSetor from './components/CadastroSetor';
import CadastroCultura from './components/CadastroCultura';
import CadastroDispositivo from './components/CadastroDispositivo';
import CadastroSensor from './components/CadastroSensor';
import Home from './components/Home';
import AlterarPerfilProdutor from './components/AlterarPerfilProdutor';
import ListaFuncionarios from './components/ListaFuncionarios'
import AlterarFuncionario from './components/AlterarFuncionario';
import ListaCulturas from './components/ListaCulturas';
import AlterarCultura from './components/AlterarCultura';
import ListaDispositivos from './components/ListaDispositivos';
import AlterarDispositivo from './components/AlterarDispositivo';
import ListaPlantacoes from './components/ListaPlantacoes';
import AlterarPlantacao from './components/AlterarPlantacao';
import ListaSensores from './components/ListaSensores';
import AlterarSensor from './components/AlterarSensor';
import ListaSetores from './components/ListaSetores';
import AlterarSetor from './components/AlterarSetor';
import './App.css';

export const ThemeModeContext = createContext({ toggleTheme: () => { } });

function App() {

  //estado do tema atual
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  //funcao que troca o tema
  const themeMode = useMemo(() => ({
    toggleTheme: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const theme = mode === 'dark' ? graoDarkTheme : graoLightTheme;

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/*rotas publicas -> login e cadastro de produtor */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro-produtor" element={<CadastroProdutor />} />

              {/*rotas privadas*/}
              <Route path="/" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } />

              <Route path="/alterar-perfil" element={
                <PrivateRoute>
                  <AlterarPerfilProdutor />
                </PrivateRoute>
              } />

              <Route path="/lista-funcionarios" element={
                <PrivateRoute><ListaFuncionarios /></PrivateRoute>
              } />

              <Route path="/alterar-funcionario/:id" element={
                <PrivateRoute><AlterarFuncionario /></PrivateRoute>
              } />

              <Route path="/lista-culturas" element={
                <PrivateRoute><ListaCulturas /></PrivateRoute>
              } />

              <Route path="/alterar-cultura/:id" element={
                <PrivateRoute><AlterarCultura /></PrivateRoute>
              } />

              <Route path="/lista-dispositivos" element={
                <PrivateRoute>
                  <ListaDispositivos />
                </PrivateRoute>
              } />

              <Route path="/alterar-dispositivo/:id" element={
                <PrivateRoute>
                  <AlterarDispositivo />
                </PrivateRoute>
              } />

              <Route path="/cadastro-plantacao" element={
                <PrivateRoute>
                  <CadastroPlantacao />
                </PrivateRoute>
              } />
              <Route path="/lista-plantacoes" element={
                <PrivateRoute>
                  <ListaPlantacoes />
                </PrivateRoute>
              } />

              <Route path="/alterar-plantacao/:id" element={
                <PrivateRoute>
                  <AlterarPlantacao />
                </PrivateRoute>
              } />

              <Route path="/cadastro-funcionario" element={
                <PrivateRoute>
                  <CadastroFuncionario />
                </PrivateRoute>
              } />

              <Route path="/cadastro-setor" element={
                <PrivateRoute>
                  <CadastroSetor />
                </PrivateRoute>
              } />

              <Route path="/cadastro-cultura" element={
                <PrivateRoute>
                  <CadastroCultura />
                </PrivateRoute>
              } />

              <Route path="/cadastro-dispositivo" element={
                <PrivateRoute>
                  <CadastroDispositivo />
                </PrivateRoute>
              } />

              <Route path="/cadastro-sensor" element={
                <PrivateRoute>
                  <CadastroSensor />
                </PrivateRoute>
              } />

              <Route path="/lista-sensores" element={
                <PrivateRoute>
                  <ListaSensores />
                </PrivateRoute>
              } />

              <Route path="/alterar-sensor/:id" element=
                {<PrivateRoute>
                  <AlterarSensor />
                </PrivateRoute>
                } />

              <Route path="/lista-setores" element={
                <PrivateRoute>
                  <ListaSetores />
                </PrivateRoute>
              } />

              <Route path="/alterar-setor/:id" element={
                <PrivateRoute>
                  <AlterarSetor />
                </PrivateRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;