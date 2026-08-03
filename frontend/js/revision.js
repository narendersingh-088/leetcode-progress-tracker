const user = JSON.parse(localStorage.getItem('user') || 'null');
if (user) document.getElementById('usernameDisplay').textContent = user.username;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

async function loadRevisionList() {
  try {
    const items = await apiRequest('/progress/revision');
    const container = document.getElementById('revisionList');
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = '<p style="color:#a0a0c0;">No problems marked for revision yet.</p>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'panel';
      card.style.marginBottom = '12px';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${item.title}</strong>
            <span class="badge badge-${item.difficulty.toLowerCase()}">${item.difficulty}</span>
            <span style="color:#a0a0c0; font-size:13px; margin-left:8px;">${item.topic}</span>
          </div>
          <button class="unmark-btn" data-id="${item.id}">Remove from Revision</button>
        </div>
        ${item.notes ? `<p style="color:#a0a0c0; font-size:13px; margin-top:8px;">${item.notes}</p>` : ''}
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

document.getElementById('revisionList').addEventListener('click', async (e) => {
  if (!e.target.classList.contains('unmark-btn')) return;

  const progressId = e.target.dataset.id;
  try {
    await apiRequest(`/progress/${progressId}`, {
      method: 'PUT',
      body: JSON.stringify({ revision: false })
    });
    loadRevisionList(); // re-fetch to reflect removal
  } catch (err) {
    alert('Failed to update');
  }
});

loadRevisionList();