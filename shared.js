// static/js/shared.js

const API_BASE = '/api';
let currentLang = 'en';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    initNavigation();
});

// Инициализация языка
function initLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'en';
    currentLang = lang;

    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = lang;
        langSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
}

// Смена языка
function changeLanguage(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
}

// Инициализация навигации
function initNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (currentPath === '/' && href === '/dashboard')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Уведомления
function showNotification(title, message, type = 'info') {
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };

    const colorMap = {
        'success': 'var(--success)',
        'error': 'var(--error)',
        'warning': 'var(--warning)',
        'info': 'var(--info)'
    };

    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'alert alert-' + type;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--bg-card);
        border-left: 4px solid ${colorMap[type]};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    notification.innerHTML = `
        <i class="fas fa-${iconMap[type]}" style="color: ${colorMap[type]}; font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600; color: var(--text-primary);">${title}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">${message}</div>
        </div>
    `;

    document.body.appendChild(notification);

    // Удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Форматирование файлов
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        // Если не удалось распарсить, возвращаем как есть
        return dateString.length > 10 ? dateString.substring(0, 10) + '...' : dateString;
    }
}

// Проверка здоровья API
function checkHealth() {
    fetch(`${API_BASE}/health`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`HTTP ${response.status}`);
        })
        .then(data => {
            if (data.success) {
                console.log('Backend is healthy');
            } else {
                console.warn('Backend health check failed:', data.error);
            }
        })
        .catch(error => {
            console.log('Backend not available:', error.message);
        });
}
// Форматирование даты в короткий формат
function formatDateShort(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Если сегодня
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Если вчера
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        // Если в этом году
        if (date.getFullYear() === today.getFullYear()) {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
            });
        }

        // Старые даты
        return date.toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    } catch (e) {
        // Если не удалось распарсить, возвращаем как есть
        return dateString.length > 10 ? dateString.substring(0, 10) : dateString;
    }
}

// Также добавь функцию formatDateTime для полноты
function formatDateTime(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}