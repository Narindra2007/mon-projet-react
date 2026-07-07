<?php
// Inclusion de la connexion à la BDD
include_once 'config.php';

// Récupération des identifiants saisis dans le formulaire de connexion React
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    // Recherche de l'utilisateur correspondant à l'adresse e-mail saisie
    $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $query->execute([$data->email]);
    $user = $query->fetch(PDO::FETCH_ASSOC); // Récupération des données sous forme de tableau associatif

    // Vérification : L'utilisateur existe-t-il ET le mot de passe correspond-il au hash en BDD ?
    if ($user && password_verify($data->password, $user['password'])) {
        // Si l'identifiant est correct, on retourne les infos essentielles (sans le mot de passe)
        echo json_encode([
            "status" => "success",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "statut" => $user['statut'], // Permettra à React de savoir s'il est validé ou non
                "role" => $user['role']     // Permettra à React de savoir s'il faut aller sur le dashboard Admin
            ]
        ]);
    } else {
        // Si les identifiants sont erronés
        echo json_encode(["status" => "error", "message" => "Identifiants incorrects."]);
    }
}
?>
