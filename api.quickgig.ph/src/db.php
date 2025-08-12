<?php
function db() {
  static $pdo;
  if (!$pdo) {
    $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]);
  }
  return $pdo;
}
