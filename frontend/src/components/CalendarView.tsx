import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addDays,
  getDay,
  startOfDay,
  endOfDay,
  addHours,
  isSameDay
} from 'date-fns';
import { ViewType, CalendarEvent } from '../App';

interface CalendarViewProps {
  currentDate: Date;
  view: ViewType;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, view, events = [], onEventClick }) => {
  
  const ensureDate = (date: Date | string): Date => {
    return date instanceof Date ? date : new Date(date);
  };

  
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    return (
      <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid #e0e0e0' 
        }}>
          {dayNames.map((day, index) => (
            <Box 
              key={index} 
              sx={{ 
                p: 1, 
                textAlign: 'center',
                borderRight: index < 6 ? '1px solid #e0e0e0' : 'none',
                fontWeight: 'medium',
                color: 'text.secondary'
              }}
            >
              {day}
            </Box>
          ))}
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          height: 'calc(100% - 40px)' 
        }}>
          {days.map((day, index) => {
            const dayEvents = events.filter(event => isSameDay(day, event.start));
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  height: '120px',
                  p: 0.5,
                  borderRight: (index + 1) % 7 !== 0 ? '1px solid #e0e0e0' : 'none',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: !isSameMonth(day, currentDate) ? '#f5f5f5' : 'transparent',
                  position: 'relative'
                }}
              >
                <Typography 
                    variant="body2" 
                    sx={{ 
                      textAlign: 'center',
                      fontWeight: isToday(day) ? 'bold' : 'normal',
                      backgroundColor: isToday(day) ? 'primary.main' : 'transparent',
                      color: isToday(day) 
                        ? 'white' 
                        : !isSameMonth(day, currentDate) 
                          ? 'text.disabled' 
                          : 'text.primary',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 0.5
                    }}
                >
                  {format(day, 'd')}
                </Typography>
                
                {dayEvents.map((event, eventIndex) => (
                  <Paper
                    key={event.id}
                    onClick={() => onEventClick && onEventClick(event)}
                    sx={{
                      p: 0.5,
                      mb: 0.5,
                      backgroundColor: event.color,
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        opacity: 0.9,
                        transform: 'translateX(2px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    {event.title}
                  </Paper>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        {}
        <Box sx={{ width: '50px', flexShrink: 0, borderRight: '1px solid #e0e0e0' }}>
          {hours.map((hour) => (
            <Box 
              key={hour} 
              sx={{ 
                height: '60px', 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                pr: 1,
                pt: 1,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </Box>
          ))}
        </Box>
        
        {}
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {weekDays.map((day, dayIndex) => (
            <Box 
              key={dayIndex} 
              sx={{ 
                flexGrow: 1, 
                width: 0,
                borderRight: dayIndex < 6 ? '1px solid #e0e0e0' : 'none'
              }}
            >
              {}
              <Box 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: isToday(day) ? '#e8f0fe' : 'transparent'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {format(day, 'EEE')}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: isToday(day) ? 'bold' : 'normal',
                    color: isToday(day) ? 'primary.main' : 'text.primary'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
              </Box>
              
              {}
              {hours.map((hour) => {
                const hourStart = addHours(startOfDay(day), hour);
                const hourEvents = events.filter(event => 
                  isSameDay(hourStart, event.start) && 
                  format(event.start, 'H') === String(hour)
                );
                
                return (
                  <Box 
                    key={hour} 
                    sx={{ 
                      height: '60px', 
                      borderBottom: '1px solid #e0e0e0',
                      position: 'relative'
                    }}
                  >
                    {hourEvents.map((event) => (
                      <Paper
                        key={event.id}
                        onClick={() => onEventClick && onEventClick(event)}
                        sx={{
                          position: 'absolute',
                          top: `${parseInt(format(event.start, 'm')) / 60 * 100}%`,
                          left: '2px',
                          right: '2px',
                          height: `${(
                            (ensureDate(event.end).getTime() - ensureDate(event.start).getTime()) / 
                            (1000 * 60 * 60) * 60
                          )}px`,
                          backgroundColor: event.color,
                          color: 'white',
                          p: 0.5,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                          zIndex: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'scale(1.02)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        {event.title}
                      </Paper>
                    ))}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        {}
        <Box sx={{ width: '50px', flexShrink: 0, borderRight: '1px solid #e0e0e0' }}>
          {hours.map((hour) => (
            <Box 
              key={hour} 
              sx={{ 
                height: '60px', 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                pr: 1,
                pt: 1,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </Box>
          ))}
        </Box>
        
        {}
        <Box sx={{ flexGrow: 1 }}>
          {hours.map((hour) => {
            const hourStart = addHours(startOfDay(currentDate), hour);
            const hourEvents = events.filter(event => 
              isSameDay(hourStart, event.start) && 
              format(event.start, 'H') === String(hour)
            );
            
            return (
              <Box 
                key={hour} 
                sx={{ 
                  height: '60px', 
                  borderBottom: '1px solid #e0e0e0',
                  position: 'relative'
                }}
              >
                {hourEvents.map((event) => (
                  <Paper
                    key={event.id}
                    onClick={() => onEventClick && onEventClick(event)}
                    sx={{
                      position: 'absolute',
                      top: `${parseInt(format(event.start, 'm')) / 60 * 100}%`,
                      left: '10px',
                      right: '10px',
                      height: `${(
                        (event.end.getTime() - event.start.getTime()) / 
                        (1000 * 60 * 60) * 60
                      )}px`,
                      backgroundColor: event.color,
                      color: 'white',
                      p: 1,
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      zIndex: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        opacity: 0.9,
                        transform: 'scale(1.02)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    {event.title}
                  </Paper>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </Box>
  );
};

export default CalendarView;