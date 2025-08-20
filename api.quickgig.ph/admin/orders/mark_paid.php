<?php
require_once __DIR__.'/../../api/bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if ($token !== (ADMIN_TOKEN ?: '')) {
    json(401, ['error' => 'unauthorized']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$order_id = (int)($input['order_id'] ?? 0);
if (!$order_id) {
    json(400, ['error' => 'missing order_id']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE orders SET status = "paid" WHERE id = ?');
    $stmt->execute([$order_id]);

    $itemsStmt = $pdo->prepare('SELECT id, ticket_type_id, quantity, price_cents FROM order_items WHERE order_id = ?');
    $itemsStmt->execute([$order_id]);
    $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

    $attendees = [];
    foreach ($items as $item) {
        $pdo->prepare('UPDATE ticket_types SET quantity_sold = quantity_sold + ? WHERE id = ?')
            ->execute([(int)$item['quantity'], (int)$item['ticket_type_id']]);
        for ($i = 0; $i < (int)$item['quantity']; $i++) {
            $code = bin2hex(random_bytes(5)); // 10 hex chars
            $aStmt = $pdo->prepare('INSERT INTO attendees (order_item_id, ticket_code) VALUES (?, ?)');
            $aStmt->execute([(int)$item['id'], $code]);
            $attendees[] = ['ticket_code' => $code];
        }
    }

    $pdo->commit();
    json(200, ['ok' => true, 'attendees' => $attendees]);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(400, ['error' => $e->getMessage()]);
}
