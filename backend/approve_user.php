<?php
// Permettre à React (port 3000) de communiquer avec ce script
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Répondre immédiatement aux requêtes de pré-vérification (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Inclure la connexion à la base de données
include_once 'config.php';

// Le reste de votre code existant...
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = $pdo->prepare("UPDATE users SET statut = 'valide' WHERE id = ?");
    if ($query->execute([$data->id])) {
        echo json_encode(["status" => "success", "message" => "Utilisateur validé avec succès."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Impossible de valider."]);
    }
}
?>
