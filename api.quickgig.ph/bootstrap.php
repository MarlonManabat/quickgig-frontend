<?php
require_once __DIR__.'/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!defined('ADMIN_TOKEN')) {
    define('ADMIN_TOKEN', getenv('ADMIN_TOKEN') ?: '');
}

function db() {
    static $pdo;
    if (!$pdo) {
        $dsn = 'mysql:host='.(getenv('DB_HOST') ?: 'localhost').';dbname='.(getenv('DB_NAME') ?: 'quickgig').';charset=utf8mb4';
        $pdo = new PDO($dsn, getenv('DB_USER') ?: 'user', getenv('DB_PASS') ?: 'pass', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    }
    return $pdo;
}

function json($code, $data) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function allow_origin() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = ['https://app.quickgig.ph', 'https://quickgig.ph'];
    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function jwt_issue(array $payload) {
    return JWT::encode($payload, getenv('JWT_SECRET') ?: 'change_me', 'HS256');
}

function jwt_verify(string $token) {
    try {
        return (array)JWT::decode($token, new Key(getenv('JWT_SECRET') ?: 'change_me', 'HS256'));
    } catch (Throwable $e) {
        return null;
    }
}

function set_auth_cookie(string $token) {
    setcookie('auth_token', $token, [
        'expires' => time() + 2592000,
        'path' => '/',
        'domain' => '.quickgig.ph',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function clear_auth_cookie() {
    setcookie('auth_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'domain' => '.quickgig.ph',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function current_user() {
    $token = $_COOKIE['auth_token'] ?? '';
    if (!$token) return null;
    $data = jwt_verify($token);
    if (!$data || empty($data['uid'])) return null;
    $stmt = db()->prepare('SELECT id, email, name, phone FROM users WHERE id = ?');
    $stmt->execute([$data['uid']]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}
