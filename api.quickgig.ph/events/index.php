<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

$stmt = db()->query('SELECT id, slug, name, description FROM events ORDER BY id DESC');
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (!$events) {
    http_response_code(204);
    exit;
}
json(200, $events);
