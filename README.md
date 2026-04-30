# Digital Growth Collective - Landing Page

Ekskluzywny, zamknięty landing page na prywatne wydarzenie dla liderów marketingu i digitalu (organizowane przez Bluerank). 
Aplikacja składa się z responsywnego, wizualnie dopracowanego frontendu (HTML/CSS/JS) oraz lekkiego i bezpiecznego backendu opisanego w czystym PHP i SQLite.

## Architektura Projektu

- **Frontend:** Vanilla HTML, CSS, JavaScript (brak ciężkich frameworków, błyskawiczne ładowanie).
- **Backend:** PHP 7.4+ (z rozszerzeniem PDO_SQLITE).
- **Baza danych:** Plikowa baza danych **SQLite**, tworzona w 100% automatycznie przy pierwszym uruchomieniu przez PHP.

## Jak działa system rejestracji?

Rejestracja jest dwuetapowa:
1. **Weryfikacja VIP:** Użytkownik musi podać specjalny jednorazowy kod z zaproszenia. Kody są bezpiecznie sprawdzane w bazie danych bez ich zdradzania we frontendzie.
2. **Formularz zgłoszeniowy:** Po poprawnej weryfikacji użytkownik uzupełnia dane osobowe, a wykorzystany kod zostaje oznaczony jako "zużyty" w bazie, blokując go przed ponownym użyciem przez inne osoby.

## Struktura Plików

- `index.html` - główna wizytówka strony.
- `style.css` - dedykowany, autorski arkusz stylów.
- `script.js` - logika UI i komunikacja asynchroniczna z API po stronie klienta.
- `export.php` - skrypt do pobierania bazy rejestracji do formatu `.csv` (zabezpieczony hasłem).
- `vip_codes.json` - startowa "baza" kodów VIP. Jest czytana tylko raz w celu zasilenia pustej bazy SQLite.
- `api/`
  - `db.php` - zarządza połączeniem z bazą SQLite, automatycznie tworzy tabele i migruje kody startowe.
  - `verify-code.php` - endpoint API odpytujący bazę o ważność kodu.
  - `register.php` - endpoint API odbierający dane, znakujący kod jako zużyty i zapisujący zgłoszenie.

## Instalacja na serwerze (Współdzielonym / VPS)

Aby uruchomić aplikację w pełni poprawnie:

1. Wgraj wszystkie pliki na swój serwer HTTP (obsługujący dowolną wersję PHP).
2. **Kluczowy krok (Prawa dostępu):** Skrypt PHP w pliku `api/db.php` spróbuje automatycznie stworzyć folder o nazwie `data` i plik `database.sqlite` w jego wnętrzu. 
   Aby mechanizm SQLite zadziałał, główny folder aplikacji (bądź utworzony ręcznie folder `data/`) musi być modyfikowalny przez proces PHP (www-data).
   Z poziomu terminala wywołaj:
   ```bash
   mkdir data && chmod 777 data
   ```
3. Otwórz stronę przez przeglądarkę i wpisz poprawny kod. System automatycznie zainicjuje plik `database.sqlite` i zamknie w nim startowe kody VIP.

## Eksport zgłoszeń do Excela

Otwórz w przeglądarce podstronę, na której leży skrypt eksportujący (domyślnie zabezpieczony prostym hasłem przesyłanym w linku):
`https://twoja-domena.pl/export.php?pass=dglc-admin2026`

Zostanie pobrany automatycznie wygenerowany plik `rejestracje_[DATA].csv`, gotowy do otwarcia w programie Excel lub Google Sheets (kodowanie UTF-8 BOM, separator średnik).
