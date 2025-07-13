# Public Census Management System

A comprehensive web application for managing census data collection, built with React, Firebase, and Material-UI.

## Features

### Authentication & User Management
- **Secure Authentication**: Firebase Authentication with email/password
- **Role-based Access Control**: Admin and Census Officer roles
- **User Registration**: Self-registration with role selection
- **Account Management**: User profile management and account status tracking

### Census Data Collection
- **Comprehensive Forms**: Detailed census data collection forms
- **Data Validation**: Client-side and server-side validation
- **Household Management**: Track household members and relationships
- **Location Tracking**: County, sub-county, and ward selection
- **Disability Information**: Capture disability data with proper categorization

### Analytics & Reporting
- **Real-time Analytics**: Interactive charts and visualizations
- **Data Insights**: Gender, age, education, employment distributions
- **Geographic Analysis**: County-wise data breakdown
- **Enumerator Performance**: Track enumerator productivity

### Administrative Features
- **Dashboard Overview**: Key metrics and statistics
- **Enumerator Management**: Add, edit, and manage census officers
- **Data Reports**: Detailed census data reports with filtering
- **System Settings**: Application configuration and preferences

## Technical Improvements Made

### Authentication System
- ✅ Removed test data and setup functions
- ✅ Implemented proper user registration with Firestore integration
- ✅ Added comprehensive error handling for authentication flows
- ✅ Enhanced password validation and security
- ✅ Added user account status tracking (active/inactive)
- ✅ Improved login/logout flow with proper state management

### Data Management
- ✅ Replaced mock data with real Firestore data
- ✅ Added comprehensive data validation before saving
- ✅ Implemented proper error handling for all database operations
- ✅ Added server-side validation for census data
- ✅ Enhanced data structure with timestamps and metadata

### Error Handling & User Experience
- ✅ Added comprehensive error boundaries
- ✅ Implemented retry mechanisms for failed operations
- ✅ Added loading states and progress indicators
- ✅ Enhanced user feedback with success/error messages
- ✅ Improved form validation with real-time feedback

### Security & Performance
- ✅ Added input sanitization and validation
- ✅ Implemented proper Firebase security rules
- ✅ Added network error handling
- ✅ Enhanced data fetching with proper error recovery
- ✅ Added analytics tracking for user actions

## Technology Stack

- **Frontend**: React 18, Material-UI 5
- **Backend**: Firebase (Authentication, Firestore, Analytics)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Recharts
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Public-Census-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Analytics (optional)
   - Update the Firebase configuration in `src/firebase.js`

4. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Census data collection
       match /census_data/{document} {
         allow read, write: if request.auth != null;
       }
       
       // Enumerators collection
       match /enumerators/{document} {
         allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Usage

### For Administrators
1. Register an account with "Administrator" role
2. Access the admin dashboard to view analytics and reports
3. Manage census officers and system settings
4. Monitor census data collection progress

### For Census Officers
1. Register an account with "Census Officer" role
2. Access the census form to collect data
3. Submit completed census forms
4. View personal submission history

## Data Structure

### User Document (users/{userId})
```javascript
{
  email: string,
  role: 'admin' | 'census-officer',
  displayName: string,
  createdAt: timestamp,
  isActive: boolean,
  lastUpdated: timestamp
}
```

### Census Data Document (census_data/{documentId})
```javascript
{
  firstName: string,
  lastName: string,
  idNumber: string,
  dateOfBirth: string,
  gender: string,
  maritalStatus: string,
  county: string,
  subCounty: string,
  ward: string,
  education: string,
  employment: string,
  occupation: string,
  householdSize: number,
  householdMembers: array,
  hasDisability: string,
  disabilityType: string,
  enumeratorId: string,
  submittedAt: timestamp,
  status: string,
  lastUpdated: timestamp
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 