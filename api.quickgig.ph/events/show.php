<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$slug = trim($_GET['slug'] ?? '');

if (!$id && !$slug) {
    json(400, ['error' => 'missing id or slug']);
}

if ($id) {
    $stmt = db()->prepare('SELECT * FROM events WHERE id = ?');
    $stmt->execute([$id]);
} else {
    $stmt = db()->prepare('SELECT * FROM events WHERE slug = ?');
    $stmt->execute([$slug]);
}
$event = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$event) {
    json(404, ['error' => 'not found']);
}

$tstmt = db()->prepare('SELECT id, name, price_cents, currency, quantity_total, quantity_sold, (quantity_total - quantity_sold) AS remaining FROM ticket_types WHERE event_id = ?');
$tstmt->execute([$event['id']]);
$tickets = $tstmt->fetchAll(PDO::FETCH_ASSOC);

json(200, ['event' => $event, 'tickets' => $tickets]);
