import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Gestion de l'état du mode d'affichage : 'light' ou 'dark'
  const [mode, setMode] = useState('light'); 

  // Définition de l'objet de configuration du thème adaptatif
  const customTheme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // Configuration des couleurs pour le mode sombre (Original)
            background: {
              default: '#030a16',
              paper: '#071224',
            },
            primary: {
              main: '#ffffff',
            },
            secondary: {
              main: '#3182ce',
            },
            text: {
              primary: '#ffffff',
              secondary: '#a0aec0',
            },
          }
        : {
            // Configuration des couleurs pour le mode clair (Actuel)
            background: {
              default: '#f4f6f9',
              paper: '#ffffff',
            },
            primary: {
              main: '#1e3a8a', // Bleu professionnel appliqué globalement
            },
            secondary: {
              main: '#1976d2',
            },
            text: {
              primary: '#0f172a',
              secondary: '#475569',
            },
          }),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 'bold',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

