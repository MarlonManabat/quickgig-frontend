<?php
require_once __DIR__ . '/src/cors.php';
cors();
echo json_encode(['ok' => true, 'ts' => time()]);
