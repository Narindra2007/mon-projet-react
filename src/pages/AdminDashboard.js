import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [successAlert, setSuccessAlert] = useState('');
  const navigate = useNavigate();

  // Chargement asynchrone des comptes en attente d'approbation
  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost/backend/get_pending_users.php');
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données.");
    }
  };

  // Sécurisation de l'accès à la page d'administration
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser || loggedUser.role !== 'admin') {
      navigate('/');
    } else {
      fetchPendingUsers();
    }
  }, [navigate]);

  // Traitement et validation nominative d'une demande d'inscription
  const handleApprove = async (id, userName) => {
    setSuccessAlert('');
    try {
      const res = await fetch('http://localhost/backend/approve_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Erreur de communication avec l'API");

      const data = await res.json();
      if (data.status === 'success') {
        // Enregistrement de la notification nominative de succès
        setSuccessAlert(`L'utilisateur "${userName}" a été validé avec succès !`);
        fetchPendingUsers();
      }
    } catch (error) {
      alert("Erreur système lors du traitement de la validation.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: '0px 4px 25px rgba(0,0,0,0.05)' }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }} align="center">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }} align="center">
          Demandes d'inscription en attente
        </Typography>

        {successAlert && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessAlert('')}>
            {successAlert}
          </Alert>
        )}

        {pendingUsers.length === 0 ? (
          <Typography align="center" sx={{ my: 4, color: 'text.secondary', fontStyle: 'italic' }}>
            Aucune demande en attente actuellement.
          </Typography>
        ) : (
          <List component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', p: 1, mb: 3, borderRadius: 2 }}>
            {pendingUsers.map((u) => (
              <ListItem
                key={u.id}
                secondaryAction={
                  <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleApprove(u.id, u.name)}>
                    Valider
                  </Button>
                }
                sx={{ borderBottom: '1px solid #e2e8f0', '&:last-child': { borderBottom: 'none' }, py: 2 }}
              >
                <ListItemText primary={u.name} secondary={u.email} primaryTypographyProps={{ fontWeight: 'bold' }} />
              </ListItem>
            ))}
          </List>
        )}

        <Button 
          onClick={() => { localStorage.removeItem('user'); navigate('/'); }} 
          variant="contained" 
          startIcon={<LogoutIcon />}
          sx={{ 
            fontWeight: 'bold', mt: 2, 
            bgcolor: '#1e3a8a', color: '#ffffff',
            '&:hover': { bgcolor: '#172554' } 
          }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Container>
  );
}
