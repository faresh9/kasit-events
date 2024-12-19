import { eventService } from './events/index.js';
import { formatDate } from '../utils/dateUtils.js';
import { auth } from './auth.js';

export function initializeDashboard() {
  const eventsList = document.getElementById('events-list');
  if (!eventsList) return;

  const events = eventService.getEvents();
  const currentUser = auth.getCurrentUser();

  if (events.length === 0) {
    eventsList.innerHTML = '<p class="text-center">No events found. Create one!</p>';
    return;
  }

  eventsList.innerHTML = events.map(event => `
    <div class="event-card">
      ${event.imageUrl ? `<img src="${event.imageUrl}" alt="${event.name}" class="event-image">` : ''}
      <h3 class="text-xl mb-1">${event.name}</h3>
      <p class="mb-1">${event.description}</p>
      <div class="flex items-center mb-1">
        <span class="mr-1">📅</span>
        <p>${formatDate(event.date)}</p>
      </div>
      <p class="mb-1">Available spots: ${event.capacity - event.attendees.length}</p>
      <div class="flex justify-between items-center">
        <button 
          onclick="window.location.href='/event-details.html?id=${event.id}'" 
          class="btn">
          View Details
        </button>
        ${currentUser && !event.attendees.includes(currentUser.email) 
          ? `<button onclick="window.app.reserveSpot('${event.id}')" class="btn">Reserve Spot</button>`
          : currentUser && event.attendees.includes(currentUser.email)
            ? '<span class="text-green-600">✓ Registered</span>'
            : ''}
      </div>
    </div>
  `).join('');
}