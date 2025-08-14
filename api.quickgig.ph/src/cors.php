<?php
function cors() {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed = ['https://quickgig.ph', 'https://www.quickgig.ph', 'https://app.quickgig.ph'];
  if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
  }
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
  }
  header('Content-Type: application/json; charset=utf-8');
}
