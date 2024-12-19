// Utility functions for notifications and events
export function updateNotificationBell() {
  const notificationCount = document.getElementById('notification-count');
  if (!notificationCount) return;
  
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const unreadNotifications = notifications.filter(notification => !notification.read);
  notificationCount.textContent = unreadNotifications.length;
}

export function showNotifications() {
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const notificationsList = document.getElementById('notifications-list');
  const modal = document.getElementById('notification-modal');
  
  if (!notificationsList || !modal) return;

  notificationsList.innerHTML = notifications
    .map(notification => `
      <li class="${notification.read ? 'read' : 'unread'}">
        ${notification.message}
      </li>
    `)
    .join('');

  modal.style.display = 'block';

  if (notifications.some(notification => !notification.read)) {
    notifications.forEach(notification => notification.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBell();
  }
}

export function markAllAsRead() {
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const modal = document.getElementById('notification-modal');
  
  notifications.forEach(notification => notification.read = true);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  updateNotificationBell();
  
  if (modal) {
    modal.style.display = 'none';
  }
}

export function viewEvent(eventIndex) {
  localStorage.setItem('currentEventIndex', eventIndex);
  window.location.href = 'event-details.html';
}