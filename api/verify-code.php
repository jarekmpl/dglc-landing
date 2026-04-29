<?php
header('Content-Type: application/json');

// Get POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['code'])) {
    echo json_encode(['success' => false, 'error' => 'missing_code', 'message' => 'Brak kodu']);
    exit;
}

$code = strtoupper(trim($input['code']));
$specialCodes = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'];

// Helper to read JSON
function readJson($file, $default = []) {
    if (!file_exists($file)) {
        return $default;
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: $default;
}

$vipCodesPath = '../vip_codes.json';
$usedCodesPath = '../used_codes.json';

$vipCodes = readJson($vipCodesPath, []);
$usedCodes = readJson($usedCodesPath, []);

if (in_array($code, $vipCodes) || in_array($code, $specialCodes)) {
    if (in_array($code, $usedCodes)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'used', 'message' => 'Niestety, ten kod został już wykorzystany.']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Dostęp VIP odblokowany!']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'invalid', 'message' => 'Niestety, kod jest nieprawidłowy.']);
}
?>
