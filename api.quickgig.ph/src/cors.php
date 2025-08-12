<?php
function cors() {
  header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}
