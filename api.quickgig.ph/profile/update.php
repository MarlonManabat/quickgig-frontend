<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    json(405, ['error' => 'method not allowed']);
}

$user = current_user();
if (!$user) {
    json(401, ['error' => 'unauthenticated']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$name = isset($input['name']) ? trim($input['name']) : $user['name'];
$phone = isset($input['phone']) ? trim($input['phone']) : $user['phone'];

$stmt = db()->prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?');
$stmt->execute([$name ?: null, $phone ?: null, $user['id']]);

$user['name'] = $name;
$user['phone'] = $phone;
json(200, ['ok' => true, 'user' => $user]);
