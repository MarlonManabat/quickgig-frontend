<?php
require_once __DIR__.'/../api/bootstrap.php';

$token = $_GET['token'] ?? '';
if ($token !== (getenv('INSTALL_TOKEN') ?: '')) {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

$migrations = [
    '001_create_users.sql',
    '010_events.sql',
];

try {
    foreach ($migrations as $file) {
        $sql = file_get_contents(__DIR__.'/../migrations/' . $file);
        db()->exec($sql);
    }
    echo "ok";
} catch (Throwable $e) {
    http_response_code(500);
    echo 'error';
}
