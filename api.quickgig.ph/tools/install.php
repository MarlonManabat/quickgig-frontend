<?php
require_once __DIR__.'/../bootstrap.php';

$token = $_GET['token'] ?? '';
if ($token !== (getenv('INSTALL_TOKEN') ?: '')) {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

$pdo = db();
$pdo->exec("CREATE TABLE IF NOT EXISTS migrations (id INT AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(190) UNIQUE, run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
$files = glob(__DIR__.'/../migrations/*.sql');
sort($files);
foreach ($files as $file) {
    $name = basename($file);
    $stmt = $pdo->prepare('SELECT 1 FROM migrations WHERE filename = ?');
    $stmt->execute([$name]);
    if ($stmt->fetch()) continue;
    $sql = file_get_contents($file);
    $pdo->exec($sql);
    $stmt = $pdo->prepare('INSERT INTO migrations (filename) VALUES (?)');
    $stmt->execute([$name]);
}

echo 'ok';
