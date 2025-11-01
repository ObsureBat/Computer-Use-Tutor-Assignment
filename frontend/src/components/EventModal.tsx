import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Box,
  Stack
} from '@mui/material';
import { Close, AccessTime, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { CalendarEvent } from '../App';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onDelete?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  event,
  onSave,
  onDelete
}) => {
  const isNewEvent = !event?.id;
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start: event?.start ? format(event.start, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end: event?.end ? format(event.end, "yyyy-MM-dd'T'HH:mm") : format(new Date(Date.now() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    allDay: event?.allDay || false,
    color: event?.color || '#4285F4'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData: CalendarEvent = {
      id: event?.id || event?._id || '', 
      ...(event?._id && { _id: event._id }), 
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end)
    };
    onSave(eventData);
    onClose();
  };

  const colorOptions = [
    { color: '#4285F4', label: 'Blue' },
    { color: '#0B8043', label: 'Green' },
    { color: '#8E24AA', label: 'Purple' },
    { color: '#DB4437', label: 'Red' },
    { color: '#F4B400', label: 'Yellow' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <span>{isNewEvent ? 'Add Event' : 'Edit Event'}</span>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              name="title"
              placeholder="Add title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              autoFocus
              InputProps={{
                sx: { fontSize: '1.2rem', fontWeight: 500 }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                name="start"
                label="Start"
                type="datetime-local"
                value={formData.start}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                name="end"
                label="End"
                type="datetime-local"
                value={formData.end}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="All day"
            />
            
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {colorOptions.map((option) => (
                  <Box
                    key={option.color}
                    onClick={() => setFormData({ ...formData, color: option.color })}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: option.color,
                      cursor: 'pointer',
                      border: formData.color === option.color ? '2px solid #000' : 'none',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          {!isNewEvent && (
            <Button
              startIcon={<Delete />}
              onClick={onDelete}
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          )}
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventModal;