export type UserRole = 'admin' | 'doctor' | 'patient';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  doctorId?: string;
  patientId?: string;
  department?: string;
  specialization?: string;
  createdAt: string;
}

export interface Doctor {
  doctorId: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  userId?: string;
  qualification?: string;
  experience?: string;
  createdAt: string;
}

export type PatientPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type PatientStatus = 'Waiting' | 'Assigned' | 'Under Treatment' | 'Completed';

export interface Patient {
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  priority: PatientPriority;
  status: PatientStatus;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  icuRequired: boolean;
  userId?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface HospitalResource {
  resourceId: string;
  type: string;
  total: number;
  available: number;
  updatedAt: string;
}

export interface Hospital {
  hospitalId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  totalBeds: number;
  availableBeds: number;
  totalIcu: number;
  availableIcu: number;
  emergencyStatus: 'Available' | 'Limited Availability' | 'Full' | 'Emergency Only';
  departments: string[];
  latitude: number;
  longitude: number;
}

export interface Ambulance {
  ambulanceId: string;
  vehicleNumber: string;
  type: 'Advanced Life Support' | 'Basic Life Support' | 'ICU Mobile';
  status: 'Available' | 'Assigned' | 'On the way' | 'Arrived';
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  etaMinutes?: number;
}

export interface AmbulanceRequest {
  requestId: string;
  patientId: string;
  patientName: string;
  pickupLocation: string;
  status: 'Requested' | 'Dispatched' | 'On the way' | 'Arrived' | 'Cancelled';
  ambulanceId?: string;
  etaMinutes?: number;
  createdAt: string;
}

export type AppointmentStatus = 'Requested' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  prescription: string;
  labReports: string[];
  notes: string;
  date: string;
  createdAt: string;
}

export interface NotificationItem {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'ambulance' | 'emergency' | 'system';
  read: boolean;
  createdAt: string;
}

export interface PatientHistoryRecord {
  historyId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  treatmentNotes: string;
  status: string;
  createdAt: string;
}
