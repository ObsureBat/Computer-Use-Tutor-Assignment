import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  ButtonGroup
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Today,
  Add
} from '@mui/icons-material';
import { format, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';
import { ViewType } from '../App';

interface HeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
  onCreateEvent?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  setCurrentDate, 
  view, 
  setView,
  onCreateEvent
}) => {
  const handlePrevious = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderText = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 3, fontWeight: 'bold' }}>
            Google Calendar
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => onCreateEvent && onCreateEvent()}
            sx={{ 
              mr: 2, 
              borderRadius: '32px', 
              textTransform: 'none',
              boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)'
            }}
          >
            Create
          </Button>
          
          <IconButton onClick={handleToday} sx={{ mr: 1 }}>
            <Today />
          </IconButton>
          
          <IconButton onClick={handlePrevious}>
            <ChevronLeft />
          </IconButton>
          
          <IconButton onClick={handleNext} sx={{ mr: 2 }}>
            <ChevronRight />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {getHeaderText()}
          </Typography>
          
          <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
            <Button 
              onClick={() => setView('day')} 
              variant={view === 'day' ? 'contained' : 'outlined'}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Day
            </Button>
            <Button 
              onClick={() => setView('week')} 
              variant={view === 'week' ? 'contained' : 'outlined'}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Week
            </Button>
            <Button 
              onClick={() => setView('month')} 
              variant={view === 'month' ? 'contained' : 'outlined'}
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Month
            </Button>
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;