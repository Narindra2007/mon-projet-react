<?php
// Inclusion du fichier de configuration et de connexion à la BDD
include_once 'config.php';

// Récupération des données brutes envoyées par la requête `fetch` de React (en JSON)
$data = json_decode(file_get_contents("php://input"));

// On vérifie que tous les champs requis (nom, email, mot de passe) ne sont pas vides
if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    
    // Étape 1 : Vérifier si l'adresse email n'est pas déjà associée à un compte
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$data->email]);
    
    if ($check->rowCount() > 0) {
        // Si l'email existe déjà, on renvoie un message d'erreur à React
        echo json_encode(["status" => "error", "message" => "Cet email est déjà utilisé."]);
        exit(); // Arrêt du script
    }

    // Étape 2 : Sécurisation du mot de passe en le hachant (ne jamais stocker en clair)
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    
    // Étape 3 : Insertion du nouvel utilisateur avec le statut 'en_attente' et le rôle 'user' par défaut
    $query = $pdo->prepare("INSERT INTO users (name, email, password, statut, role) VALUES (?, ?, ?, 'en_attente', 'user')");
    
    if ($query->execute([$data->name, $data->email, $hashed_password])) {
        // En cas de succès, on informe l'utilisateur qu'il doit attendre la validation de l'admin
        echo json_encode(["status" => "success", "message" => "Compte créé ! En attente de validation par l'administrateur."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors de l'inscription."]);
    }
}
?>
