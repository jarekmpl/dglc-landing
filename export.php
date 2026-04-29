<?php
// Hasło dostępu do pobrania pliku
$password = 'dglc-admin2026';

if (!isset($_GET['pass']) || $_GET['pass'] !== $password) {
    http_response_code(403);
    echo "Brak dostępu. Podaj prawidłowe hasło w URL, np. ?pass=haslo";
    exit;
}

require_once 'api/db.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=rejestracje_' . date('Y-m-d') . '.csv');

// Otwieramy strumień wyjściowy
$output = fopen('php://output', 'w');

// Dodajemy nagłówki z polskimi znakami (BOM) dla Excela
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Nagłówki kolumn
fputcsv($output, ['ID', 'Kod VIP', 'Imię', 'Nazwisko', 'Email', 'Telefon', 'Firma', 'Stanowisko', 'LinkedIn', 'Dieta', 'Data Rejestracji'], ';');

try {
    $stmt = $pdo->query("SELECT * FROM registrations ORDER BY timestamp DESC");
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, [
            $row['id'],
            $row['code_used'],
            $row['first_name'],
            $row['last_name'],
            $row['email'],
            $row['phone'],
            $row['company'],
            $row['job_title'],
            $row['linkedin'],
            $row['diet'],
            $row['timestamp']
        ], ';');
    }
} catch (Exception $e) {
    fputcsv($output, ['Blad podczas eksportu', $e->getMessage()]);
}

fclose($output);
exit;
?>
