<?php
// Hasło dostępu
$password = 'dglc-admin2026';

if (!isset($_GET['pass']) || $_GET['pass'] !== $password) {
    http_response_code(403);
    echo "Brak dostępu. Podaj prawidłowe hasło w URL, np. ?pass=dglc-admin2026";
    exit;
}

require_once 'api/db.php';

echo '<!DOCTYPE html>';
echo '<html lang="pl">';
echo '<head>';
echo '<meta charset="UTF-8">';
echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
echo '<title>Zarejestrowani uczestnicy - DGLC</title>';
echo '<style>';
echo 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; background-color: #f5f5f7; color: #1d1d1f; }';
echo 'h1 { margin-bottom: 20px; }';
echo '.table-wrapper { overflow-x: auto; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }';
echo 'table { border-collapse: collapse; width: 100%; white-space: nowrap; }';
echo 'th, td { border: 1px solid #e1e1e1; padding: 12px; text-align: left; font-size: 14px; }';
echo 'th { background-color: #f8f9fa; font-weight: 600; }';
echo 'tr:hover { background-color: #f1f1f1; }';
echo '</style>';
echo '</head>';
echo '<body>';
echo '<h1>Lista zarejestrowanych osób (DGLC)</h1>';

try {
    $stmt = $pdo->query("SELECT * FROM registrations ORDER BY timestamp DESC");
    
    echo '<div class="table-wrapper">';
    echo '<table>';
    echo '<tr><th>ID</th><th>Kod VIP</th><th>Imię</th><th>Nazwisko</th><th>Email</th><th>Telefon</th><th>Firma</th><th>Stanowisko</th><th>LinkedIn</th><th>Dieta</th><th>Data Rejestracji</th></tr>';
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo '<tr>';
        foreach (['id', 'code_used', 'first_name', 'last_name', 'email', 'phone', 'company', 'job_title', 'linkedin', 'diet', 'timestamp'] as $col) {
            $val = htmlspecialchars((string)$row[$col]);
            if ($col === 'linkedin' && !empty($val)) {
                $val = '<a href="' . $val . '" target="_blank">Profil</a>';
            }
            echo '<td>' . $val . '</td>';
        }
        echo '</tr>';
    }
    echo '</table>';
    echo '</div>';
    
} catch (Exception $e) {
    echo "<p style='color:red;'>Błąd bazy danych: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo '</body>';
echo '</html>';
