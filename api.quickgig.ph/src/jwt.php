<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function jwt_sign(array $payload) {
  return JWT::encode($payload, JWT_SECRET, 'HS256');
}
function jwt_verify(string $token) {
  try { return (array) JWT::decode($token, new Key(JWT_SECRET, 'HS256')); }
  catch (Throwable $e) { return null; }
}
