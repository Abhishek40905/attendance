// Placeholder API endpoints - replace with actual backend URLs

export interface LocationCheckResponse {
  allowed: boolean;
  message?: string;
}

export interface UserRoleResponse {
  role: 'teacher' | 'student';
  email: string;
}

export interface AttendanceResponse {
  success: boolean;
  message?: string;
}

const API_BASE_URL = '/api'; // Replace with actual backend URL

export const api = {
  checkLocation: async (lat: number, lng: number): Promise<LocationCheckResponse> => {
    // Simulating API call - replace with actual fetch
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo: allow location if within reasonable coordinates
    // In production, this would be a real backend check
    const isValid = lat !== 0 && lng !== 0;

    return {
      allowed: isValid,
      message: isValid ? 'Location verified' : 'Location not in allowed range'
    };
  },

  checkUserRole: async (email: string): Promise<UserRoleResponse> => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email is teacher domain
    const isTeacher = email.endsWith('@school.edu') || email.includes('teacher');

    return {
      role: isTeacher ? 'teacher' : 'student',
      email
    };
  },

  markAttendance: async (
    studentEmail: string,
    lat: number,
    lng: number
  ): Promise<AttendanceResponse> => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Marking attendance:', { studentEmail, lat, lng });

    return {
      success: true,
      message: 'Attendance marked successfully'
    };
  },

  sendAttendance: async (teacherEmail: string): Promise<AttendanceResponse> => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Sending attendance to:', teacherEmail);

    return {
      success: true,
      message: `Attendance sent successfully to ${teacherEmail}`
    };
  }
};
