<?php
$envPath = __DIR__ . '/.env';
if (is_readable($envPath)) {
  foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (str_starts_with($line, '#')) continue;
    $parts = explode('=', $line, 2);
    if (count($parts) === 2) {
      [$k, $v] = $parts;
      $k = trim($k); $v = trim($v, " \t\n\r\0\x0B\"'");
      putenv("$k=$v"); $_ENV[$k] = $v;
    }
  }
}
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/env.php';
require_once __DIR__ . '/src/db.php';
require_once __DIR__ . '/src/jwt.php';
require_once __DIR__ . '/src/cors.php';
require_once __DIR__ . '/src/response.php';

cors(); // handle CORS early

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$db = db();

function authUser($db) {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/Bearer\s+(.+)/', $hdr, $m)) {
    $payload = jwt_verify($m[1]);
    if ($payload && isset($payload['uid'])) {
      $stmt = $db->prepare('SELECT id,name,email FROM users WHERE id = ?');
      $stmt->execute([$payload['uid']]);
      return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
  }
  return null;
}

try {
  if ($method==='GET' && $path==='/status') {
    require __DIR__ . '/health.php';
    return;
  }
  // Auth routes
  if ($method==='POST' && $path==='/auth/register') {
    $name = trim($body['name'] ?? '');
    $email = strtolower(trim($body['email'] ?? ''));
    $pass = $body['password'] ?? '';
    if (!$name || !$email || !$pass) return json_bad('Missing fields', 422);
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    $stmt = $db->prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)');
    $stmt->execute([$name,$email,$hash]);
    return json_ok(['id'=>$db->lastInsertId()], 201);
  }

  if ($method==='POST' && $path==='/auth/login') {
    $email = strtolower(trim($body['email'] ?? ''));
    $pass = $body['password'] ?? '';
    $stmt = $db->prepare('SELECT id,password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u || !password_verify($pass, $u['password_hash'])) return json_bad('Invalid credentials', 401);
    $token = jwt_sign(['uid' => (int)$u['id'], 'iat'=>time(), 'exp'=>time()+60*60*24*7]); // 7d
    setcookie('qg_session', $token, [
      'expires' => time() + 60*60*24*30,
      'path' => '/',
      'domain' => '.quickgig.ph',
      'secure' => true,
      'httponly' => true,
      'samesite' => 'None',
    ]);
    return json_ok(['token'=>$token]);
  }

  if ($method==='GET' && $path==='/auth/me') {
    $u = authUser($db);
    if (!$u) return json_bad('Unauthorized', 401);
    return json_ok($u);
  }

  // Events
  if ($method==='GET' && $path==='/events') {
    $stmt = $db->query('SELECT id,title,description,event_date,created_at FROM events ORDER BY event_date DESC');
    return json_ok($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  if ($method==='POST' && $path==='/events') {
    $u = authUser($db);
    if (!$u) return json_bad('Unauthorized', 401);
    $title = trim($body['title'] ?? '');
    $desc = $body['description'] ?? '';
    $date = $body['event_date'] ?? null; // ISO string
    if (!$title || !$date) return json_bad('Missing fields', 422);
    $stmt = $db->prepare('INSERT INTO events (title,description,event_date,created_by) VALUES (?,?,?,?)');
    $stmt->execute([$title,$desc,$date,$u['id']]);
    return json_ok(['id'=>$db->lastInsertId()], 201);
  }

  // Tickets
  if ($method==='GET' && $path==='/tickets') {
    $eventId = (int)($_GET['eventId'] ?? 0);
    if (!$eventId) return json_bad('eventId required', 422);
    $stmt = $db->prepare('SELECT id,event_id,holder_name,status,created_at FROM tickets WHERE event_id = ? ORDER BY id DESC');
    $stmt->execute([$eventId]);
    return json_ok($stmt->fetchAll(PDO::FETCH_ASSOC));
  }

  if ($method==='POST' && $path==='/tickets') {
    $u = authUser($db);
    if (!$u) return json_bad('Unauthorized', 401);
    $eventId = (int)($body['event_id'] ?? 0);
    $holder = trim($body['holder_name'] ?? '');
    if (!$eventId || !$holder) return json_bad('Missing fields', 422);
    $stmt = $db->prepare('INSERT INTO tickets (event_id,holder_name,status) VALUES (?,?,?)');
    $stmt->execute([$eventId,$holder,'reserved']);
    return json_ok(['id'=>$db->lastInsertId()], 201);
  }

  return json_bad('Not Found', 404);

} catch (Throwable $e) {
  return json_bad('Server error: '.$e->getMessage(), 500);
}
