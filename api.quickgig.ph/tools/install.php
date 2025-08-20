<?php
require_once __DIR__.'/../api/bootstrap.php';

$token = $_GET['token'] ?? '';
if ($token !== (getenv('INSTALL_TOKEN') ?: '')) {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

$sql = file_get_contents(__DIR__.'/../migrations/001_create_users.sql');
try {
    db()->exec($sql);
    echo "ok";
} catch (Throwable $e) {
    http_response_code(500);
    echo 'error';
}
