# Google Calendar Clone

A high-fidelity fullstack clone of Google Calendar with interactive UI and backend functionality.

## Features

- **Multiple Calendar Views**: Monthly, weekly, and daily views
- **Event Management**: Create, edit, and delete events
- **Interactive UI**: Smooth transitions and Google Calendar-like interface
- **Responsive Design**: Works on various screen sizes
- **Backend API**: RESTful API for event management

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- date-fns for date manipulation

### Backend
- Node.js with Express
- MongoDB for data storage
- Mongoose for object modeling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd google-calendar-clone
```

2. Install dependencies for both frontend and backend
```
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/calendar
```

4. Start the backend server
```
cd backend
npm start
```

5. Start the frontend development server
```
cd frontend
npm start
```

6. Open your browser and navigate to `http://localhost:3000`

## Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, using a component-based architecture:

- **App.tsx**: Main component that manages state and renders the calendar
- **Header.tsx**: Navigation controls and view switching
- **Sidebar.tsx**: Mini calendar and calendar list
- **CalendarView.tsx**: Renders different calendar views (month, week, day)
- **EventModal.tsx**: Modal for creating and editing events

### Backend Architecture

The backend follows a RESTful API design:

- **server.js**: Entry point for the Express server, handles MongoDB connection and middleware setup
- **models/Event.js**: Mongoose schema for events with validation and default values
- **routes/events.js**: API endpoints for event CRUD operations:
  - `GET /api/events` - Fetch all events
  - `GET /api/events/range?start=&end=` - Fetch events in date range
  - `GET /api/events/:id` - Fetch single event
  - `POST /api/events` - Create new event
  - `PUT /api/events/:id` - Update event
  - `DELETE /api/events/:id` - Delete event

### Frontend-Backend Integration

The frontend communicates with the backend through a dedicated API service layer:

- **services/api.ts**: Centralized API client with:
  - Type-safe event interfaces
  - Automatic date serialization/deserialization
  - Error handling and type conversion
  - Support for both `_id` (MongoDB) and `id` (frontend) formats

The integration includes:
- Automatic data fetching on component mount
- Optimistic UI updates with error rollback
- Loading states during API operations
- User-friendly error messages for failed operations

## Business Logic

### Event Management

- Events can be created, edited, and deleted
- Events have title, description, start/end times, and color
- All-day events are supported
- Events can be viewed in different calendar views

### Edge Cases Handled

- **Event Overlap**: Events that overlap are displayed properly in all views with proper z-indexing and positioning
- **Date Range Queries**: Efficient querying of events by date range using MongoDB queries that handle partial overlaps
- **View Transitions**: Smooth transitions between different calendar views with proper state management
- **Date Navigation**: Easy navigation between months, weeks, and days with proper date calculation handling
- **API Error Handling**: Graceful error handling when backend is unavailable, with user-friendly error messages
- **Loading States**: Proper loading indicators during API calls to prevent UI flickering
- **Date Formatting**: Consistent date handling across different timezones using ISO format for API communication
- **Event Validation**: Frontend and backend validation for required fields (title, start, end dates)
- **Idempotent Operations**: Safe retry mechanisms for failed API calls
- **Empty States**: Proper handling when no events exist in the calendar

## Animations and Interactions

The application implements smooth, Google Calendar-like animations and interactions throughout:

### View Transitions
- **Fade Transitions**: When switching between month, week, and day views, a smooth fade animation (300ms) is applied using Material-UI's `Fade` component. This provides a polished, professional feel similar to Google Calendar.
- **View Key System**: A view key system ensures smooth re-rendering when switching views, preventing jarring transitions.

### Event Interactions
- **Hover Effects**: All events have interactive hover states:
  - **Month View**: Events slide slightly to the right (`translateX(2px)`) with a shadow on hover
  - **Week/Day View**: Events scale up slightly (`scale(1.02)`) with enhanced shadow for depth
  - All hover effects use CSS transitions with `ease-in-out` timing (0.2s duration)
- **Click Interactions**: Events are fully clickable across all views to open the edit modal
- **Button Animations**: Navigation buttons and view toggle buttons have subtle hover animations (translateY on hover)

### Modal Animations
- Material-UI's Dialog component provides built-in smooth open/close animations
- Modal appears with a fade and scale animation, matching Material Design guidelines

### Loading States
- Smooth loading spinner appears when fetching events from the API
- Fade-in animation for calendar content once data is loaded

### Technical Implementation
- CSS transitions: `transition: 'all 0.2s ease-in-out'` for consistent timing
- Material-UI transitions: Custom theme configuration with optimized duration values
- React key prop: Used strategically to trigger animations on view changes
- Transform properties: Used for performance-optimized animations (GPU accelerated)

All animations follow Google Calendar's design principles: subtle, fast, and purposeful.


## License

This project is licensed under the MIT License - see the LICENSE file for details.