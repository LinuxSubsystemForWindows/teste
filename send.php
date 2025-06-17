<?php

$botToken = "7020765117:AAFIn4F1NCnpcV6zGw26ODYHsAfxMLlRkSI";
$chatId = "589376542"; // chat_id onde quer enviar (pode ser grupo, usuário, canal)
$filePath = $_FILES['document']['tmp_name'] ?? null; // arquivo enviado pelo cliente
$fileName = $_FILES['document']['name'] ?? null;

if (!$botToken || !$chatId) {
    http_response_code(500);
    echo json_encode(['error' => 'Token do bot ou chat_id não configurados']);
    exit;
}

if (!$filePath || !$fileName) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado']);
    exit;
}

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.telegram.org/bot{$botToken}/sendDocument",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => [
        'chat_id' => $chatId,
        'document' => new CURLFile($filePath, mime_content_type($filePath), $fileName),
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

header('Content-Type: application/json');

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => $err]);
} else {
    echo $response;
}
