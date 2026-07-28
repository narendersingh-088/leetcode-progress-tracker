const user = JSON.parse(localStorage.getItem('user') || 'null');

if(user){
    document.getElementById('usernameDisplay').textContent = user.username;
}

//Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

async function loadStats(){
    try{
        const stats = await apiRequest('/dashboard/stats');

        document.getElementById('totalSolved').textContent = stats.totalSolved;
        document.getElementById('easyCount').textContent = stats.easy;
        document.getElementById('mediumCount').textContent = stats.medium;
        document.getElementById('hardCount').textContent = stats.hard;
        document.getElementById('currentStreak').textContent = `${stats.currentStreak} Days`;
        document.getElementById('acceptanceRate').textContent = `${stats.acceptanceRate}%`;
    }catch(err){
        document.getElementById('errorMsg').textContent = 'Could not load dashboard stats';
        console.error(err);
    }
}

loadStats();