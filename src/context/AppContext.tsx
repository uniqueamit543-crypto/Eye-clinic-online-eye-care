import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Role,
  User,
  Doctor,
  Product,
  TimeSlot,
  Appointment,
  Prescription,
  CartItem,
  Order,
  PatientReview,
  AppointmentStatus,
  OrderStatus
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_PRODUCTS,
  INITIAL_SLOTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: Role;
  switchRole: (role: Role) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  slots: TimeSlot[];
  appointments: Appointment[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  assignDoctorToAppointment: (appointmentId: string, doctorId: string) => void;
  prescriptions: Prescription[];
  createPrescription: (data: Omit<Prescription, 'id'>) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProductStock: (id: string, newStock: number) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: { subtotal: number; lensTotal: number; total: number; itemCount: number };
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reviews: PatientReview[];
  addReview: (review: Omit<PatientReview, 'id' | 'date' | 'approved'>) => void;
  moderateReview: (id: string, approved: boolean, featured?: boolean) => void;
  // Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedAppointmentForRx: Appointment | null;
  setSelectedAppointmentForRx: (apt: Appointment | null) => void;
  activeView: 'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal' | 'about-niu';
  setActiveView: (view: 'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal' | 'about-niu') => void;
  toast: ToastNotification | null;
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key: string, value: unknown): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage errors (e.g. storage disabled or quota exceeded)
  }
};

const DEMO_PATIENT: User = {
  id: 'patient-demo',
  name: 'Aditya Sharma',
  email: 'aditya.sharma@niu.edu.in',
  phone: '+91 98765 43210',
  role: 'patient',
  dateJoined: '2026-09-12'
};

const DEMO_DOCTOR: User = {
  id: 'doc-1',
  name: 'Dr. Abishek Raut',
  email: 'abishek.raut@eyeclinic.org',
  phone: '+91 98110 54321',
  role: 'doctor',
  doctorSpecialty: 'Senior Consultant & Refractive Specialist',
  doctorRoom: 'Room 102 (OPD Wing A)',
  dateJoined: '2024-03-01'
};

