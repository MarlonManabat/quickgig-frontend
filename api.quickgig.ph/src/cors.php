<?php
function cors() {
  header('Access-Control-Allow-Origin: https://quickgig.ph');
  header('Vary: Origin');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
  header('Content-Type: application/json; charset=utf-8');
}
