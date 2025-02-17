# Readr 📚

## Project Vision
Readr is a mobile application designed to cultivate healthy reading habits by:
- Tracking reading projects and progress
- Setting and monitoring reading goals
- Encouraging focused reading through app blocking features
- Limiting access to distracting social media applications

The app aims to help users build and maintain consistent reading habits while reducing digital distractions.

## Current Implementation Status

### Core Features Implemented
1. **Book Management**
   - Add new books with detailed information
   - View list of all books in progress
   - Edit existing book details
   - Delete books from reading list

2. **Reading Planning**
   - Set number of pages for each book
   - Choose reading deadline
   - Select specific days of the week for reading
   - Automatic calculation of pages per day (PPD)
   - Manual adjustment of PPD with deadline recalculation

3. **Data Persistence**
   - Local storage of all book data
   - Persistent state management across app sessions

### Technical Architecture
1. **Navigation**
   - File-based routing using Expo Router
   - Multi-step book addition flow
   - Main dashboard with book list

2. **State Management**
   - Global book context for state sharing
   - Completion status tracking for multi-step forms
   - Async storage integration for persistence

3. **User Interface**
   - Dark theme implementation
   - Responsive layout design
   - Interactive book cards
   - Form validation and error handling

### Pending Features
1. **Social Media Blocking**
   - App blocking functionality
   - Focus mode implementation
   - Distraction limiting features

2. **Progress Tracking**
   - Daily reading progress
   - Achievement system
   - Reading statistics

3. **Social Features**
   - Reading groups
   - Progress sharing
   - Community challenges
