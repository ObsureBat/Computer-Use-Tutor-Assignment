const API_BASE_URL = 'http://localhost:5000/api';

export interface CalendarEvent {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  start: Date | string;
  end: Date | string;
  color: string;
  allDay: boolean;
}


const convertEvent = (event: any): CalendarEvent => {
  const eventId = event._id || event.id || '';
  return {
    id: eventId,
    _id: eventId,
    title: event.title,
    description: event.description || '',
    start: new Date(event.start),
    end: new Date(event.end),
    color: event.color || '#4285F4',
    allDay: event.allDay || false
  };
};


export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.map(convertEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};


export const fetchEventsByRange = async (start: Date, end: Date): Promise<CalendarEvent[]> => {
  try {
    const startISO = start.toISOString();
    const endISO = end.toISOString();
    const response = await fetch(`${API_BASE_URL}/events/range?start=${startISO}&end=${endISO}`);
    if (!response.ok) throw new Error('Failed to fetch events by range');
    const data = await response.json();
    return data.map(convertEvent);
  } catch (error) {
    console.error('Error fetching events by range:', error);
    throw error;
  }
};


export const createEvent = async (event: Omit<CalendarEvent, 'id' | '_id'>): Promise<CalendarEvent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        start: event.start instanceof Date ? event.start.toISOString() : event.start,
        end: event.end instanceof Date ? event.end.toISOString() : event.end,
      }),
    });
    if (!response.ok) throw new Error('Failed to create event');
    const data = await response.json();
    return convertEvent(data);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};


export const updateEvent = async (id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        start: event.start instanceof Date ? event.start.toISOString() : event.start,
        end: event.end instanceof Date ? event.end.toISOString() : event.end,
      }),
    });
    if (!response.ok) throw new Error('Failed to update event');
    const data = await response.json();
    return convertEvent(data);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};


export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

