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

async function loadHeatmap(){
    try{
        const heatmap = await apiRequest('/dashboard/heatmap');
        const container = document.getElementById('heatmapContainer');
        container.innerHTML = '';

        const today = new Date();
        const days = [];

        for(let i = 89; i >= 0 ; i--){
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().slice(0, 10));
        }

        days.forEach(dateStr => {
            const count = heatmap[dateStr] || 0;
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.title = `${dateStr}: ${count} solved`;

            if(count === 0) cell.classList.add('level-0');
            else if(count === 1) cell.classList.add('level-1');
            else if(count <= 3) cell.classList.add('level-2');
            else cell.classList.add('level-3');

            container.appendChild(cell);
        });

    }catch(err){
        console.error(err);
    }
}

async function loadHistory(){
    try{
        const history = await apiRequest('/progress');
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';

        history.forEach(entry => {
            const row = document.createElement('tr');
            const dateDisplay = entry.date_solved
            ? new Date(entry.date_solved).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : '-';

            row.innerHTML = `
                <td>${entry.title}</td>
                <td><span class="badge badge-${entry.difficulty.toLowerCase()}">${entry.difficulty}</span></td>
                <td>${entry.status}</td>
                <td>${dateDisplay}</td>
            `;
            tbody.appendChild(row);
        });

    }catch(err){
        console.error(err);
    }
}

loadStats();
loadTopicProgress();
loadHeatmap();
loadHistory();