import { getItem, setItem } from '../utils/storageUtils.js';
import { formatDate } from '../utils/dateUtils.js';

export class NotificationService {
  constructor() {
    this.notifications = getItem('notifications') || [];
  }

  create(notification) {
    const newNotification = {
      id: crypto.randomUUID(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this._saveNotifications();
    this._updateBadge();
    
    this._showPushNotification(newNotification);
  }

  getAll() {
    return this.notifications;
  }

  getUnread() {
    return this.notifications.filter(n => !n.read);
  }

  displayNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;

    notificationsList.innerHTML = this.notifications
      .map(notification => `
        <li class="notification-item ${notification.read ? '' : 'unread'}">
          <p class="notification-message">${notification.message}</p>
          <small class="notification-time">${formatDate(notification.timestamp)}</small>
        </li>
      `)
      .join('');
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this._saveNotifications();
      this._updateBadge();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this._saveNotifications();
    this._updateBadge();
  }

  _saveNotifications() {
    setItem('notifications', this.notifications);
  }

  _updateBadge() {
    const unreadCount = this.getUnread().length;
    const badge = document.getElementById('notification-count');
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
  }

  async _showPushNotification(notification) {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        new Notification('University Events', {
          body: notification.message,
          icon: '/public/notification-icon.png'
        });
      }
    }
  }
}

export const notificationService = new NotificationService();