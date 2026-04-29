<?php
header('Content-Type: application/json');

require_once 'db.php';

// Get POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['code'])) {
    echo json_encode(['success' => false, 'error' => 'missing_code', 'message' => 'Brak kodu']);
    exit;
}

$code = strtoupper(trim($input['code']));

try {
    // Sprawdź kod w bazie
    $stmt = $pdo->prepare("SELECT is_used FROM vip_codes WHERE code = :code");
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $isUsed = (bool)$row['is_used'];
        
        if ($isUsed) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'used', 'message' => 'Niestety, ten kod został już wykorzystany.']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Dostęp VIP odblokowany!']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'invalid', 'message' => 'Niestety, kod jest nieprawidłowy.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'db_error', 'message' => 'Błąd serwera podczas weryfikacji.']);
}
?>
