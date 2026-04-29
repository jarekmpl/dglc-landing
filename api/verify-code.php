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
$specialCodes = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'];

// Sprawdź czy to jest specjalny kod (tzw. master key)
$isSpecial = in_array($code, $specialCodes);

try {
    // Sprawdź kod w bazie
    $stmt = $pdo->prepare("SELECT is_used FROM vip_codes WHERE code = :code");
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row || $isSpecial) {
        $isUsed = $row ? (bool)$row['is_used'] : false;
        
        // Zabezpieczenie: Jeśli kod specjalny, sprawdzamy po prostu czy go kiedyś użyto
        // W tym przypadku dla kodów specjalnych nie chcemy ich blokować, bo są to master keys. 
        // Jeśli jednak chcemy zablokować master keys po 1 użyciu, można odkomentować sprawdzanie w `registrations`.
        // Załóżmy, że kody standardowe są 1-razowe, a master key działa zawsze, lub... użyjmy `isUsed`.

        if (!$isSpecial && $isUsed) {
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
