export function initializeEventDetails() {
  const eventIndex = localStorage.getItem('currentEventIndex');
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events[eventIndex];

  if (event) {
    const nameElement = document.getElementById('event-name');
    const dateElement = document.getElementById('event-date');
    const descriptionElement = document.getElementById('event-description');
    const imageElement = document.getElementById('event-image');

    if (nameElement) nameElement.textContent = event.name;
    if (dateElement) dateElement.textContent = `Event Date: ${event.date}`;
    if (descriptionElement) descriptionElement.textContent = event.description;
    
    // Display event image if available
    if (imageElement && event.imageUrl) {
      imageElement.src = event.imageUrl;
      imageElement.alt = event.name;
      imageElement.classList.remove('hidden');
    }
  }
}