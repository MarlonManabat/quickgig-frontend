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
$slug = trim($input['slug'] ?? '');
$title = trim($input['title'] ?? '');
$description = $input['description'] ?? null;
$venue = $input['venue'] ?? null;
$start_time = $input['start_time'] ?? null;
$end_time = $input['end_time'] ?? null;
$cover = $input['cover_image_url'] ?? null;
$status = $input['status'] ?? 'draft';
$tickets = $input['tickets'] ?? [];

if (!$slug || !$title || !$start_time) {
    json(400, ['error' => 'missing fields']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO events (slug, title, description, venue, start_time, end_time, cover_image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$slug, $title, $description, $venue, $start_time, $end_time, $cover, $status]);
    $event_id = (int)$pdo->lastInsertId();

    if (is_array($tickets)) {
        $tStmt = $pdo->prepare('INSERT INTO ticket_types (event_id, name, price_cents, currency, quantity_total) VALUES (?, ?, ?, ?, ?)');
        foreach ($tickets as $t) {
            $name = $t['name'] ?? '';
            $price = (int)($t['price_cents'] ?? 0);
            $qty = (int)($t['quantity_total'] ?? 0);
            $currency = $t['currency'] ?? 'PHP';
            if ($name && $price && $qty) {
                $tStmt->execute([$event_id, $name, $price, $currency, $qty]);
            }
        }
    }

    $pdo->commit();
    json(200, ['id' => $event_id]);
} catch (Throwable $e) {
    $pdo->rollBack();
    json(400, ['error' => $e->getMessage()]);
}
