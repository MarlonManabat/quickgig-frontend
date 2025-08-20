<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
if (!$email || !$password) {
    json(400, ['error' => 'missing fields']);
}

$stmt = db()->prepare('SELECT id, password_hash, name FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || !password_verify($password, $user['password_hash'])) {
    json(401, ['error' => 'invalid_credentials']);
}
$token = jwt_issue(['uid' => $user['id']]);
set_auth_cookie($token);
json(200, ['id' => (int)$user['id'], 'email' => $email, 'name' => $user['name']]);
