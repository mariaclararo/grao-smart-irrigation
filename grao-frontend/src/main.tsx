import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline} from '@mui/material';
import './index.css'
import App from './App.tsx'

//lembrar de colocar o theme provider aqui
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CssBaseline />
       <App />
  </StrictMode>,
)
