<?php
// Inclusion de la connexion à la BDD
include_once 'config.php';

// Requête SQL pour récupérer uniquement les utilisateurs classiques ('user') dont le statut est encore 'en_attente'
$query = $pdo->query("SELECT id, name, email, statut FROM users WHERE statut = 'en_attente' AND role = 'user'");
$users = $query->fetchAll(PDO::FETCH_ASSOC);

// Renvoie la liste de ces utilisateurs sous forme de tableau JSON à l'Admin Dashboard
echo json_encode($users);
?>
