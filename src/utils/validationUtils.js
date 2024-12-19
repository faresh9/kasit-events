export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateEventData = (eventData) => {
  const errors = [];
  
  if (!eventData.name?.trim()) {
    errors.push('Event name is required');
  }
  
  if (!eventData.date) {
    errors.push('Event date is required');
  } else if (new Date(eventData.date) < new Date()) {
    errors.push('Event date cannot be in the past');
  }
  
  if (!eventData.description?.trim()) {
    errors.push('Event description is required');
  }
  
  if (eventData.capacity && (isNaN(eventData.capacity) || eventData.capacity < 1)) {
    errors.push('Event capacity must be a positive number');
  }
  
  return errors;
};