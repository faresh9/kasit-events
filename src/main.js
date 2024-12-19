import { auth } from './modules/auth.js';
import { eventService } from './modules/events/index.js';
import { notificationService } from './modules/notifications.js';
import { imageUploadService } from './modules/imageUpload.js';
import { initializeDashboard } from './modules/dashboard.js';
import { initializeEventDetails } from './modules/events/eventDetails.js';

// Initialize the application
function initializeApp() {
  const currentPath = window.location.pathname;

  // Handle login form
  const loginForm = document.getElementById('authForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('errorMessage');
      
      try {
        await auth.login(email, password);
        window.location.href = '/dashboard.html';
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
      }
    });
  }

  // Initialize event creation form
  const createEventForm = document.getElementById('createEventForm');
  if (createEventForm) {
    createEventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const formData = new FormData(createEventForm);
        const imageFile = formData.get('eventImage');
        
        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
          imageUrl = await imageUploadService.uploadImage(imageFile);
        }

        const eventData = {
          name: formData.get('eventName'),
          date: formData.get('eventDate'),
          description: formData.get('eventDescription'),
          capacity: parseInt(formData.get('eventCapacity')),
          imageUrl
        };

        const event = await eventService.createEvent(eventData);
        window.location.href = '/dashboard.html';
      } catch (error) {
        alert('Failed to create event: ' + error.message);
      }
    });
  }

  // Initialize page-specific functionality
  switch (currentPath) {
    case '/dashboard.html':
      initializeDashboard();
      break;
    case '/event-details.html':
      initializeEventDetails();
      break;
  }
}

// Global app namespace
window.app = {
  reserveSpot: async (eventId) => {
    try {
      await eventService.reserveSpot(eventId);
      initializeDashboard(); // Refresh the dashboard
      notificationService.create({
        type: 'INFO',
        message: 'Spot reserved successfully!'
      });
    } catch (error) {
      alert(error.message);
    }
  },
  showNotifications: () => {
    const modal = document.getElementById('notification-modal');
    if (modal) {
      modal.classList.remove('hidden');
      notificationService.displayNotifications();
    }
  },
  markAllAsRead: () => {
    notificationService.markAllAsRead();
    const modal = document.getElementById('notification-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 