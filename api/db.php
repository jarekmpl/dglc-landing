<?php

$dbPath = __DIR__ . '/../database.sqlite';

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    // Set errormode to exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create tables if they don't exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS vip_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            is_used INTEGER DEFAULT 0
        )
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code_used TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            job_title TEXT,
            linkedin TEXT,
            diet TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Jeśli baza jest pusta, zaimportujmy kody z vip_codes.json
    $stmt = $pdo->query("SELECT COUNT(*) FROM vip_codes");
    if ($stmt->fetchColumn() == 0) {
        $vipCodesPath = __DIR__ . '/../vip_codes.json';
        if (file_exists($vipCodesPath)) {
            $codes = json_decode(file_get_contents($vipCodesPath), true);
            if (is_array($codes)) {
                $insert = $pdo->prepare("INSERT OR IGNORE INTO vip_codes (code) VALUES (:code)");
                foreach ($codes as $c) {
                    $insert->execute([':code' => $c]);
                }
            }
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'db_error', 'message' => 'Błąd bazy danych: Sprawdź uprawnienia CHMOD (666) do pliku database.sqlite oraz folderu.']);
    exit;
}
?>
