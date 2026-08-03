const user = JSON.parse(localStorage.getItem('user') || 'null');
if (user) document.getElementById('usernameDisplay').textContent = user.username;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

const searchInput = document.getElementById('searchInput');
const topicFilter = document.getElementById('topicFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const tbody = document.getElementById('problemsTableBody');

let debounceTimer;

// Fetch and render problems based on current filter values
async function loadProblems() {
  try {
    const params = new URLSearchParams();
    if (searchInput.value) params.append('search', searchInput.value);
    if (topicFilter.value) params.append('topic', topicFilter.value);
    if (difficultyFilter.value) params.append('difficulty', difficultyFilter.value);

    const res = await fetch(`${API_BASE_URL}/problems?${params.toString()}`);
    const problems = await res.json();

    tbody.innerHTML = '';
    problems.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.title}</td>
        <td><span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span></td>
        <td>${p.topic}</td>
        <td><button class="mark-solved-btn" data-id="${p.id}">Mark Solved</button></td>
      `;
      tbody.appendChild(row);
    });

    // Populate topic dropdown once, from the unfiltered problem set
    if (topicFilter.options.length === 1) {
      const topics = [...new Set(problems.map(p => p.topic))];
      topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        topicFilter.appendChild(opt);
      });
    }

  } catch (err) {
    console.error(err);
  }
}

// Mark a problem solved when its button is clicked
tbody.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('mark-solved-btn')) return;

  const problemId = e.target.dataset.id;
  e.target.textContent = 'Saving...';
  e.target.disabled = true;

  try {
    await apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify({ problem_id: Number(problemId), status: 'Solved' })
    });
    e.target.textContent = 'Solved ✓';
  } catch (err) {
    e.target.textContent = 'Mark Solved';
    e.target.disabled = false;
    alert('Failed to save progress');
  }
});

// Debounced search — avoid firing a request on every keystroke
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadProblems, 400);
});

topicFilter.addEventListener('change', loadProblems);
difficultyFilter.addEventListener('change', loadProblems);

loadProblems();