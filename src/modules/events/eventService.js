import { getItem, setItem } from '../../utils/storageUtils.js';
import { validateEventData } from '../../utils/validationUtils.js';
import { notificationService } from '../notifications.js';

class EventService {
  constructor() {
    this.events = getItem('events') || [];
  }

  createEvent(eventData) {
    const errors = validateEventData(eventData);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    const newEvent = {
      id: crypto.randomUUID(),
      ...eventData,
      createdAt: new Date().toISOString(),
      attendees: []
    };

    this.events.push(newEvent);
    this._saveEvents();
    
    notificationService.create({
      type: 'EVENT_CREATED',
      message: `New event "${eventData.name}" has been created`,
      eventId: newEvent.id
    });

    return newEvent;
  }

  getEvents() {
    return this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getEvent(id) {
    return this.events.find(event => event.id === id);
  }

  reserveSpot(eventId) {
    const event = this.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) throw new Error('Authentication required');

    if (event.attendees.length >= event.capacity) {
      throw new Error('Event is full');
    }

    if (event.attendees.includes(currentUser.email)) {
      throw new Error('Already registered for this event');
    }

    event.attendees.push(currentUser.email);
    this._saveEvents();

    notificationService.create({
      type: 'EVENT_REGISTRATION',
      message: `You have successfully registered for "${event.name}"`,
      eventId: event.id
    });

    return event;
  }

  _saveEvents() {
    setItem('events', this.events);
  }
}

export const eventService = new EventService();