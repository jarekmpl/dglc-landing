document.addEventListener('DOMContentLoaded', () => {
    
    // Lista dozwolonych kodów zaproszenia (dla celów demo)
    const validCodes = ['DGLC2026', 'BLUERANK_VIP', 'MASTERMIND'];
    
    // Elementy HTML
    const verifyBtn = document.getElementById('verify-btn');
    const inviteCodeInput = document.getElementById('invite-code');
    const codeErrorMsg = document.getElementById('code-error');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const registrationForm = document.getElementById('registration-form');

    // Krok 1: Weryfikacja
    verifyBtn.addEventListener('click', () => {
        const enteredCode = inviteCodeInput.value.trim().toUpperCase();
        
        if (validCodes.includes(enteredCode)) {
            // Kod poprawny - przejdź do kroku 2
            codeErrorMsg.style.display = 'none';
            
            // Animacja przejścia
            step1.style.opacity = '0';
            setTimeout(() => {
                step1.classList.remove('active');
                step2.classList.add('active');
                // Trigger reflow do animacji wejścia
                void step2.offsetWidth; 
                step2.style.opacity = '1';
                
                // Zablokuj enter na submit, chyba że pola są wypełnione
            }, 400);
            
        } else {
            // Błąd kodu
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
    });
    
    // Obsługa kliknięcia Enter w polu wpisywania kodu
    inviteCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyBtn.click();
        }
    });

    // Krok 2: Wysłanie formularza
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animacja przejścia do ekranu sukcesu
        step2.style.opacity = '0';
        setTimeout(() => {
            step2.classList.remove('active');
            step3.classList.add('active');
            void step3.offsetWidth;
            step3.style.opacity = '1';
        }, 400);
        
        // W rzeczywistej aplikacji tutaj nastąpiłby request POST np. przez fetch() do API
        console.log('Rejestracja wysłana:', {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            jobTitle: document.getElementById('job-title').value
        });
    });

});
