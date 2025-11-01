import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography, Paper, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const drawerWidth = 256;

interface SidebarProps {
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;
  activeColors?: string[];
  onToggleColor?: (color: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentDate = new Date(), onDateSelect, activeColors = ['#4285F4','#0B8043','#8E24AA','#DB4437'], onToggleColor }) => {
  
  const [visibleDate, setVisibleDate] = useState<Date>(currentDate);
  const monthStart = startOfMonth(visibleDate);
  const monthEnd = endOfMonth(visibleDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  
  const handleDateClick = (day: Date) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  
  const renderMiniCalendar = () => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <IconButton size="small" onClick={() => setVisibleDate(new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1))}>
            <ChevronLeft fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {format(visibleDate, 'MMMM yyyy')}
          </Typography>
          <IconButton size="small" onClick={() => setVisibleDate(new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1))}>
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {dayNames.map((day, index) => (
            <Box 
              key={`header-${index}`} 
              sx={{ 
                textAlign: 'center', 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {day}
            </Box>
          ))}
          
          {days.map((day, index) => (
            <Box 
              key={`day-${index}`} 
              sx={{ 
                textAlign: 'center',
                p: 0.5,
                borderRadius: '50%',
                backgroundColor: isSameDay(day, currentDate) ? 'primary.main' : 'transparent',
                color: isSameDay(day, currentDate) ? 'white' : 'text.primary',
                border: isSameDay(day, new Date()) && !isSameDay(day, currentDate) ? '1px solid #1a73e8' : 'none',
                fontSize: '0.875rem',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 0.1)'
                }
              }}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </Box>
          ))}
        </Box>
      </Paper>
    );
  };

  const calendars = [
    { name: 'My Calendar', color: '#4285F4' },
    { name: 'Work', color: '#0B8043' },
    { name: 'Personal', color: '#8E24AA' },
    { name: 'Family', color: '#DB4437' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
          p: 2
        },
      }}
    >
      {renderMiniCalendar()}
      
      <Typography variant="subtitle2" sx={{ pl: 2, mb: 1, color: 'text.secondary', fontWeight: 'bold' }}>
        MY CALENDARS
      </Typography>
      
      <List dense>
        {calendars.map((cal) => {
          const active = activeColors?.includes(cal.color);
          return (
            <ListItem 
              key={cal.name} 
              sx={{ borderRadius: 1, py: 0.5, cursor: 'pointer' }}
              onClick={() => onToggleColor && onToggleColor(cal.color)}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  mr: 2,
                  backgroundColor: cal.color,
                  opacity: active ? 1 : 0.3,
                  border: active ? 'none' : '1px solid #ccc'
                }} 
              />
              <ListItemText primary={cal.name} sx={{ color: active ? 'text.primary' : 'text.disabled' }} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;