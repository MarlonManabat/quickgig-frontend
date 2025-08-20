<?php
require_once __DIR__.'/../../bootstrap.php';
allow_origin();

if (($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '') !== ADMIN_TOKEN) {
    json(401, ['error' => 'unauthorized']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$id = (int)($input['id'] ?? 0);
$name = trim($input['name'] ?? '');
$description = $input['description'] ?? '';
if (!$id || !$name) {
    json(400, ['error' => 'missing fields']);
}

$stmt = db()->prepare('UPDATE events SET name = ?, description = ? WHERE id = ?');
$stmt->execute([$name, $description, $id]);
json(200, ['id' => $id]);
