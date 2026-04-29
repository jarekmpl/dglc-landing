document.addEventListener('DOMContentLoaded', () => {
    // Elementy HTML
    const verifyBtn = document.getElementById('verify-btn');
    const inviteCodeInput = document.getElementById('invite-code');
    const codeErrorMsg = document.getElementById('code-error');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const registrationForm = document.getElementById('registration-form');
    
    let currentValidCode = null;

    // Krok 1: Weryfikacja
    verifyBtn.addEventListener('click', async () => {
        const enteredCode = inviteCodeInput.value.trim().toUpperCase();
        
        if (!enteredCode) return;

        try {
            const response = await fetch('api/verify-code.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: enteredCode })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                // Kod poprawny - przejdź do kroku 2
                currentValidCode = enteredCode;
                codeErrorMsg.style.display = 'none';
                
                // Animacja przejścia
                step1.style.opacity = '0';
                setTimeout(() => {
                    step1.classList.remove('active');
                    step2.classList.add('active');
                    // Trigger reflow do animacji wejścia
                    void step2.offsetWidth; 
                    step2.style.opacity = '1';
                }, 400);
            } else {
                // Błąd kodu lub użyty
                codeErrorMsg.textContent = data.message || 'Niestety, kod jest nieprawidłowy.';
                showCodeError();
            }
        } catch (e) {
            console.error('Błąd weryfikacji:', e);
            codeErrorMsg.textContent = 'Błąd połączenia z serwerem.';
            showCodeError();
        }
    });
    
    function showCodeError() {
        codeErrorMsg.style.display = 'block';
        inviteCodeInput.classList.add('error');
        
        // Shake animation
        inviteCodeInput.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            iterations: 1
        });
    }

    // Obsługa kliknięcia Enter w polu wpisywania kodu
    inviteCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyBtn.click();
        }
    });

    // Krok 2: Wysłanie formularza
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            codeUsed: currentValidCode,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            jobTitle: document.getElementById('job-title').value,
            linkedin: document.getElementById('linkedin').value,
            diet: document.getElementById('diet').value
        };

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.ok && data.success) {
                // Animacja przejścia do ekranu sukcesu
                step2.style.opacity = '0';
                setTimeout(() => {
                    step2.classList.remove('active');
                    step3.classList.add('active');
                    void step3.offsetWidth;
                    step3.style.opacity = '1';
                }, 400);
            } else {
                alert(data.message || 'Wystąpił błąd podczas rejestracji.');
            }
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            alert('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});
