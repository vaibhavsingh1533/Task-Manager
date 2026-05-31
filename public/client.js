
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg style="width:18px;height:18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg style="width:18px;height:18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>`;
  } else {
    iconSvg = `<svg style="width:18px;height:18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

 
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.25s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3500);
}


const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'info');
  });
}


function setBtnLoading(button, isLoading, originalText) {
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span>`;
  } else {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}


function recalculateStats() {
  const cards = document.querySelectorAll('.task-card');
  const todoCards = document.querySelectorAll('#list-todo .task-card');
  const progressCards = document.querySelectorAll('#list-in_progress .task-card');
  const doneCards = document.querySelectorAll('#list-done .task-card');
  
  
  const total = cards.length;
  const completed = doneCards.length;
  const pending = todoCards.length + progressCards.length;
  
  
  const overdueCards = document.querySelectorAll('.task-card .overdue');
  const overdue = overdueCards.length;

  
  const totalEl = document.getElementById('stat-total');
  const completedEl = document.getElementById('stat-completed');
  const pendingEl = document.getElementById('stat-pending');
  const overdueEl = document.getElementById('stat-overdue');
  
  if (totalEl) totalEl.innerText = total;
  if (completedEl) completedEl.innerText = completed;
  if (pendingEl) pendingEl.innerText = pending;
  if (overdueEl) overdueEl.innerText = overdue;

  
  const todoCount = document.getElementById('count-todo');
  const progressCount = document.getElementById('count-in_progress');
  const doneCount = document.getElementById('count-done');
  
  if (todoCount) todoCount.innerText = todoCards.length;
  if (progressCount) progressCount.innerText = progressCards.length;
  if (doneCount) doneCount.innerText = doneCards.length;

  
  const progressPercent = document.getElementById('progress-percent');
  const progressBarFill = document.getElementById('progress-bar-fill');
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  if (progressPercent) progressPercent.innerText = `${percentage}%`;
  if (progressBarFill) progressBarFill.style.width = `${percentage}%`;

  
  toggleEmptyState('#list-todo', todoCards.length);
  toggleEmptyState('#list-in_progress', progressCards.length);
  toggleEmptyState('#list-done', doneCards.length);
}

function toggleEmptyState(listId, count) {
  const list = document.querySelector(listId);
  if (!list) return;
  const emptyState = list.querySelector('.empty-state');
  if (emptyState) {
    emptyState.style.display = count === 0 ? 'flex' : 'none';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  recalculateStats();
});



const searchInput = document.getElementById('search-input');
const priorityFilter = document.getElementById('priority-filter');

function filterTasks() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedPriority = priorityFilter ? priorityFilter.value : 'all';
  const cards = document.querySelectorAll('.task-card');

  cards.forEach(card => {
    const title = card.querySelector('.task-title').innerText.toLowerCase();
    const descEl = card.querySelector('.task-desc');
    const desc = descEl ? descEl.innerText.toLowerCase() : '';
    const priority = card.dataset.priority;

    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesPriority = selectedPriority === 'all' || priority === selectedPriority;

    if (matchesSearch && matchesPriority) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  
  const columns = ['todo', 'in_progress', 'done'];
  columns.forEach(col => {
    const list = document.getElementById(`list-${col}`);
    if (!list) return;
    const visibleCards = list.querySelectorAll(`.task-card:not([style*="display: none"])`);
    toggleEmptyState(`#list-${col}`, visibleCards.length);
  });
}

if (searchInput) searchInput.addEventListener('input', filterTasks);
if (priorityFilter) priorityFilter.addEventListener('change', filterTasks);





const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerText;

    if (!username || !password || !confirmPassword) {
      return showToast('All fields are required.', 'error');
    }

    if (password.length < 6) {
      return showToast('Password must be at least 6 characters.', 'error');
    }

    if (password !== confirmPassword) {
      return showToast('Passwords do not match.', 'error');
    }

    setBtnLoading(submitBtn, true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      showToast('Account created! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      showToast(err.message, 'error');
      setBtnLoading(submitBtn, false, btnText);
    }
  });
}


const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerText;

    if (!username || !password) {
      return showToast('Username and password are required.', 'error');
    }

    setBtnLoading(submitBtn, true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      showToast('Logged in! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      showToast(err.message, 'error');
      setBtnLoading(submitBtn, false, btnText);
    }
  });
}



const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const openCreateModalBtn = document.getElementById('open-create-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelTaskBtn = document.getElementById('cancel-task-btn');


if (openCreateModalBtn) {
  openCreateModalBtn.addEventListener('click', () => {
    document.getElementById('modal-title').innerText = 'Create Task';
    document.getElementById('save-btn-text').innerText = 'Create';
    document.getElementById('task-id').value = '';
    taskForm.reset();
    
    
    taskForm.querySelector('input[name="priority"][value="medium"]').checked = true;
    document.getElementById('task-due-input').value = '';
    
    taskModal.style.display = 'flex';
  });
}


function hideModal() {
  if (taskModal) {
    taskModal.style.display = 'none';
    taskForm.reset();
  }
}

[closeModalBtn, cancelTaskBtn].forEach(btn => {
  if (btn) btn.addEventListener('click', hideModal);
});

if (taskModal) {
  taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) hideModal();
  });
}


