<?php
// Hardcode or load from .env (optional). Keep secrets out of git if possible.
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'quickgig');
define('DB_USER', getenv('DB_USER') ?: 'user');
define('DB_PASS', getenv('DB_PASS') ?: 'pass');
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'change_this_super_secret_key');
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: 'https://app.quickgig.ph');
