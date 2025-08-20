<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

$slug = $_GET['slug'] ?? '';
if (!$slug) {
    json(400, ['error' => 'missing slug']);
}

$stmt = db()->prepare('SELECT id, slug, name, description FROM events WHERE slug = ?');
$stmt->execute([$slug]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$event) {
    json(404, ['error' => 'not found']);
}

$stmt = db()->prepare('SELECT id, name, price, quantity FROM ticket_types WHERE event_id = ?');
$stmt->execute([$event['id']]);
$event['ticket_types'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
json(200, $event);