const DEMO_ADMIN: User = {
  id: 'admin-super',
  name: 'NIU Clinic Operations Admin',
  email: 'admin.eyeclinic@niu.edu.in',
  phone: '+91 99990 00112',
  role: 'admin',
  dateJoined: '2024-01-01'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & role
  const [currentRole, setCurrentRole] = useState<Role>('patient');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_PATIENT);
  const [activeView, setActiveView] = useState<'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal' | 'about-niu'>('home');

  // Core collections initialized with persistence support
  const [doctors, setDoctors] = useState<Doctor[]>(() => 
    safeGetStorage('eyeclinic_doctors_v5', INITIAL_DOCTORS)
  );

  const [slots, setSlots] = useState<TimeSlot[]>(() => 
    safeGetStorage('eyeclinic_slots_v2', INITIAL_SLOTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    safeGetStorage('eyeclinic_appointments_v4', INITIAL_APPOINTMENTS)
  );

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => 
    safeGetStorage('eyeclinic_prescriptions_v4', INITIAL_PRESCRIPTIONS)
  );

  const [products, setProducts] = useState<Product[]>(() => 
    safeGetStorage('eyeclinic_products_v2', INITIAL_PRODUCTS)
  );

  const [cart, setCart] = useState<CartItem[]>(() => 
    safeGetStorage('eyeclinic_cart', [])
  );

  const [wishlist, setWishlist] = useState<string[]>(() => 
    safeGetStorage('eyeclinic_wishlist', ['prod-1', 'prod-4'])
  );

  const [orders, setOrders] = useState<Order[]>(() => 
    safeGetStorage('eyeclinic_orders', INITIAL_ORDERS)
  );

  const [reviews, setReviews] = useState<PatientReview[]>(() => 
    safeGetStorage('eyeclinic_reviews_v3', INITIAL_REVIEWS)
  );

  // Modal controls
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    safeSetStorage('eyeclinic_doctors_v5', doctors);
  }, [doctors]);

  useEffect(() => {
    safeSetStorage('eyeclinic_slots_v2', slots);
  }, [slots]);

  useEffect(() => {
    safeSetStorage('eyeclinic_appointments_v4', appointments);
  }, [appointments]);

  useEffect(() => {
    safeSetStorage('eyeclinic_prescriptions_v4', prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    safeSetStorage('eyeclinic_products_v2', products);
  }, [products]);

  useEffect(() => {
    safeSetStorage('eyeclinic_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeSetStorage('eyeclinic_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeSetStorage('eyeclinic_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetStorage('eyeclinic_reviews_v3', reviews);
  }, [reviews]);

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message
    });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Role switching
  const switchRole = (role: Role) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setCurrentUser(DEMO_PATIENT);
      setActiveView('patient-portal');
      showToast('info', 'Switched to Patient View', 'Now viewing as Patient: Aditya Sharma');
    } else if (role === 'doctor') {
      setCurrentUser(DEMO_DOCTOR);
      setActiveView('doctor-portal');
      showToast('info', 'Switched to Doctor Portal', 'Logged in as Dr. Abishek Raut (Refractive Specialist)');
    } else if (role === 'admin') {
      setCurrentUser(DEMO_ADMIN);
      setActiveView('admin-panel');
      showToast('info', 'Switched to Admin Dashboard', 'Full clinic operations & inventory access enabled');
    }
  };

  // Appointments
  const bookAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    // Check conflicts: check if the user already has an appointment at this exact date & time
    const userConflict = appointments.some(
      a => a.patientEmail === data.patientEmail && a.date === data.date && a.timeSlot === data.timeSlot && a.status !== 'cancelled'
    );
    if (userConflict) {
      showToast('warning', 'Slot Conflict', 'You already have an appointment booked for this time slot.');
      return { success: false, message: 'You already have an appointment booked for this time slot.' };
    }

    // Check slot capacity limit
    const existingForSlot = appointments.filter(
      a => a.date === data.date && a.timeSlot === data.timeSlot && a.status !== 'cancelled'
    );
    const matchedSlot = slots.find(s => s.time === data.timeSlot && s.shift === data.shift);
    const capacity = matchedSlot ? matchedSlot.maxCapacity : 4;

    if (existingForSlot.length >= capacity) {
      showToast('error', 'Slot Full', 'This time slot has reached maximum capacity. Please choose another slot.');
      return { success: false, message: 'This time slot is fully booked.' };
    }

    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update slots booked count dynamically
    setSlots(prev => prev.map(s => {
      if (s.time === data.timeSlot && s.shift === data.shift) {
        return { ...s, bookedCount: Math.min(s.maxCapacity, s.bookedCount + 1) };
      }
      return s;
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    showToast(
      'success',
      'Appointment Requested!',
      `Your appointment for ${data.serviceType} on ${data.date} at ${data.timeSlot} (${data.shift}) is submitted.`
    );

    return { success: true, message: 'Appointment booked successfully' };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast('info', 'Status Updated', `Appointment ${id} marked as ${status}`);
  };

  const assignDoctorToAppointment = (appointmentId: string, doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, doctorId: doc.id, doctorName: doc.name, doctorSpecialty: doc.specialty }
          : apt
      )
    );
    showToast('success', 'Doctor Reassigned', `Assigned ${doc.name} to appointment.`);
  };

  // Doctors
  const addDoctor = (doctor: Doctor) => {
    setDoctors(prev => [...prev, doctor]);
    showToast('success', 'Doctor Added', `${doctor.name} added to EyeClinic team.`);
  };

  const updateDoctor = (doctor: Doctor) => {
    setDoctors(prev => prev.map(d => (d.id === doctor.id ? doctor : d)));
    showToast('info', 'Doctor Profile Updated', `${doctor.name} profile saved.`);
  };

  // Prescriptions
  const createPrescription = (data: Omit<Prescription, 'id'>) => {
    const newRxId = `rx-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: Prescription = {
      ...data,
      id: newRxId
    };

    setPrescriptions(prev => [newRx, ...prev]);

    // Also mark associated appointment as completed and link Rx
    if (data.appointmentId) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === data.appointmentId
            ? { ...apt, status: 'completed', prescriptionId: newRxId }
            : apt
        )
      );
    }

    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast('success', 'Prescription Issued', `Digital Rx ${newRxId} issued for ${data.patientName}.`);
  };

  // Products
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    showToast('success', 'Frame Added', `${product.name} added to catalogue.`);
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p
      )
    );
    showToast('info', 'Stock Updated', `Inventory updated for item.`);
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, price: newPrice } : p))
    );
    showToast('info', 'Price Updated', `Price updated.`);
  };

  // Cart
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(
      ci => ci.product.id === item.product.id && ci.lensType === item.lensType && ci.prescriptionId === item.prescriptionId
    );
    if (existingIndex > -1) {
      setCart(prev =>
        prev.map((ci, idx) =>
          idx === existingIndex ? { ...ci, quantity: ci.quantity + item.quantity } : ci
        )
      );
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      setCart(prev => [...prev, newItem]);
    }
    showToast('success', 'Added to Cart', `${item.product.name} added to your cart.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.id !== itemId));
    showToast('info', 'Item Removed', 'Removed frame from cart.');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => (ci.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = React.useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const lensTotal = cart.reduce((acc, item) => acc + (item.lensPrice || 0) * item.quantity, 0);
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    return {
      subtotal,
      lensTotal,
      total: subtotal + lensTotal,
      itemCount
    };
  }, [cart]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('info', 'Removed from Wishlist', 'Item removed from your favorites.');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('success', 'Added to Wishlist', 'Saved to your favorites.');
    }
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>): Order => {
    const newOrderNumber = `EYE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: newOrderNumber,
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    showToast('success', 'Order Confirmed!', `Order ${newOrderNumber} placed successfully.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast('info', 'Order Updated', `Order ${orderId} status set to ${status}.`);
  };

  // Reviews
  const addReview = (review: Omit<PatientReview, 'id' | 'date' | 'approved'>) => {
    const newReview: PatientReview = {
      ...review,
      id: `rev-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      approved: true // default approved in prototype
    };
    setReviews(prev => [newReview, ...prev]);
    showToast('success', 'Review Submitted', 'Thank you for your valuable feedback!');
  };

  const moderateReview = (id: string, approved: boolean, featured = false) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, approved, featured } : r))
    );
    showToast('info', 'Review Moderated', `Review visibility updated.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        doctors,
        addDoctor,
        updateDoctor,
        slots,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        assignDoctorToAppointment,
        prescriptions,
        createPrescription,
        products,
        addProduct,
        updateProductStock,
        updateProductPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        reviews,
        addReview,
        moderateReview,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        selectedAppointmentForRx,
        setSelectedAppointmentForRx,
        activeView,
        setActiveView,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
