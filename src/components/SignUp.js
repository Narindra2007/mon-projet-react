import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Alert, useTheme } from '@mui/material';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fonction de traitement de la création de compte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost/backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setIsSuccess(true);
        setMessage(data.message);
        // Redirection temporisée après 3 secondes
        setTimeout(() => navigate('/'), 3000);
      } else {
        setIsSuccess(false);
        setMessage(data.message);
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Erreur réseau. Impossible de procéder à l'inscription.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: theme.palette.mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.08)' : 3, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          S'inscrire
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField margin="normal" required fullWidth label="Nom et prénom" placeholder="Jon Snow" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="normal" required fullWidth label="E-mail" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Mot de passe" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          {message && (
            <Alert severity={isSuccess ? "success" : "error"} sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

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
            S'inscrire
          </Button>

          <Typography align="center" variant="body2" sx={{ color: 'text.secondary' }}>
            Vous avez déjà un compte ?{' '}
            <Link component="button" type="button" variant="body2" onClick={() => navigate('/')} sx={{ underline: 'none', fontWeight: 'bold' }}>
              Connectez-vous
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
