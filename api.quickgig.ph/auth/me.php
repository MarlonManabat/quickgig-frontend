<?php
require_once __DIR__.'/../bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json(405, ['error' => 'method not allowed']);
}

$user = current_user();
if (!$user) {
    json(401, ['error' => 'unauthenticated']);
}
json(200, $user);
