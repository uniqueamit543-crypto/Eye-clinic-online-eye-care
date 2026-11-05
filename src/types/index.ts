export type Role = 'patient' | 'doctor' | 'admin';

export interface UserAccount {
  id: string;
  loginId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  dateCreated: string;
  avatar?: string;
  doctorSpecialty?: string;
  doctorDegree?: string;
  doctorRoom?: string;
  doctorShift?: ShiftType;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
}

export interface User extends Omit<UserAccount, 'loginId' | 'password' | 'dateCreated'> {
  loginId?: string;
  password?: string;
  dateCreated?: string;
  dateJoined?: string;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Evening';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:30 AM"
  shift: ShiftType;
  maxCapacity: number;
  bookedCount: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress';

export interface Appointment {
  id: string;
  userId?: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  shift: ShiftType;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  serviceType: 'Comprehensive Eye Exam' | 'Vision Refraction' | 'Glaucoma Screening' | 'Pediatric Optometry' | 'Contact Lens Fitting' | 'Dry Eye Clinic';
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  prescriptionId?: string;
}

export interface EyePrescriptionValues {
  sph: string;  // Sphere (e.g. -1.75, +0.50)
  cyl: string;  // Cylinder (e.g. -0.50)
  axis: string; // Axis (e.g. 90, 180)
  add?: string; // Addition (for presbyopia/bifocals e.g. +1.50)
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorDegree: string;
  date: string;
  validUntil: string;
  od: EyePrescriptionValues; // Oculus Dexter (Right Eye)
  os: EyePrescriptionValues; // Oculus Sinister (Left Eye)
  pd: string; // Pupillary Distance in mm (e.g. 63mm)
  recommendedLens: 'Single Vision' | 'Bifocal' | 'Progressive' | 'Blue-Cut Digital Protection' | 'High Index 1.67';
  clinicalAdvice: string;
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

export type ProductCategory = 'Men' | 'Women' | 'Kids' | 'Unisex' | 'Reading' | 'Sunglasses';
export type FrameShape = 'Rectangular' | 'Round' | 'Aviator' | 'Wayfarer' | 'Cat-Eye' | 'Geometric' | 'Rimless';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  frameShape: FrameShape;
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  frameMaterial: string; // e.g. "Titanium", "Acetate", "TR90 Flex"
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  prescriptionReady: boolean;
  frameSize: 'Small' | 'Medium' | 'Wide';
  color: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  lensType: 'frame-only' | 'standard-anti-glare' | 'blue-cut-digital' | 'photochromic-trans' | 'thin-high-index';
  lensPrice: number;
  prescriptionType?: 'doctor-issued' | 'manual' | 'zero-power';
  prescriptionId?: string;
  manualPrescription?: {
    od: EyePrescriptionValues;
    os: EyePrescriptionValues;
    pd: string;
  };
}

export type PaymentMethod = 'upi' | 'razorpay' | 'cod';
export type OrderStatus = 'Confirmed' | 'Lens Glazing' | 'Quality Check' | 'Dispatched' | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  lensTotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending (COD)';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  experienceYears: number;
  room: string;
  shift: ShiftType;
  image: string;
  rating: number;
  availableDays: string[];
  bio: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  patientLocation: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  approved: boolean;
  featured?: boolean;
}
