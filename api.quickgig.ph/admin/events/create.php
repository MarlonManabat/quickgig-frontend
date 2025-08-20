<?php
require_once __DIR__.'/../../bootstrap.php';
allow_origin();

if (($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '') !== ADMIN_TOKEN) {
    json(401, ['error' => 'unauthorized']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$slug = trim($input['slug'] ?? '');
$name = trim($input['name'] ?? '');
$description = $input['description'] ?? '';
$ticket_types = $input['ticket_types'] ?? [];
if (!$slug || !$name) {
    json(400, ['error' => 'missing fields']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO events (slug, name, description) VALUES (?,?,?)');
    $stmt->execute([$slug, $name, $description]);
    $eventId = (int)$pdo->lastInsertId();

    $stmtT = $pdo->prepare('INSERT INTO ticket_types (event_id, name, price, quantity) VALUES (?,?,?,?)');
    foreach ($ticket_types as $tt) {
        $ttName = trim($tt['name'] ?? '');
        $price = (int)($tt['price'] ?? 0);
        $qty = (int)($tt['quantity'] ?? 0);
        if (!$ttName) continue;
        $stmtT->execute([$eventId, $ttName, $price, $qty]);
    }

    $pdo->commit();
    json(200, ['id' => $eventId]);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(500, ['error' => 'server_error']);
}
