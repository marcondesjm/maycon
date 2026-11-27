<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Utilize o formulário para enviar um pedido.');
}

$name = field('nome');
$email = field('email');
$company = field('empresa');
$specialty = field('especialidade');
$message = field('demanda');
$specialties = ['Meat Service', 'Conservação', 'Obras', 'Staff', 'Soluções integradas'];

if (
    $name === '' || strlen($name) > 480 ||
    $company === '' || strlen($company) > 640 ||
    strlen($email) > 180 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !in_array($specialty, $specialties, true) ||
    $message === '' || strlen($message) > 16000 ||
    !preg_match('//u', $name . $company . $message)
) {
    respond(422, 'Verifique os campos do formulário e tente novamente.');
}

$apiKey = getenv('RESEND_API_KEY');
$from = getenv('CONTACT_FROM_EMAIL');
$to = getenv('CONTACT_TO_EMAIL');

if (!$apiKey || !filter_var($from, FILTER_VALIDATE_EMAIL) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    respond(503, 'O envio por e-mail ainda não está disponível.');
}

$payload = json_encode([
    'from' => $from,
    'to' => [$to],
    'reply_to' => $email,
    'subject' => 'Pedido MV Services: ' . $specialty,
    'text' => "Nome: $name\nEmpresa: $company\nE-mail: $email\nEspecialidade: $specialty\n\nDescrição do pedido:\n$message",
], JSON_THROW_ON_ERROR);

if (!function_exists('curl_init')) {
    respond(503, 'O envio por e-mail está temporariamente indisponível.');
}

$request = curl_init('https://api.resend.com/emails');
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 8,
]);

$result = curl_exec($request);
$status = curl_getinfo($request, CURLINFO_RESPONSE_CODE);
curl_close($request);

if ($result === false || $status < 200 || $status >= 300) {
    respond(502, 'Não foi possível enviar a mensagem. Tente novamente dentro de momentos.');
}

respond(200, 'Pedido enviado com sucesso.');
