# Location-Based Attendance Web App

A responsive web application that enables location-based attendance tracking with Google Login authentication. Students can only log in when within a permitted location range, and teachers can manage 5-minute attendance sessions.

## Features

- **Location Verification**: Checks user location before allowing login
- **Google OAuth Authentication**: Secure login with Google accounts
- **Role-Based Dashboards**: Separate interfaces for teachers and students
- **Teacher Features**:
  - Start 5-minute attendance sessions
  - Real-time countdown timer
  - Auto-submit attendance data
  - Timer persists across page refreshes
- **Student Features**:
  - Automatic attendance marking upon login
  - Real-time status confirmation
- **Modern UI**: Clean, responsive design with animations
- **Toast Notifications**: User-friendly feedback for all actions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Authentication**: Google OAuth (@react-oauth/google)
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google OAuth

To use Google Login, you need to set up a Google OAuth Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (when deploying)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain (when deploying)
8. Copy the Client ID

### 3. Update the Client ID

Open `src/App.tsx` and replace the placeholder with your Google Client ID:

```typescript
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
```

### 4. Configure Backend API (Optional)

The app currently uses placeholder API functions. To connect to a real backend:

1. Open `src/services/api.ts`
2. Update `API_BASE_URL` with your backend URL
3. Replace the placeholder implementations with actual `fetch` calls

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

### Flow

1. **Location Check**: User visits the site and is prompted for location access
2. **Location Verification**: Coordinates are sent to backend for verification
3. **Login**: If location is approved, Google Login button appears
4. **Role Detection**: After login, user role is determined by email domain
5. **Dashboard**: User is redirected to Teacher or Student dashboard

### Teacher Workflow

1. Click "Start Attendance" button
2. 5-minute countdown begins
3. Timer persists even if page is refreshed
4. When timer ends, attendance data is automatically sent
5. Confirmation message is displayed

### Student Workflow

1. Upon successful login, attendance is automatically marked
2. Student sees confirmation with their details
3. Attendance data includes location coordinates

## API Endpoints (Placeholder)

The following endpoints need to be implemented in your backend:

- `POST /api/checkLocation` - Verify if coordinates are in allowed range
  - Body: `{ lat: number, lng: number }`
  - Response: `{ allowed: boolean, message?: string }`

- `POST /api/checkUserRole` - Determine user role
  - Body: `{ email: string }`
  - Response: `{ role: 'teacher' | 'student', email: string }`

- `POST /api/markAttendance` - Mark student attendance
  - Body: `{ studentEmail: string, lat: number, lng: number }`
  - Response: `{ success: boolean, message?: string }`

- `POST /api/sendAttendance` - Send attendance report to teacher
  - Body: `{ teacherEmail: string }`
  - Response: `{ success: boolean, message?: string }`

## Configuration

### Teacher Email Domain

By default, emails containing "teacher" or ending with "@school.edu" are identified as teachers. Update this logic in `src/services/api.ts`:

```typescript
const isTeacher = email.endsWith('@school.edu') || email.includes('teacher');
```

### Attendance Duration

The default attendance session is 5 minutes (300 seconds). To change this, update `src/pages/TeacherDashboard.tsx`:

```typescript
const duration = 300; // Change to desired seconds
```

### Location Check Logic

Modify the location verification logic in `src/services/api.ts` to implement your specific geographic constraints.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Browser Support

- Modern browsers with Geolocation API support
- JavaScript enabled
- Location services enabled

## Security Notes

- Location data is only used for verification
- Google OAuth handles secure authentication
- Session data is stored in localStorage
- Replace placeholder APIs with secure backend endpoints in production

## Troubleshooting

### Location Access Denied
- Check browser permissions
- Ensure HTTPS is used (required for geolocation in production)
- Enable location services on the device

### Google Login Not Working
- Verify Client ID is correct
- Check authorized origins/redirect URIs in Google Console
- Ensure domain is added to authorized origins

### Timer Not Persisting
- Check browser localStorage is enabled
- Verify no browser extensions are blocking storage

## License

MIT
