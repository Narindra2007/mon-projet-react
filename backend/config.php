<?php
// Permet à l'application React (qui tourne sur un autre port/domaine) d'accéder à cette API (Gestion des CORS)
header("Access-Control-Allow-Origin: *");
// Autorise l'envoi de headers spécifiques comme le Content-Type ou l'Authorization
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Définit les méthodes HTTP autorisées pour les requêtes
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Indique que la réponse retournée par le serveur sera toujours au format JSON encodé en UTF-8
header("Content-Type: application/json; charset=UTF-8");

// Gestion de la requête de pré-vérification (Preflight) des navigateurs pour les CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // On stoppe immédiatement l'exécution si c'est une requête OPTIONS
}

// Configuration des identifiants de la base de données locale (phpMyAdmin)
$host = "localhost";
$user = "root";
$password = "";
$dbname = "projet_react";

try {
    // Création d'une instance PDO pour se connecter à la base de données MySQL
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    // Configuration de PDO pour lever des exceptions en cas d'erreur SQL
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Si la connexion échoue, on renvoie une erreur au format JSON et on arrête le script
    echo json_encode(["error" => "Connexion échouée : " . $e->getMessage()]);
    exit();
}
?>
