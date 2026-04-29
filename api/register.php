<?php
header('Content-Type: application/json');

// Get POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['codeUsed']) || !isset($input['firstName']) || !isset($input['lastName']) || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'missing_fields', 'message' => 'Wypełnij wszystkie wymagane pola.']);
    exit;
}

$code = strtoupper(trim($input['codeUsed']));
$specialCodes = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'];

// Helper to read JSON
function readJson($file, $default = []) {
    if (!file_exists($file)) {
        return $default;
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: $default;
}

// Helper to write JSON
function writeJson($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$vipCodesPath = '../vip_codes.json';
$usedCodesPath = '../used_codes.json';
$registrationsPath = '../registrations.json';

$vipCodes = readJson($vipCodesPath, []);
$usedCodes = readJson($usedCodesPath, []);
$registrations = readJson($registrationsPath, []);

if (!(in_array($code, $vipCodes) || in_array($code, $specialCodes))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'invalid_code', 'message' => 'Nieprawidłowy kod rejestracyjny.']);
    exit;
}

if (in_array($code, $usedCodes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'code_used', 'message' => 'Ten kod został już wykorzystany w międzyczasie.']);
    exit;
}

// Oznacz jako zużyty
$usedCodes[] = $code;
writeJson($usedCodesPath, $usedCodes);

// Dodaj rejestrację
$newRegistration = [
    'id' => uniqid(),
    'timestamp' => date('c'),
    'codeUsed' => $code,
    'firstName' => $input['firstName'],
    'lastName' => $input['lastName'],
    'email' => $input['email'],
    'phone' => isset($input['phone']) ? $input['phone'] : '',
    'company' => isset($input['company']) ? $input['company'] : '',
    'jobTitle' => isset($input['jobTitle']) ? $input['jobTitle'] : '',
    'linkedin' => isset($input['linkedin']) ? $input['linkedin'] : '',
    'diet' => isset($input['diet']) ? $input['diet'] : ''
];

$registrations[] = $newRegistration;
writeJson($registrationsPath, $registrations);

echo json_encode(['success' => true, 'message' => 'Rejestracja zakończona sukcesem!']);
?>
