import { formatDate } from '../../utils/dateUtils.js';
import { eventService } from './eventService.js';

export function initializeEventDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) return;

  const event = eventService.getEvent(eventId);
  if (!event) return;

  const nameElement = document.getElementById('event-name');
  const dateElement = document.getElementById('event-date');
  const descriptionElement = document.getElementById('event-description');
  const imageElement = document.getElementById('event-image');

  if (nameElement) nameElement.textContent = event.name;
  if (dateElement) dateElement.textContent = `Event Date: ${formatDate(event.date)}`;
  if (descriptionElement) descriptionElement.textContent = event.description;
  
  if (imageElement && event.imageUrl) {
    imageElement.src = event.imageUrl;
    imageElement.alt = event.name;
    imageElement.classList.remove('hidden');
  }
}