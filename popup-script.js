// Task Tracker Chrome Extension JavaScript
class TaskTracker {
    constructor() {
        this.tasks = [];
        this.categories = [];
        this.intervals = new Map();
        this.currentEditingTaskId = null;
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadTasks();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderCategories();
        this.populateCategorySelects();
        this.renderTasks();
        this.updateSummary();
    }

    setupEventListeners() {
        // Task form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Export CSV button
        const exportBtn = document.getElementById('exportCsv');
        exportBtn.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Clear completed tasks button
        const clearBtn = document.getElementById('clearCompleted');
        clearBtn.addEventListener('click', () => {
            this.clearCompletedTasks();
        });

        // Add category button
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        addCategoryBtn.addEventListener('click', () => {
            this.addCategory();
        });

        // Add category input (Enter key support)
        const newCategoryInput = document.getElementById('newCategoryInput');
        newCategoryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCategory();
            }
        });

        // Modal close on overlay click
        const editModal = document.getElementById('editTaskModal');
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                this.closeEditModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.currentEditingTaskId) {
                e.preventDefault();
                this.saveTaskEdit();
            }
        });

        // Edit task form submission
        const editTaskForm = document.getElementById('editTaskForm');
        editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTaskEdit();
        });

        // Event delegation for dynamic buttons
        document.addEventListener('click', (e) => {
            // Task control buttons
            if (e.target.classList.contains('btn-start')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.startTask(taskId);
            } else if (e.target.classList.contains('btn-pause')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.pauseTask(taskId);
            } else if (e.target.classList.contains('btn-done')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.completeTask(taskId);
            } else if (e.target.classList.contains('btn-edit')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.openEditModal(taskId);
            } else if (e.target.classList.contains('btn-delete')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.deleteTask(taskId);
            }
            
            // Category control buttons
            else if (e.target.classList.contains('btn-edit-category')) {
                const categoryName = e.target.closest('.category-item').querySelector('.category-name').textContent;
                this.editCategory(categoryName);
            } else if (e.target.classList.contains('btn-delete-category')) {
                const categoryName = e.target.closest('.category-item').querySelector('.category-name').textContent;
                this.deleteCategory(categoryName);
            }
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Chrome Storage Methods
    async saveToStorage(key, data) {
        try {
            await chrome.storage.local.set({ [key]: data });
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            // Fallback to localStorage for development
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    async loadFromStorage(key) {
        try {
            const result = await chrome.storage.local.get(key);
            return result[key];
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            // Fallback to localStorage for development
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        }
    }

    // Category Management Methods
    async loadCategories() {
        try {
            const saved = await this.loadFromStorage('taskTracker_categories');
            if (saved) {
                this.categories = saved;
            } else {
                // Default categories
                this.categories = [
                    { name: 'Work', isDefault: true },
                    { name: 'Personal', isDefault: true },
                    { name: 'Study', isDefault: true },
                    { name: 'Exercise', isDefault: true },
                    { name: 'Other', isDefault: true }
                ];
                await this.saveCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [
                { name: 'Work', isDefault: true },
                { name: 'Personal', isDefault: true },
                { name: 'Study', isDefault: true },
                { name: 'Exercise', isDefault: true },
                { name: 'Other', isDefault: true }
            ];
        }
    }

    async saveCategories() {
        await this.saveToStorage('taskTracker_categories', this.categories);
    }

    async addCategory() {
        const input = document.getElementById('newCategoryInput');
        const categoryName = input.value.trim();

        if (!categoryName) {
            alert('Please enter a category name');
            return;
        }

        if (this.categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
            alert('Category already exists');
            return;
        }

        this.categories.push({ name: categoryName, isDefault: false });
        await this.saveCategories();
        this.renderCategories();
        this.populateCategorySelects();
        input.value = '';
    }

    async editCategory(categoryName) {
        const newName = prompt(`Edit category name:`, categoryName);
        
        if (newName === null) return;
        
        const trimmedName = newName.trim();
        
        if (!trimmedName) {
            alert('Category name cannot be empty');
            return;
        }
        
        if (trimmedName === categoryName) return;
        
        if (this.categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert('A category with this name already exists');
            return;
        }
        
        const category = this.categories.find(cat => cat.name === categoryName);
        if (category) {
            const oldName = category.name;
            category.name = trimmedName;
            
            this.tasks.forEach(task => {
                if (task.category === oldName) {
                    task.category = trimmedName;
                }
            });
            
            await this.saveCategories();
            await this.saveTasks();
            this.renderCategories();
            this.populateCategorySelects();
            this.renderTasks();
        }
    }

    async deleteCategory(categoryName) {
        if (confirm(`Are you sure you want to delete the "${categoryName}" category? Tasks using this category will be moved to "Other".`)) {
            this.tasks.forEach(task => {
                if (task.category === categoryName) {
                    task.category = 'Other';
                }
            });

            this.categories = this.categories.filter(cat => cat.name !== categoryName || cat.isDefault);
            
            await this.saveCategories();
            await this.saveTasks();
            this.renderCategories();
            this.populateCategorySelects();
            this.renderTasks();
        }
    }

    renderCategories() {
        const categoriesList = document.getElementById('categoriesList');
        
        categoriesList.innerHTML = this.categories.map(category => `
            <div class="category-item ${category.isDefault ? 'default' : ''}">
                <span class="category-name">${this.escapeHtml(category.name)}</span>
                <div class="category-buttons">
                    <button class="btn-edit-category" title="Edit category">✏️</button>
                    ${!category.isDefault ? `<button class="btn-delete-category" title="Delete category">&times;</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    populateCategorySelects() {
        const selects = ['taskCategory', 'editTaskCategory'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const currentValue = select.value;
                select.innerHTML = this.categories.map(category => 
                    `<option value="${category.name}" ${currentValue === category.name ? 'selected' : ''}>${category.name}</option>`
                ).join('');
                
                if (!select.value && this.categories.length > 0) {
                    select.value = this.categories[0].name;
                }
            }
        });
    }

    validateTaskCategory(categoryName) {
        if (!this.categories.some(cat => cat.name === categoryName)) {
            return 'Other';
        }
        return categoryName;
    }

    async addTask() {
        const name = document.getElementById('taskName').value.trim();
        const category = document.getElementById('taskCategory').value;
        const comments = document.getElementById('taskComments').value.trim();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const task = {
            id: this.generateId(),
            name: name,
            category: category,
            comments: comments,
            status: 'not-started',
            timeSpent: 0,
            startTime: null,
            pausedTime: 0,
            createdAt: new Date().toISOString(),
            completedAt: null,
            sessions: []
        };

        this.tasks.push(task);
        await this.saveTasks();
        this.renderTasks();
        this.updateSummary();

        document.getElementById('taskForm').reset();
    }

    async startTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status === 'completed') return;

        this.tasks.forEach(t => {
            if (t.status === 'running' && t.id !== taskId) {
                this.pauseTask(t.id);
            }
        });

        task.status = 'running';
        task.startTime = Date.now();

        this.intervals.set(taskId, setInterval(() => {
            this.updateTaskTime(taskId);
        }, 1000));

        await this.saveTasks();
        this.renderTasks();
        this.updateSummary();
    }

    async pauseTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status !== 'running') return;

        task.status = 'paused';
        
        if (task.startTime) {
            const sessionTime = Date.now() - task.startTime;
            task.timeSpent += Math.floor(sessionTime / 1000);
            task.sessions.push({
                start: new Date(task.startTime).toISOString(),
                end: new Date().toISOString(),
                duration: Math.floor(sessionTime / 1000)
            });
        }

        task.startTime = null;

        if (this.intervals.has(taskId)) {
            clearInterval(this.intervals.get(taskId));
            this.intervals.delete(taskId);
        }

        await this.saveTasks();
        this.renderTasks();
        this.updateSummary();
    }

    async completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.status === 'running') {
            await this.pauseTask(taskId);
        }

        task.status = 'completed';
        task.completedAt = new Date().toISOString();

        await this.saveTasks();
        this.renderTasks();
        this.updateSummary();
    }

    async deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            if (this.intervals.has(taskId)) {
                clearInterval(this.intervals.get(taskId));
                this.intervals.delete(taskId);
            }

            this.tasks = this.tasks.filter(t => t.id !== taskId);
            await this.saveTasks();
            this.renderTasks();
            this.updateSummary();
        }
    }

    updateTaskTime(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status !== 'running') return;

        const currentTime = Math.floor((Date.now() - task.startTime) / 1000);
        const totalTime = task.timeSpent + currentTime;
        
        const timeElement = document.querySelector(`[data-task-id="${taskId}"] .task-time`);
        if (timeElement) {
            timeElement.textContent = this.formatTime(totalTime);
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            tasksList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
            return;
        }

        const sortedTasks = [...this.tasks].sort((a, b) => {
            const statusOrder = { 'running': 0, 'paused': 1, 'not-started': 2, 'completed': 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });

        tasksList.innerHTML = sortedTasks.map(task => {
            const currentTime = task.status === 'running' && task.startTime 
                ? task.timeSpent + Math.floor((Date.now() - task.startTime) / 1000)
                : task.timeSpent;

            return `
                <div class="task-item ${task.status}" data-task-id="${task.id}">
                    <div class="task-header">
                        <div class="task-info">
                            <h3>${this.escapeHtml(task.name)}</h3>
                            <span class="task-category">${task.category}</span>
                        </div>
                        <div class="task-time">${this.formatTime(currentTime)}</div>
                    </div>
                    
                    ${task.comments ? `<div class="task-comments">${this.escapeHtml(task.comments)}</div>` : ''}
                    
                    <div class="task-controls">
                        ${this.renderTaskButtons(task)}
                        <button class="btn btn-delete">Del</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Task Editing Methods
    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditingTaskId = taskId;
        
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editTaskCategory').value = task.category;
        document.getElementById('editTaskComments').value = task.comments;
        
        const modal = document.getElementById('editTaskModal');
        modal.classList.add('active');
    }

    closeEditModal() {
        const modal = document.getElementById('editTaskModal');
        modal.classList.remove('active');
        this.currentEditingTaskId = null;
        
        document.getElementById('editTaskForm').reset();
    }

    async saveTaskEdit() {
        if (!this.currentEditingTaskId) return;

        const task = this.tasks.find(t => t.id === this.currentEditingTaskId);
        if (!task) return;

        const name = document.getElementById('editTaskName').value.trim();
        const category = document.getElementById('editTaskCategory').value;
        const comments = document.getElementById('editTaskComments').value.trim();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        task.name = name;
        task.category = category;
        task.comments = comments;

        await this.saveTasks();
        this.renderTasks();
        this.closeEditModal();
    }

    renderTaskButtons(task) {
        let editButton = `<button class="btn btn-edit" title="Edit task">Edit</button>`;

        switch (task.status) {
            case 'not-started':
                return `
                    <button class="btn btn-start">Start</button>
                    ${editButton}
                `;
            
            case 'running':
                return `
                    <button class="btn btn-pause">Pause</button>
                    <button class="btn btn-done">Done</button>
                    ${editButton}
                `;
            
            case 'paused':
                return `
                    <button class="btn btn-start">Resume</button>
                    <button class="btn btn-done">Done</button>
                    ${editButton}
                `;
            
            case 'completed':
                return `
                    <span style="color: #48bb78; font-weight: 500; margin-right: 8px; font-size: 0.8rem;">✓ Done</span>
                    ${editButton}
                `;
            
            default:
                return '';
        }
    }

    updateSummary() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        let totalSeconds = 0;
        this.tasks.forEach(task => {
            if (task.status === 'running' && task.startTime) {
                totalSeconds += task.timeSpent + Math.floor((Date.now() - task.startTime) / 1000);
            } else {
                totalSeconds += task.timeSpent;
            }
        });

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('totalTime').textContent = this.formatTime(totalSeconds);
    }

    async clearCompletedTasks() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            this.tasks = this.tasks.filter(t => t.status !== 'completed');
            await this.saveTasks();
            this.renderTasks();
            this.updateSummary();
        }
    }

    exportToCSV() {
        if (this.tasks.length === 0) {
            alert('No tasks to export');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const headers = ['Task Name', 'Category', 'Status', 'Time Spent (HH:MM:SS)', 'Comments', 'Created At', 'Completed At'];
        
        let csvContent = headers.join(',') + '\n';
        
        this.tasks.forEach(task => {
            const row = [
                `"${task.name.replace(/"/g, '""')}"`,
                task.category,
                task.status,
                this.formatTime(task.timeSpent),
                `"${task.comments.replace(/"/g, '""')}"`,
                new Date(task.createdAt).toLocaleString(),
                task.completedAt ? new Date(task.completedAt).toLocaleString() : ''
            ];
            csvContent += row.join(',') + '\n';
        });

        csvContent += '\nSUMMARY\n';
        const totalTime = this.tasks.reduce((sum, task) => sum + task.timeSpent, 0);
        const completedCount = this.tasks.filter(t => t.status === 'completed').length;
        
        csvContent += `Total Tasks,${this.tasks.length}\n`;
        csvContent += `Completed Tasks,${completedCount}\n`;
        csvContent += `Total Time,${this.formatTime(totalTime)}\n`;

        // Use Chrome Downloads API if available, otherwise fallback to blob
        try {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            if (chrome && chrome.downloads) {
                chrome.downloads.download({
                    url: url,
                    filename: `task-tracker-${today}.csv`,
                    saveAs: true
                });
            } else {
                // Fallback for development
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `task-tracker-${today}.csv`);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        }
    }

    async saveTasks() {
        await this.saveToStorage('taskTracker_tasks', this.tasks);
    }

    async loadTasks() {
        try {
            const saved = await this.loadFromStorage('taskTracker_tasks');
            if (saved) {
                this.tasks = saved;
                
                this.tasks.forEach(task => {
                    task.category = this.validateTaskCategory(task.category);
                });
                
                this.tasks.forEach(task => {
                    if (task.status === 'running') {
                        this.intervals.set(task.id, setInterval(() => {
                            this.updateTaskTime(task.id);
                        }, 1000));
                    }
                });
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
    }
}

// Initialize the task tracker when the DOM loads
let taskTracker;

document.addEventListener('DOMContentLoaded', () => {
    taskTracker = new TaskTracker();
    
    setInterval(() => {
        if (taskTracker) {
            taskTracker.updateSummary();
        }
    }, 5000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (taskTracker) {
        taskTracker.tasks.forEach(task => {
            if (task.status === 'running') {
                taskTracker.pauseTask(task.id);
            }
        });
        taskTracker.destroy();
    }
});