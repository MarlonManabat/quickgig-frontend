<?php
require_once __DIR__.'/../../api/bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    json(405, ['error' => 'method not allowed']);
}

$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if ($token !== (ADMIN_TOKEN ?: '')) {
    json(401, ['error' => 'unauthorized']);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$id = (int)($input['id'] ?? 0);
if (!$id) {
    json(400, ['error' => 'missing id']);
}

$fields = ['slug','title','description','venue','start_time','end_time','cover_image_url','status'];
$updates = [];
$params = [];
foreach ($fields as $f) {
    if (isset($input[$f])) {
        $updates[] = "$f = ?";
        $params[] = $input[$f];
    }
}

$pdo = db();
$pdo->beginTransaction();
try {
    if ($updates) {
        $stmt = $pdo->prepare('UPDATE events SET '.implode(', ', $updates).' WHERE id = ?');
        $params[] = $id;
        $stmt->execute($params);
    }

    if (isset($input['tickets']) && is_array($input['tickets'])) {
        foreach ($input['tickets'] as $t) {
            $tid = (int)($t['id'] ?? 0);
            $name = $t['name'] ?? '';
            $price = (int)($t['price_cents'] ?? 0);
            $qty = (int)($t['quantity_total'] ?? 0);
            $currency = $t['currency'] ?? 'PHP';
            if ($tid) {
                $stmt = $pdo->prepare('UPDATE ticket_types SET name=?, price_cents=?, currency=?, quantity_total=? WHERE id=? AND event_id=?');
                $stmt->execute([$name, $price, $currency, $qty, $tid, $id]);
            } else {
                if ($name && $price && $qty) {
                    $stmt = $pdo->prepare('INSERT INTO ticket_types (event_id, name, price_cents, currency, quantity_total) VALUES (?, ?, ?, ?, ?)');
                    $stmt->execute([$id, $name, $price, $currency, $qty]);
                }
            }
        }
    }

    $pdo->commit();
    json(200, ['ok' => true]);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(400, ['error' => $e->getMessage()]);
}
