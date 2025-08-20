<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

$orderId = (int)($_GET['order_id'] ?? 0);
if (!$orderId) {
    json(400, ['error' => 'missing order_id']);
}

$stmt = db()->prepare('SELECT id, status, total FROM orders WHERE id = ?');
$stmt->execute([$orderId]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$order) {
    json(404, ['error' => 'not found']);
}
json(200, $order);