function updateCardActions(card, targetStage) {
  const actionsContainer = card.querySelector('.task-actions');
  const footerContainer = card.querySelector('.task-footer');
  const id = card.dataset.id;
  const title = card.querySelector('.task-title').innerText;
  const descEl = card.querySelector('.task-desc');
  const description = descEl ? descEl.innerText : '';
  const priority = card.dataset.priority;
  const due = card.dataset.due;

  
  actionsContainer.innerHTML = '';

  
  const editBtnHtml = `
    <button class="task-action-btn edit-task-btn" title="Edit Task" data-id="${id}" data-title="${title}" data-description="${description}" data-stage="${targetStage}" data-priority="${priority}" data-due="${due}">
      <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
      </svg>
    </button>
  `;
  const deleteBtnHtml = `
    <button class="task-action-btn delete-btn" title="Delete Task" data-id="${id}">
      <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
      </svg>
    </button>
  `;

  let transferButtonsHtml = '';
  if (targetStage === 'todo') {
    transferButtonsHtml = `
      <button class="task-action-btn move-right-btn" title="Move to In Progress" data-id="${id}" data-target="in_progress">
        <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    `;
    
    
    const dateSpan = footerContainer.querySelector('.task-date');
    if (due) {
      const today = new Date(); today.setHours(0,0,0,0);
      const dueDt = new Date(due); dueDt.setHours(0,0,0,0);
      let dateClass = '';
      let isOverdue = false;
      if (dueDt < today) {
        isOverdue = true;
        dateClass = 'overdue';
      } else if (dueDt.getTime() === today.getTime()) {
        dateClass = 'due-today';
      }
      
      dateSpan.className = `task-date due-tag ${dateClass}`;
      dateSpan.innerHTML = `
        <svg style="width: 12px; height: 12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <span>${isOverdue ? 'Overdue: ' : ''}${dueDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      `;
    }
  } 
  
  else if (targetStage === 'in_progress') {
    transferButtonsHtml = `
      <button class="task-action-btn move-left-btn" title="Move to To Do" data-id="${id}" data-target="todo">
        <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="task-action-btn move-right-btn" title="Move to Done" data-id="${id}" data-target="done">
        <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    `;
    
    
    const dateSpan = footerContainer.querySelector('.task-date');
    if (due) {
      const today = new Date(); today.setHours(0,0,0,0);
      const dueDt = new Date(due); dueDt.setHours(0,0,0,0);
      let dateClass = '';
      let isOverdue = false;
      if (dueDt < today) {
        isOverdue = true;
        dateClass = 'overdue';
      } else if (dueDt.getTime() === today.getTime()) {
        dateClass = 'due-today';
      }
      
      dateSpan.className = `task-date due-tag ${dateClass}`;
      dateSpan.innerHTML = `
        <svg style="width: 12px; height: 12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <span>${isOverdue ? 'Overdue: ' : ''}${dueDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      `;
    }
  } 
  
  else if (targetStage === 'done') {
    transferButtonsHtml = `
      <button class="task-action-btn move-left-btn" title="Move to In Progress" data-id="${id}" data-target="in_progress">
        <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
    `;

    
    const dateSpan = footerContainer.querySelector('.task-date');
    dateSpan.className = 'task-date';
    dateSpan.style.display = 'inline-flex';
    dateSpan.style.alignItems = 'center';
    dateSpan.style.gap = '4px';
    dateSpan.style.color = 'var(--color-done)';
    dateSpan.style.fontWeight = '600';
    dateSpan.innerHTML = `
      <svg style="width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      <span>Finished</span>
    `;
  }

  actionsContainer.innerHTML = editBtnHtml + deleteBtnHtml + transferButtonsHtml;
}


