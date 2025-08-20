<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$name = trim($input['name'] ?? '');

if (!$email || !$password) {
    json(400, ['error' => 'missing fields']);
}

$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = db()->prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');
    $stmt->execute([$email, $hash, $name ?: null]);
    $id = db()->lastInsertId();
    $token = jwt_issue(['uid' => $id]);
    set_auth_cookie($token);
    json(200, ['id' => (int)$id, 'email' => $email, 'name' => $name]);
} catch (PDOException $e) {
    json(400, ['error' => 'email_exists']);
}
