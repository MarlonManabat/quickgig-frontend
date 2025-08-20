<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

$order_id = (int)($_GET['order_id'] ?? 0);
if (!$order_id) {
    json(400, ['error' => 'missing order_id']);
}

$stmt = db()->prepare('SELECT status, total_cents FROM orders WHERE id = ?');
$stmt->execute([$order_id]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$order) {
    json(404, ['error' => 'not found']);
}

$response = [
    'status' => $order['status'],
    'total_cents' => (int)$order['total_cents'],
];

if ($order['status'] === 'paid') {
    $astmt = db()->prepare('SELECT a.ticket_code, a.name FROM attendees a JOIN order_items oi ON a.order_item_id = oi.id WHERE oi.order_id = ?');
    $astmt->execute([$order_id]);
    $response['attendees'] = $astmt->fetchAll(PDO::FETCH_ASSOC);
}

json(200, $response);
