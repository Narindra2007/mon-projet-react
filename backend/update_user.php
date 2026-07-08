<?php
// Configuration des en-têtes pour autoriser l'accès depuis le front-end React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Connexion à la base de données (À adapter avec vos identifiants)
$host = "localhost";
$db_name = "projet_react";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["statut" => "error", "message" => "Connexion échouée : " . $e->getMessage()]);
    exit();
}

// Récupération des données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"), true);

// Vérification que les champs obligatoires sont présents
if (!empty($data['id']) && !empty($data['name']) && !empty($data['email']) && !empty($data['role'])) {
    
    $id = $data['id'];
    $name = $data['name'];
    $email = $data['email'];
    $role = $data['role'];

    try {
        // Syntaxe SQL UPDATE avec requêtes préparées pour éviter les injections SQL
        $query = "UPDATE users SET name = :name, email = :email, role = :role WHERE id = :id";
        $stmt = $pdo->prepare($query);
        
        // Liaison des paramètres
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Utilisateur modifié avec succès"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Impossible de modifier l'utilisateur"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Données incomplètes"]);
}
?>