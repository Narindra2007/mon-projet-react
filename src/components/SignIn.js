import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Divider, Link, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  // Fonction de gestion de la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        // Enregistrement de la session utilisateur dans le stockage local
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirection vers le tableau de bord correspondant au rôle
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Impossible de joindre le serveur backend.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: theme.palette.mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.08)' : 3, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          Se connecter
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField margin="normal" required fullWidth label="E-mail" placeholder="votre@email.com" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Mot de passe" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={!!error} helperText={error} />
          
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              mt: 3, mb: 2, py: 1.5,
              bgcolor: theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e3a8a', 
              color: theme.palette.mode === 'dark' ? '#071224' : '#ffffff',
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#cbd5e1' : '#172554' }
            }}
          >
            Se connecter
          </Button>
          
          <Divider sx={{ my: 2 }}>ou</Divider>

          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ mb: 1, borderColor: theme.palette.mode === 'light' ? '#cbd5e1' : '#1a2e4c', color: 'text.primary' }}>
            Se connecter avec Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<FacebookIcon />} sx={{ mb: 2, borderColor: theme.palette.mode === 'light' ? '#cbd5e1' : '#1a2e4c', color: 'text.primary' }}>
            Se connecter avec Facebook
          </Button>

          <Typography align="center" variant="body2" sx={{ color: 'text.secondary' }}>
            Vous n'avez pas de compte ?{' '}
            <Link component="button" type="button" variant="body2" onClick={() => navigate('/signup')} sx={{ underline: 'none', fontWeight: 'bold' }}>
              Inscrivez-vous
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
