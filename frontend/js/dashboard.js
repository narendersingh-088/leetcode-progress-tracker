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

        loadDifficultyChart(stats);

    }catch(err){
        document.getElementById('errorMsg').textContent = 'Could not load dashboard stats';
        console.error(err);
    }
}

async function loadDifficultyChart(stats){
    const ctx = document.getElementById('difficultyChart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [stats.easy, stats.medium, stats.hard],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

async function loadTopicProgress(){
    try{
        const topics = await apiRequest('/dashboard/topics');
        const container = document.getElementById('topicProgressList');

        container.innerHTML = '';

        topics.forEach(t => {
            const row = document.createElement('div');
            row.className = 'topic-row';

            row.innerHTML = `
                <div class="topic-label">
                    <span>${t.topic}</span>
                    <span>${t.percent}% (${t.solvedCount}/${t.totalProblems})</span>
                </div>
                <div class="topic-bar-track">
                    <div class="topic-bar-fill" style="width: ${t.percent}%"></div>
                </div>
            `;

            container.appendChild(row);
        });

    }catch(err){
        console.error(err);
        document.getElementById('errorMsg').textContent = 'Could not load topic progress';
    }
}

loadStats();
loadTopicProgress();