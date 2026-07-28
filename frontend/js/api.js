async function apiRequest(endpoint, options = {}){
    const token = localStorage.getItem('token');

    if(!token){
        window.location.href = 'login.html';
        return;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`,{
        ...options,
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if(res.status === 401){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
    }

    const data = await res.json();
    if(!res.ok){
        throw new Error(data.error || 'Request failed');
    }

    return data;
}