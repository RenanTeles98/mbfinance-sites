<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$url   = trim($input['url'] ?? '');

if (!$url) {
    http_response_code(400);
    echo json_encode(['error' => 'url required']);
    exit;
}

$file = __DIR__ . '/../data/shortlinks.json';
$data = [];
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true) ?: [];
}

// Reutiliza código se a mesma URL já foi encurtada
$existing = array_search($url, $data);
if ($existing !== false) {
    echo json_encode(['short' => 'https://www.mbnegocios.com.br/c/' . $existing]);
    exit;
}

// Gera código único de 6 caracteres
$chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
$code  = '';
$attempts = 0;
do {
    $code = '';
    for ($i = 0; $i < 6; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    }
    $attempts++;
} while (isset($data[$code]) && $attempts < 10);

$data[$code] = $url;
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);

echo json_encode(['short' => 'https://www.mbnegocios.com.br/c/' . $code]);
