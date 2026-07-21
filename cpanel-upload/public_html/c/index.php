<?php
$allowed_hosts = ['mbfinance.com.br', 'mbnegocios.com.br', 'blog.mbfinance.com.br'];

function is_safe_url(string $url, array $allowed): bool {
    $parts = parse_url($url);
    if (!$parts || !isset($parts['host'])) return false;
    if (!in_array($parts['scheme'] ?? '', ['http', 'https'])) return false;
    $host = strtolower($parts['host']);
    foreach ($allowed as $h) {
        if ($host === $h || str_ends_with($host, '.' . $h)) return true;
    }
    return false;
}

$code = $_GET['code'] ?? '';
$file = __DIR__ . '/../data/shortlinks.json';

if (!$code || !file_exists($file)) {
    http_response_code(404);
    echo 'Link não encontrado.';
    exit;
}

$data = json_decode(file_get_contents($file), true) ?: [];

if (!isset($data[$code])) {
    http_response_code(404);
    echo 'Link não encontrado ou expirado.';
    exit;
}

$dest = $data[$code];
if (!is_safe_url($dest, $allowed_hosts)) {
    http_response_code(400);
    echo 'Destino inválido.';
    exit;
}

header('Location: ' . $dest, true, 302);
exit;
