import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress, Alert, Fade } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import EventModal from './components/EventModal';
import * as api from './services/api';
import type { CalendarEvent as ApiCalendarEvent } from './services/api';
import './App.css';


export type ViewType = 'month' | 'week' | 'day';


export interface CalendarEvent extends Omit<ApiCalendarEvent, 'id' | '_id' | 'start' | 'end'> {
  id: string;
  _id?: string;
  start: Date;
  end: Date;
}


const getEventId = (event: CalendarEvent): string => {
  return event.id || event._id || '';
};

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewKey, setViewKey] = useState<number>(0); 
  const [activeColors, setActiveColors] = useState<string[]>(['#4285F4','#0B8043','#8E24AA','#DB4437']);
  
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1a73e8', 
      },
      secondary: {
        main: '#e67c73', 
      },
      background: {
        default: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

  
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await api.fetchEvents();
      
      const eventsWithId: CalendarEvent[] = fetchedEvents.map(event => ({
        ...event,
        id: event.id || event._id || '',
        start: event.start instanceof Date ? event.start : new Date(event.start),
        end: event.end instanceof Date ? event.end : new Date(event.end),
      }));
      setEvents(eventsWithId);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Failed to load events. Please check if the backend server is running.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    setViewKey(prev => prev + 1);
  }, [view]);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventModalOpen(true);
  };

  const handleToggleColor = (color: string) => {
    setActiveColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (eventData: CalendarEvent) => {
    try {
      setError(null);
      const eventId = selectedEvent ? getEventId(selectedEvent) : null;
      if (selectedEvent && eventId) {
        
        const updated = await api.updateEvent(eventId, eventData);
        const updatedEvent: CalendarEvent = {
          ...updated,
          id: updated.id || updated._id || '',
          start: updated.start instanceof Date ? updated.start : new Date(updated.start),
          end: updated.end instanceof Date ? updated.end : new Date(updated.end),
        };
        setEvents(events.map(event => 
          (getEventId(event) === eventId) ? updatedEvent : event
        ));
      } else {
        
        const newEvent = await api.createEvent({
          title: eventData.title,
          description: eventData.description,
          start: eventData.start,
          end: eventData.end,
          color: eventData.color,
          allDay: eventData.allDay
        });
        const newEventWithId: CalendarEvent = {
          ...newEvent,
          id: newEvent.id || newEvent._id || '',
          start: newEvent.start instanceof Date ? newEvent.start : new Date(newEvent.start),
          end: newEvent.end instanceof Date ? newEvent.end : new Date(newEvent.end),
        };
        setEvents([...events, newEventWithId]);
      }
      setEventModalOpen(false);
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const eventId = getEventId(selectedEvent);
      if (eventId) {
        try {
          setError(null);
          await api.deleteEvent(eventId);
          setEvents(events.filter(event => getEventId(event) !== eventId));
          setEventModalOpen(false);
        } catch (err) {
          console.error('Failed to delete event:', err);
          setError('Failed to delete event. Please try again.');
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Header 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate}
          view={view}
          setView={setView}
          onCreateEvent={handleCreateEvent}
        />
         <Sidebar 
           currentDate={currentDate}
           onDateSelect={(date) => setCurrentDate(date)}
           activeColors={activeColors}
           onToggleColor={handleToggleColor}
         />
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 8, position: 'relative' }}>
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000 }}
            >
              {error}
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Fade in={!loading} key={viewKey} timeout={300}>
              <Box sx={{ height: '100%' }}>
                <CalendarView 
                  currentDate={currentDate}
                  view={view}
                  events={events.filter(e => activeColors.includes(e.color))}
                  onEventClick={handleEventClick}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>

      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        event={selectedEvent || undefined}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </ThemeProvider>
  );
}

export default App;
