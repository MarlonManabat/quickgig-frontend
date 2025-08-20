<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$event_id = (int)($input['event_id'] ?? 0);
$items = $input['items'] ?? [];
$buyer = $input['buyer'] ?? [];
$buyer_email = trim($buyer['email'] ?? '');
$buyer_name = trim($buyer['name'] ?? '');

if (!$event_id || !$buyer_email || !is_array($items) || !$items) {
    json(400, ['error' => 'invalid input']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $total = 0;
    $validatedItems = [];
    foreach ($items as $it) {
        $ttid = (int)($it['ticket_type_id'] ?? 0);
        $qty = (int)($it['quantity'] ?? 0);
        if ($ttid <= 0 || $qty <= 0) {
            throw new Exception('invalid item');
        }
        $stmt = $pdo->prepare('SELECT event_id, price_cents, quantity_total, quantity_sold FROM ticket_types WHERE id = ? FOR UPDATE');
        $stmt->execute([$ttid]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || (int)$row['event_id'] !== $event_id) {
            throw new Exception('invalid ticket');
        }
        $remaining = (int)$row['quantity_total'] - (int)$row['quantity_sold'];
        if ($qty > $remaining) {
            throw new Exception('insufficient_stock');
        }
        $total += (int)$row['price_cents'] * $qty;
        $validatedItems[] = [$ttid, $qty, (int)$row['price_cents']];
    }

    $stmt = $pdo->prepare('INSERT INTO orders (event_id, buyer_email, buyer_name, total_cents) VALUES (?, ?, ?, ?)');
    $stmt->execute([$event_id, $buyer_email, $buyer_name ?: null, $total]);
    $order_id = (int)$pdo->lastInsertId();

    $iStmt = $pdo->prepare('INSERT INTO order_items (order_id, ticket_type_id, quantity, price_cents) VALUES (?, ?, ?, ?)');
    foreach ($validatedItems as $vi) {
        [$ttid, $qty, $price] = $vi;
        $iStmt->execute([$order_id, $ttid, $qty, $price]);
    }

    $pdo->commit();
    json(200, [
        'order_id' => $order_id,
        'total_cents' => $total,
        'currency' => 'PHP',
        'payment_instructions' => [
            'method' => 'gcash',
            'order_id' => $order_id,
        ],
    ]);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(400, ['error' => $e->getMessage()]);
}
