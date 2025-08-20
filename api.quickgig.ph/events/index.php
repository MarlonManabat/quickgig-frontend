<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

$page = max(1, (int)($_GET['page'] ?? 1));
$per = 10;
$offset = ($page - 1) * $per;
$q = trim($_GET['q'] ?? '');

$sql = 'SELECT id, slug, title, description, venue, start_time, end_time, cover_image_url FROM events WHERE status = "published"';
$params = [];
if ($q !== '') {
    $sql .= ' AND (title LIKE ? OR description LIKE ? OR venue LIKE ?)';
    $like = "%$q%";
    $params = [$like, $like, $like];
}
$sql .= ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
$params[] = $per;
$params[] = $offset;

$stmt = db()->prepare($sql);
$stmt->execute($params);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

json(200, ['events' => $events, 'page' => $page]);
