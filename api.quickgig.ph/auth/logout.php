<?php
require_once __DIR__.'/../api/bootstrap.php';
allow_origin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(405, ['error' => 'method not allowed']);
}

clear_auth_cookie();
json(200, ['ok' => true]);
