<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim($input['email'] ?? '');
$items = $input['items'] ?? [];
if (!$email || !is_array($items) || !$items) {
    json(400, ['error' => 'invalid input']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $pdo->prepare('INSERT INTO orders (email, total) VALUES (?, 0)')->execute([$email]);
    $orderId = (int)$pdo->lastInsertId();

    $total = 0;
    $stmtTicket = $pdo->prepare('SELECT id, price FROM ticket_types WHERE id = ?');
    $stmtItem = $pdo->prepare('INSERT INTO order_items (order_id, ticket_type_id, quantity, price) VALUES (?,?,?,?)');

    foreach ($items as $it) {
        $tid = (int)($it['ticket_type_id'] ?? 0);
        $qty = (int)($it['quantity'] ?? 0);
        if ($tid <= 0 || $qty <= 0) continue;
        $stmtTicket->execute([$tid]);
        $ticket = $stmtTicket->fetch(PDO::FETCH_ASSOC);
        if (!$ticket) continue;
        $price = (int)$ticket['price'];
        $total += $price * $qty;
        $stmtItem->execute([$orderId, $tid, $qty, $price]);
    }

    $pdo->prepare('UPDATE orders SET total = ? WHERE id = ?')->execute([$total, $orderId]);
    $pdo->commit();
    json(200, ['order_id' => $orderId, 'status' => 'pending']);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(500, ['error' => 'server_error']);
}
