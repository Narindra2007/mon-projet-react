import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert, AlertTitle, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Contrôle d'accès à la session lors du montage du composant
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser) {
      navigate('/');
    } else {
      setUser(loggedUser);
    }
  }, [navigate]);

  // Nettoyage du localStorage et déconnexion de l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: theme.palette.mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.08)' : 3, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          Bienvenue, {user.name}
        </Typography>
        
        {/* Affichage conditionnel de l'état de validation du compte utilisateur */}
        {user.statut === 'en_attente' ? (
          <Alert severity="warning" sx={{ textAlign: 'left', mb: 4, borderRadius: 2 }}>
            <AlertTitle style={{ fontWeight: 'bold' }}>Accès restreint</AlertTitle>
            Votre compte est en attente de vérification. Un administrateur doit valider votre accès.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ textAlign: 'left', mb: 4, borderRadius: 2 }}>
            <AlertTitle style={{ fontWeight: 'bold' }}>Compte validé</AlertTitle>
            Félicitations, votre accès a été entièrement approuvé par l'administrateur.
          </Alert>
        )}

        <Button 
          onClick={handleLogout} 
          variant="contained" 
          startIcon={<LogoutIcon />}
          sx={{ 
            py: 1.2,
            fontWeight: 'bold', 
            bgcolor: '#1e3a8a', 
            color: '#ffffff',
            '&:hover': { bgcolor: '#172554' } 
          }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Container>
  );
}
