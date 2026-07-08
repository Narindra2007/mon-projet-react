<?php
// 1. Autorisations CORS indispensables pour React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Connexion à votre base de données MariaDB
$host = "localhost";
$user = "root";
$password = "";
$dbname = "projet_react";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // 3. Requête SQL : On récupère les utilisateurs actifs (déjà validés)
    // IMPORTANT : Ajustez "status" ou "statut" selon le nom exact de votre colonne MariaDB
    $stmt = $pdo->prepare("SELECT id, name, email, role, statut FROM users WHERE statut = :status");
    $stmt->execute(['status' => 'valide']);
    
    $users = $stmt->fetchAll();

    // 4. Envoi de la réponse sous forme de tableau JSON pur à React
    echo json_encode($users);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de base de données : " . $e->getMessage()]);
}
?>