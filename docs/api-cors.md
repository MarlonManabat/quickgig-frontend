# API CORS setup (PHP)

```php
<?php
$allowed = [
    'https://quickgig.ph',
    'https://app.quickgig.ph',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^https://quickgig-frontend-.*\.vercel\.app$#', $origin)) {
    $allowed[] = $origin;
}
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit; // preflight
}
?>
```
