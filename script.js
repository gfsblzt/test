let sessionToken = '';

function startSession() {
    const phoneNumber = document.getElementById('phone-number').value;
    const recaptchaResponse = grecaptcha.getResponse();

    if (!phoneNumber) {
        alert('Пожалуйста, введите номер телефона.');
        return;
    }

    if (!recaptchaResponse) {
        alert('Пожалуйста, подтвердите, что вы не робот.');
        return;
    }

    fetch('https://api.neocrypto.net/api/session/start', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Origin': 'http://127.0.0.1:5500',
            'Referer': 'http://127.0.0.1:5500/',
            'User-Agent': 'Mozilla/5.0'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            sessionToken = data.token;
            setPhoneNumber(phoneNumber, recaptchaResponse);
        } else {
            throw new Error('Не удалось начать сессию');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('result').innerText = 'Произошла ошибка при запуске сессии. Попробуйте еще раз.';
    });
}

function setPhoneNumber(phoneNumber, recaptchaToken) {
    fetch('https://api.neocrypto.net/api/session/set-phone-number', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Origin': 'http://127.0.0.1:5500',
            'Referer': 'http://127.0.0.1:5500/',
            'User-Agent': 'Mozilla/5.0',
            'session': sessionToken
        },
        body: JSON.stringify({
            phone_number: phoneNumber,
            recaptcha_token: recaptchaToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === "sessions.recaptcha_not_verified") {
            document.getElementById('result').innerText = 'Captcha is incorrect. Проверьте правильность выполнения reCAPTCHA.';
        } else {
            document.getElementById('result').innerText = 'SMS отправлено на ваш номер телефона.';
            document.getElementById('verification-form').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('result').innerText = 'Произошла ошибка при отправке SMS. Попробуйте еще раз.';
    });
}

function verifyPhoneNumber() {
    const verificationCode = document.getElementById('verification-code').value;
    // Добавьте здесь логику для проверки кода
}
