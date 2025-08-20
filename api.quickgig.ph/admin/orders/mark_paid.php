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
$orderId = (int)($input['order_id'] ?? 0);
if (!$orderId) {
    json(400, ['error' => 'missing order_id']);
}

$stmt = db()->prepare('UPDATE orders SET status = "paid" WHERE id = ?');
$stmt->execute([$orderId]);
if (!$stmt->rowCount()) {
    json(404, ['error' => 'not found']);
}
json(200, ['order_id' => $orderId, 'status' => 'paid']);
