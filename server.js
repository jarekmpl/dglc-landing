const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ukrywamy endpoint na vip_codes.json poprzez serwowanie tylko wybranych plików/folderów
// Nie serwujemy głównego folderu w całości jak leci
app.use(express.static(path.join(__dirname), {
    index: ['index.html'],
    // Ignoruj prośby o pliki json przez URL
    setHeaders: (res, path) => {
        if (path.endsWith('.json')) {
            res.status(403).end();
        }
    }
}));

// Paths
const vipCodesPath = path.join(__dirname, 'vip_codes.json');
const usedCodesPath = path.join(__dirname, 'used_codes.json');
const registrationsPath = path.join(__dirname, 'registrations.json');

// Helppery do plików
function readJsonFile(filePath, defaultValue) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
            return defaultValue;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return defaultValue;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err);
    }
}

// Inicjalizacja baz
let vipCodes = readJsonFile(vipCodesPath, []);
let usedCodes = readJsonFile(usedCodesPath, []);
let registrations = readJsonFile(registrationsPath, []);

// Endpoint: Weryfikacja kodu
app.post('/api/verify-code', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Brak kodu' });
    }

    const upperCode = code.trim().toUpperCase();

    // Możesz również dopuścić dodatkowe kody specjalne, np. dla organizatora:
    const isSpecialCode = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'].includes(upperCode);

    if (vipCodes.includes(upperCode) || isSpecialCode) {
        if (usedCodes.includes(upperCode)) {
            return res.status(400).json({ error: 'used', message: 'Niestety, ten kod został już wykorzystany.' });
        }
        return res.json({ success: true, message: 'Dostęp VIP odblokowany!' });
    } else {
        return res.status(400).json({ error: 'invalid', message: 'Niestety, kod jest nieprawidłowy.' });
    }
});

// Endpoint: Rejestracja
app.post('/api/register', (req, res) => {
    const { codeUsed, firstName, lastName, email, phone, company, jobTitle, linkedin, diet } = req.body;

    if (!codeUsed || !firstName || !lastName || !email) {
        return res.status(400).json({ error: 'missing_fields', message: 'Wypełnij wszystkie wymagane pola.' });
    }

    const upperCode = codeUsed.trim().toUpperCase();
    const isSpecialCode = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'].includes(upperCode);

    if (!(vipCodes.includes(upperCode) || isSpecialCode)) {
         return res.status(400).json({ error: 'invalid_code', message: 'Nieprawidłowy kod rejestracyjny.' });
    }

    if (usedCodes.includes(upperCode)) {
        return res.status(400).json({ error: 'code_used', message: 'Ten kod został już wykorzystany w międzyczasie.' });
    }

    // Oznacz kod jako zużyty
    usedCodes.push(upperCode);
    writeJsonFile(usedCodesPath, usedCodes);

    // Zapisz rejestrację
    const newRegistration = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        codeUsed: upperCode,
        firstName,
        lastName,
        email,
        phone,
        company,
        jobTitle,
        linkedin: linkedin || '',
        diet: diet || ''
    };

    registrations.push(newRegistration);
    writeJsonFile(registrationsPath, registrations);

    console.log('Nowa rejestracja:', newRegistration.email);

    res.json({ success: true, message: 'Rejestracja zakończona sukcesem!' });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
