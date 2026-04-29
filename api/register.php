<?php
header('Content-Type: application/json');

require_once 'db.php';

// Get POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!isset($input['codeUsed']) || !isset($input['firstName']) || !isset($input['lastName']) || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'missing_fields', 'message' => 'Wypełnij wszystkie wymagane pola.']);
    exit;
}

$code = strtoupper(trim($input['codeUsed']));

try {
    // Sprawdź kod
    $stmt = $pdo->prepare("SELECT is_used FROM vip_codes WHERE code = :code");
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'invalid_code', 'message' => 'Nieprawidłowy kod rejestracyjny.']);
        exit;
    }

    if ($row['is_used']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'code_used', 'message' => 'Ten kod został już wykorzystany w międzyczasie.']);
        exit;
    }

    // Oznacz jako zużyty
    $update = $pdo->prepare("UPDATE vip_codes SET is_used = 1 WHERE code = :code");
    $update->execute([':code' => $code]);

    // Dodaj rejestrację
    $insert = $pdo->prepare("
        INSERT INTO registrations 
        (code_used, first_name, last_name, email, phone, company, job_title, linkedin, diet) 
        VALUES 
        (:code, :fn, :ln, :email, :phone, :company, :job, :linkedin, :diet)
    ");
    
    $insert->execute([
        ':code' => $code,
        ':fn' => $input['firstName'],
        ':ln' => $input['lastName'],
        ':email' => $input['email'],
        ':phone' => isset($input['phone']) ? $input['phone'] : '',
        ':company' => isset($input['company']) ? $input['company'] : '',
        ':job' => isset($input['jobTitle']) ? $input['jobTitle'] : '',
        ':linkedin' => isset($input['linkedin']) ? $input['linkedin'] : '',
        ':diet' => isset($input['diet']) ? $input['diet'] : ''
    ]);

    echo json_encode(['success' => true, 'message' => 'Rejestracja zakończona sukcesem!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'db_error', 'message' => 'Błąd zapisu do bazy danych. Sprawdź CHMOD 666 na pliku bazy i folderze.']);
}
?>