async function updateTaskStageOptimistically(card, targetStage) {
  const originalColumn = card.parentNode;
  const originalStage = originalColumn.closest('.board-column').dataset.stage;
  const targetList = document.getElementById(`list-${targetStage}`);
  const id = card.dataset.id;

  if (originalStage === targetStage) return;

  
  targetList.appendChild(card);
  
  
  card.className = `glass-panel task-card ${targetStage}`;
  
  
  const titleEl = card.querySelector('.task-title');
  if (targetStage === 'done') {
    titleEl.style.textDecoration = 'line-through';
    titleEl.style.opacity = '0.7';
    const badge = card.querySelector('.priority-badge');
    if (badge) badge.style.opacity = '0.7';
    const desc = card.querySelector('.task-desc');
    if (desc) desc.style.opacity = '0.6';
  } else {
    titleEl.style.textDecoration = 'none';
    titleEl.style.opacity = '1';
    const badge = card.querySelector('.priority-badge');
    if (badge) badge.style.opacity = '1';
    const desc = card.querySelector('.task-desc');
    if (desc) desc.style.opacity = '1';
  }

  
  updateCardActions(card, targetStage);
  
  
  recalculateStats();

  
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: targetStage })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to move task');
    }

    showToast('Task status updated', 'success');
  } catch (err) {
    
    showToast(err.message, 'error');
    originalColumn.appendChild(card);
    
    
    card.className = `glass-panel task-card ${originalStage}`;
    if (originalStage === 'done') {
      titleEl.style.textDecoration = 'line-through';
      titleEl.style.opacity = '0.7';
      const badge = card.querySelector('.priority-badge');
      if (badge) badge.style.opacity = '0.7';
    } else {
      titleEl.style.textDecoration = 'none';
      titleEl.style.opacity = '1';
      const badge = card.querySelector('.priority-badge');
      if (badge) badge.style.opacity = '1';
    }
    
    updateCardActions(card, originalStage);
    recalculateStats();
  }
}


const boardColumns = document.querySelectorAll('.board-column');
boardColumns.forEach(column => {
  column.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-task-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const moveLeftBtn = e.target.closest('.move-left-btn');
    const moveRightBtn = e.target.closest('.move-right-btn');

    
    if (editBtn) {
      const id = editBtn.dataset.id;
      const title = editBtn.dataset.title;
      const description = editBtn.dataset.description;
      const stage = editBtn.dataset.stage;
      const priority = editBtn.dataset.priority;
      const due = editBtn.dataset.due;

      document.getElementById('modal-title').innerText = 'Edit Task';
      document.getElementById('save-btn-text').innerText = 'Save';
      document.getElementById('task-id').value = id;
      document.getElementById('task-title-input').value = title;
      document.getElementById('task-desc-input').value = description || '';
      document.getElementById('task-stage-input').value = stage;
      
      
      taskForm.querySelector(`input[name="priority"][value="${priority}"]`).checked = true;
      
      
      document.getElementById('task-due-input').value = due || '';

      taskModal.style.display = 'flex';
      return;
    }

    
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const card = deleteBtn.closest('.task-card');
      if (!confirm('Are you sure you want to delete this task?')) return;

      
      card.style.display = 'none';
      recalculateStats();

      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete task');
        }

        showToast('Task deleted successfully', 'success');
        card.remove();
        recalculateStats();
      } catch (err) {
        
        showToast(err.message, 'error');
        card.style.display = 'block';
        recalculateStats();
      }
      return;
    }

    
    if (moveLeftBtn || moveRightBtn) {
      const btn = moveLeftBtn || moveRightBtn;
      const card = btn.closest('.task-card');
      const targetStage = btn.dataset.target;
      
      updateTaskStageOptimistically(card, targetStage);
      return;
    }
  });
});


if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('task-title-input').value.trim();
    const description = document.getElementById('task-desc-input').value.trim();
    const stage = document.getElementById('task-stage-input').value;
    const priority = taskForm.querySelector('input[name="priority"]:checked').value;
    const dueDate = document.getElementById('task-due-input').value;
    const submitBtn = taskForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerText;

    if (!title) {
      return showToast('Task title is required.', 'error');
    }

    setBtnLoading(submitBtn, true);

    const isEditing = !!taskId;
    const url = isEditing ? `/api/tasks/${taskId}` : '/api/tasks';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, stage, priority, dueDate })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Operation failed');
      }

      showToast(isEditing ? 'Task updated successfully' : 'Task created successfully', 'success');
      hideModal();
      
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      showToast(err.message, 'error');
      setBtnLoading(submitBtn, false, btnText);
    }
  });
}


let draggedCard = null;

const taskCards = document.querySelectorAll('.task-card');
const dropLists = document.querySelectorAll('.task-list');

taskCards.forEach(card => {
  card.addEventListener('dragstart', (e) => {
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedCard = null;
    dropLists.forEach(list => list.classList.remove('task-list-drag-over'));
  });
});

dropLists.forEach(list => {
  const column = list.closest('.board-column');
  const targetStage = column.dataset.stage;

  list.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required to allow drop
    list.classList.add('task-list-drag-over');
  });

  list.addEventListener('dragleave', () => {
    list.classList.remove('task-list-drag-over');
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    list.classList.remove('task-list-drag-over');

    const id = e.dataTransfer.getData('text/plain') || (draggedCard ? draggedCard.dataset.id : null);
    if (!id) return;

    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (!card) return;

   
    updateTaskStageOptimistically(card, targetStage);
  });
});
