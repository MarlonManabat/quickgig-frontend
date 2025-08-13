<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://quickgig.ph','https://www.quickgig.ph'];
if (in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');
echo json_encode(['message' => 'QuickGig API']);
