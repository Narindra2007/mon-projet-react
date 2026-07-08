<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db_name = "projet_react";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connexion échouée : " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['name']) && !empty($data['email'])) {
    $name = $data['name'];
    $email = $data['email'];
    $password = !empty($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : password_hash("default123", PASSWORD_BCRYPT);
    $role = !empty($data['role']) ? $data['role'] : 'user';
    $statut = !empty($data['statut']) ? $data['statut'] : 'valide';

    try {
        $check = $pdo->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute(['email' => $email]);
        if ($check->fetch()) {
            echo json_encode(["status" => "error", "message" => "Cet email est déjà utilisé"]);
            exit();
        }

        $query = "INSERT INTO users (name, email, password, role, statut) VALUES (:name, :email, :password, :role, :statut)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':statut', $statut);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Utilisateur ajouté avec succès"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Impossible d'ajouter l'utilisateur"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Données incomplètes"]);
}
?>