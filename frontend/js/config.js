// Signup form
const signupForm = document.getElementById('signupForm');
if(signupForm){
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '';

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try{
            const res = await fetch(`${API_BASE_URL}/auth/signup`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email, password})
            });

            const data = await res.json();

            if(!res.ok){
                errorMsg.textContent = data.error || 'Signup failed';
                return;
            }

            alert('Account created! Please log in.');
            window.location.href = 'login.html';

        }catch(err){
            errorMsg.textContent = 'Could not connect to server';
            console.error(err);
        }
    });
}

// Login form
const loginForm = document.getElementById('loginForm');
if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try{
            const res = await fetch(`${API_BASE_URL}/auth/login`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const data = await res.json();

            if(!res.ok){
                errorMsg.textContent = data.error || 'Login failed';
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';

        }catch(err){
            errorMsg.textContent = 'Could not connect to server';
            console.error(err);
        }
    });
}