<?php
// --- Load .env into getenv()/$_ENV ---
$envPath = __DIR__ . '/.env';
if (is_readable($envPath)) {
  foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (str_starts_with($line, '#')) continue;
    $parts = explode('=', $line, 2);
    if (count($parts) === 2) {
      [$k, $v] = $parts;
      $k = trim($k);
      $v = trim($v, " \t\n\r\0\x0B\"'");
      putenv("$k=$v");
      $_ENV[$k] = $v;
    }
  }
}

// --- CORS ---
$origin = getenv('CORS_ORIGIN') ?: 'https://quickgig.ph';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// --- Router ---
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/' || $path === '') {
  header('Content-Type: application/json');
  echo json_encode(['name' => 'QuickGig PHP API', 'status' => 'ok']);
  exit;
}

if ($path === '/health') {
  header('Content-Type: application/json');
  $conn = @mysqli_connect(getenv('DB_HOST'), getenv('DB_USER'), getenv('DB_PASS'), getenv('DB_NAME'));
  if (!$conn) {
    http_response_code(500);
    echo json_encode(['status'=>'error','db'=>'down','message'=>mysqli_connect_error()]);
    exit;
  }
  mysqli_close($conn);
  echo json_encode(['status'=>'ok','db'=>'up']);
  exit;
}

// 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error'=>'not_found','path'=>$path]);
