<?php
/**
 * GrowthPath API
 * Lightweight REST API for GrowthPath application
 * 
 * To use with Laravel:
 * 1. Install Laravel: composer create-project laravel/laravel
 * 2. Copy these files into the Laravel project
 * 3. Run: php artisan migrate
 * 4. Run: php artisan serve
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
$response->send();
$kernel->terminate($request, $response);
