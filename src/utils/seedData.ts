import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Doctor, Patient, HospitalResource, Hospital, Ambulance, Appointment, MedicalRecord } from '../types';

export async function seedDemoDataIfEmpty() {
  try {
    const resourcesSnapshot = await getDocs(collection(db, 'resources'));
    if (!resourcesSnapshot.empty) {
      return; // Already seeded
    }

    // Seed Resources
    const initialResources: HospitalResource[] = [
      { resourceId: 'res-beds', type: 'General Beds', total: 100, available: 32, updatedAt: new Date().toISOString() },
      { resourceId: 'res-icu', type: 'ICU Beds', total: 20, available: 6, updatedAt: new Date().toISOString() },
      { resourceId: 'res-doctors', type: 'Doctors', total: 25, available: 18, updatedAt: new Date().toISOString() },
      { resourceId: 'res-nurses', type: 'Nurses', total: 60, available: 42, updatedAt: new Date().toISOString() },
      { resourceId: 'res-ambulances', type: 'Ambulances', total: 10, available: 4, updatedAt: new Date().toISOString() },
      { resourceId: 'res-ventilators', type: 'Ventilators', total: 15, available: 5, updatedAt: new Date().toISOString() },
      { resourceId: 'res-monitors', type: 'Patient Monitors', total: 50, available: 19, updatedAt: new Date().toISOString() },
      { resourceId: 'res-oxygen', type: 'Oxygen Units', total: 80, available: 35, updatedAt: new Date().toISOString() },
    ];

    for (const res of initialResources) {
      await setDoc(doc(db, 'resources', res.resourceId), res);
    }

    // Seed Hospitals
    const initialHospitals: Hospital[] = [
      {
        hospitalId: 'hosp-1',
        name: 'MediCore Central Super-Specialty Hospital',
        address: '104 Healthcare Boulevard, Medical District',
        city: 'New Delhi',
        phone: '+91 11 2345 6789',
        totalBeds: 100,
        availableBeds: 32,
        totalIcu: 20,
        availableIcu: 6,
        emergencyStatus: 'Available',
        departments: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pediatrics'],
        latitude: 28.6139,
        longitude: 77.2090
      },
      {
        hospitalId: 'hosp-2',
        name: 'MediCore Metro Care & Trauma Center',
        address: '45 Ring Road, Civil Lines',
        city: 'New Delhi',
        phone: '+91 11 9876 5432',
        totalBeds: 80,
        availableBeds: 14,
        totalIcu: 15,
        availableIcu: 2,
        emergencyStatus: 'Limited Availability',
        departments: ['Emergency', 'Cardiology', 'Orthopedics'],
        latitude: 28.6500,
        longitude: 77.2300
      },
      {
        hospitalId: 'hosp-3',
        name: 'MediCore Apex Institute of Medical Sciences',
        address: '12 University Avenue',
        city: 'New Delhi',
        phone: '+91 11 5555 4321',
        totalBeds: 150,
        availableBeds: 48,
        totalIcu: 30,
        availableIcu: 11,
        emergencyStatus: 'Available',
        departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Oncology'],
        latitude: 28.5800,
        longitude: 77.1900
      }
    ];

    for (const hosp of initialHospitals) {
      await setDoc(doc(db, 'hospitals', hosp.hospitalId), hosp);
    }

    // Seed Ambulances
    const initialAmbulances: Ambulance[] = [
      { ambulanceId: 'amb-1', vehicleNumber: 'DL-01-AB-1234', type: 'Advanced Life Support', status: 'Available', driverName: 'Rajinder Singh', driverPhone: '+91 98111 22334', currentLocation: 'Sector 18 Hub', etaMinutes: 8 },
      { ambulanceId: 'amb-2', vehicleNumber: 'DL-01-CD-5678', type: 'ICU Mobile', status: 'Available', driverName: 'Manoj Sharma', driverPhone: '+91 98222 33445', currentLocation: 'Central Hospital Bay', etaMinutes: 5 },
      { ambulanceId: 'amb-3', vehicleNumber: 'DL-01-EF-9012', type: 'Basic Life Support', status: 'On the way', driverName: 'Amit Verma', driverPhone: '+91 98333 44556', currentLocation: 'Ring Road Junction', etaMinutes: 12 },
      { ambulanceId: 'amb-4', vehicleNumber: 'DL-01-GH-3456', type: 'Advanced Life Support', status: 'Available', driverName: 'Deepak Kumar', driverPhone: '+91 98444 55667', currentLocation: 'South Extension Depot', etaMinutes: 10 }
    ];

    for (const amb of initialAmbulances) {
      await setDoc(doc(db, 'ambulances', amb.ambulanceId), amb);
    }

    // Seed Doctors
    const initialDoctors: Doctor[] = [
      { doctorId: 'doc-1', name: 'Dr. Ramesh Sharma', email: 'sharma@hospital.org', department: 'Cardiology', specialization: 'Interventional Cardiology', qualification: 'MBBS, MD, DM (Cardiology)', experience: '15 Years Experience', availability: 'Available', createdAt: new Date().toISOString() },
      { doctorId: 'doc-2', name: 'Dr. Priya Nair', email: 'nair@hospital.org', department: 'Emergency', specialization: 'Trauma Care & Critical Care', qualification: 'MBBS, MS (Surgery), Fellowship in Trauma', experience: '12 Years Experience', availability: 'Available', createdAt: new Date().toISOString() },
      { doctorId: 'doc-3', name: 'Dr. Ananya Roy', email: 'roy@hospital.org', department: 'Neurology', specialization: 'Stroke Specialist & Neurosurgery', qualification: 'MBBS, MD, MCh (Neurosurgery)', experience: '18 Years Experience', availability: 'Busy', createdAt: new Date().toISOString() },
      { doctorId: 'doc-4', name: 'Dr. Vikram Patel', email: 'patel@hospital.org', department: 'Orthopedics', specialization: 'Joint Replacement & Arthroscopy', qualification: 'MBBS, MS (Orthopedics)', experience: '10 Years Experience', availability: 'Available', createdAt: new Date().toISOString() },
      { doctorId: 'doc-5', name: 'Dr. Sunita Mehta', email: 'mehta@hospital.org', department: 'Pediatrics', specialization: 'Neonatal Care & Pediatric Pulmonology', qualification: 'MBBS, MD (Pediatrics)', experience: '14 Years Experience', availability: 'Available', createdAt: new Date().toISOString() },
    ];

    for (const docObj of initialDoctors) {
      await setDoc(doc(db, 'doctors', docObj.doctorId), docObj);
    }

    // Seed Patients
    const initialPatients: Patient[] = [
      {
        patientId: 'P-1001',
        name: 'Rajesh Kumar',
        age: 58,
        gender: 'Male',
        department: 'Cardiology',
        priority: 'Critical',
        status: 'Waiting',
        icuRequired: true,
        phone: '+91 98765 43210',
        address: '22 Civil Lines, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        patientId: 'P-1002',
        name: 'Meena Iyer',
        age: 42,
        gender: 'Female',
        department: 'Emergency',
        priority: 'Critical',
        status: 'Waiting',
        icuRequired: true,
        phone: '+91 98765 43211',
        address: '15 Green Park, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      },
      {
        patientId: 'P-1003',
        name: 'Amitabh Sen',
        age: 65,
        gender: 'Male',
        department: 'Neurology',
        priority: 'High',
        status: 'Assigned',
        assignedDoctorId: 'doc-3',
        assignedDoctorName: 'Dr. Ananya Roy',
        icuRequired: false,
        phone: '+91 98765 43212',
        address: '89 Hauz Khas, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        patientId: 'P-1004',
        name: 'Kavita Das',
        age: 34,
        gender: 'Female',
        department: 'Orthopedics',
        priority: 'Medium',
        status: 'Under Treatment',
        assignedDoctorId: 'doc-4',
        assignedDoctorName: 'Dr. Vikram Patel',
        icuRequired: false,
        phone: '+91 98765 43213',
        address: '42 Lajpat Nagar, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        patientId: 'P-1005',
        name: 'Suresh Menon',
        age: 50,
        gender: 'Male',
        department: 'Cardiology',
        priority: 'High',
        status: 'Waiting',
        icuRequired: false,
        phone: '+91 98765 43214',
        address: '71 Greater Kailash, New Delhi',
        createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
      }
    ];

    for (const pat of initialPatients) {
      await setDoc(doc(db, 'patients', pat.patientId), pat);
    }
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
