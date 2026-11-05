import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Role,
  User,
  UserAccount,
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
  INITIAL_ACCOUNTS,
  INITIAL_DOCTORS,
  INITIAL_PRODUCTS,
  INITIAL_SLOTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from '../data/mockData';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit
} from 'firebase/firestore';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: Role;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>;
  signUpWithEmail: (data: { name: string; email: string; password?: string; phone: string; age?: number; gender?: 'Male' | 'Female' | 'Other' }) => Promise<{ success: boolean; message: string }>;
  signInWithEmail: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signOutUser: () => Promise<void>;
  accounts: UserAccount[];
  login: (loginId: string, password: string) => { success: boolean; message: string; role?: Role };
  registerAccount: (accountData: Omit<UserAccount, 'id' | 'dateCreated'>) => { success: boolean; message: string; account?: UserAccount };
  logout: () => void;
  adminCreateAccount: (accountData: Omit<UserAccount, 'id' | 'dateCreated'>) => { success: boolean; message: string; account?: UserAccount };
  adminDeleteAccount: (accountId: string) => void;
  resetPassword: (accountId: string, newPassword: string) => void;
  updateProfile: (accountId: string, updates: Partial<UserAccount>) => void;
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
  activeView: 'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal';
  setActiveView: (view: 'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal') => void;
  toast: ToastNotification | null;
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
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
  email: 'aditya.sharma@example.com',
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
  name: 'Clinic Operations Admin',
  email: 'admin@eyeclinic.org',
  phone: '+91 99990 00112',
  role: 'admin',
  dateJoined: '2024-01-01'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts with Login ID & Password
  const [accounts, setAccounts] = useState<UserAccount[]>(() => 
    safeGetStorage('eyeclinic_accounts_v8', INITIAL_ACCOUNTS)
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    safeGetStorage('eyeclinic_auth_v8', true)
  );

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = safeGetStorage<UserAccount | null>('eyeclinic_active_user_v8', null);
    if (savedUser) return savedUser;
    const initialPatient = INITIAL_ACCOUNTS.find(a => a.role === 'patient') || INITIAL_ACCOUNTS[0];
    return initialPatient;
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const savedUser = safeGetStorage<UserAccount | null>('eyeclinic_active_user_v8', null);
    return savedUser ? savedUser.role : 'patient';
  });

  const [activeView, setActiveView] = useState<'home' | 'catalogue' | 'appointments' | 'doctor-portal' | 'admin-panel' | 'patient-portal'>('home');

  // Core collections initialized with persistence support (v7 versioning)
  const [doctors, setDoctors] = useState<Doctor[]>(() => 
    safeGetStorage('eyeclinic_doctors_v7', INITIAL_DOCTORS)
  );

  const [slots, setSlots] = useState<TimeSlot[]>(() => 
    safeGetStorage('eyeclinic_slots_v7', INITIAL_SLOTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    safeGetStorage('eyeclinic_appointments_v7', INITIAL_APPOINTMENTS)
  );

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => 
    safeGetStorage('eyeclinic_prescriptions_v7', INITIAL_PRESCRIPTIONS)
  );

  const [products, setProducts] = useState<Product[]>(() => 
    safeGetStorage('eyeclinic_products_v7', INITIAL_PRODUCTS)
  );

  const [cart, setCart] = useState<CartItem[]>(() => 
    safeGetStorage('eyeclinic_cart_v7', [])
  );

  const [wishlist, setWishlist] = useState<string[]>(() => 
    safeGetStorage('eyeclinic_wishlist_v7', ['prod-1', 'prod-4'])
  );

  const [orders, setOrders] = useState<Order[]>(() => 
    safeGetStorage('eyeclinic_orders_v7', INITIAL_ORDERS)
  );

  const [reviews, setReviews] = useState<PatientReview[]>(() => 
    safeGetStorage('eyeclinic_reviews_v7', INITIAL_REVIEWS)
  );

  // Modal controls
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    safeSetStorage('eyeclinic_doctors_v7', doctors);
  }, [doctors]);

  useEffect(() => {
    safeSetStorage('eyeclinic_slots_v7', slots);
  }, [slots]);

  useEffect(() => {
    safeSetStorage('eyeclinic_appointments_v7', appointments);
  }, [appointments]);

  useEffect(() => {
    safeSetStorage('eyeclinic_prescriptions_v7', prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    safeSetStorage('eyeclinic_products_v7', products);
  }, [products]);

  useEffect(() => {
    safeSetStorage('eyeclinic_cart_v7', cart);
  }, [cart]);

  useEffect(() => {
    safeSetStorage('eyeclinic_wishlist_v7', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeSetStorage('eyeclinic_orders_v7', orders);
  }, [orders]);

  useEffect(() => {
    safeSetStorage('eyeclinic_reviews_v7', reviews);
  }, [reviews]);

  useEffect(() => {
    safeSetStorage('eyeclinic_accounts_v8', accounts);
  }, [accounts]);

  useEffect(() => {
    safeSetStorage('eyeclinic_active_user_v8', currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetStorage('eyeclinic_auth_v8', isAuthenticated);
  }, [isAuthenticated]);

  // Real-time Firestore synchronizers
  useEffect(() => {
    const unsubAppointments = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Appointment[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Appointment);
          });
          setAppointments(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'appointments');
      }
    );

    const unsubPrescriptions = onSnapshot(
      collection(db, 'prescriptions'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Prescription[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Prescription);
          });
          setPrescriptions(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'prescriptions');
      }
    );

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Order);
          });
          setOrders(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    );

    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PatientReview[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as PatientReview);
          });
          setReviews(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reviews');
      }
    );

    return () => {
      unsubAppointments();
      unsubPrescriptions();
      unsubOrders();
      unsubReviews();
    };
  }, []);

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

  // Authentication: Login with Login ID and Password
  const login = (loginId: string, pass: string): { success: boolean; message: string; role?: Role } => {
    const cleanId = loginId.trim().toLowerCase();
    const found = accounts.find(
      a => (a.loginId.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId) && a.password === pass
    );

    if (!found) {
      showToast('error', 'Login Failed', 'Invalid Login ID or Password. Please check credentials or register.');
      return { success: false, message: 'Invalid Login ID or Password. Please check your credentials.' };
    }

    setCurrentUser(found);
    setCurrentRole(found.role);
    setIsAuthenticated(true);

    if (found.role === 'patient') {
      setActiveView('patient-portal');
    } else if (found.role === 'doctor') {
      setActiveView('doctor-portal');
    } else if (found.role === 'admin') {
      setActiveView('admin-panel');
    }

    showToast('success', 'Welcome Back!', `Logged in successfully as ${found.name} (${found.role.toUpperCase()})`);
    return { success: true, message: `Welcome back, ${found.name}!`, role: found.role };
  };

  // Authentication: Create Account / Register with Login ID & Password
  const registerAccount = (
    accountData: Omit<UserAccount, 'id' | 'dateCreated'>
  ): { success: boolean; message: string; account?: UserAccount } => {
    const cleanId = accountData.loginId.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, message: 'Login ID is required.' };
    }
    if (!accountData.password || accountData.password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const exists = accounts.some(a => a.loginId.toLowerCase() === cleanId);
    if (exists) {
      return { success: false, message: `The Login ID "${accountData.loginId}" is already taken. Please choose another.` };
    }

    const newAccount: UserAccount = {
      ...accountData,
      id: `${accountData.role}-${Date.now().toString().slice(-6)}`,
      loginId: accountData.loginId.trim(),
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setAccounts(prev => [newAccount, ...prev]);

    // If registered as doctor, ensure doctor profile exists in roster
    if (newAccount.role === 'doctor') {
      const docExists = doctors.some(d => d.id === newAccount.id || d.name.toLowerCase() === newAccount.name.toLowerCase());
      if (!docExists) {
        const newDoc: Doctor = {
          id: newAccount.id,
          name: newAccount.name.startsWith('Dr.') ? newAccount.name : `Dr. ${newAccount.name}`,
          degree: newAccount.doctorDegree || 'MBBS, DO, Consultant Optometry',
          specialty: newAccount.doctorSpecialty || 'Comprehensive Ophthalmology & Refraction',
          experienceYears: 5,
          room: newAccount.doctorRoom || 'Room 103 (Clinical OPD)',
          shift: newAccount.doctorShift || 'Morning',
          image: 'https://images.unsplash.com/photo-1594824813575-f860538a7c28?auto=format&fit=crop&w=600&q=80',
          rating: 4.8,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          bio: 'Clinical optometrist & vision care specialist.'
        };
        setDoctors(prev => [...prev, newDoc]);
      }
    }

    setCurrentUser(newAccount);
    setCurrentRole(newAccount.role);
    setIsAuthenticated(true);

    if (newAccount.role === 'patient') {
      setActiveView('patient-portal');
    } else if (newAccount.role === 'doctor') {
      setActiveView('doctor-portal');
    } else if (newAccount.role === 'admin') {
      setActiveView('admin-panel');
    }

    showToast('success', 'Account Registered!', `Account created! Your Login ID is "${newAccount.loginId}".`);
    return { success: true, message: `Account created successfully! Your Login ID is ${newAccount.loginId}`, account: newAccount };
  };

  // Admin action: Create new user with Login ID & Password
  const adminCreateAccount = (
    accountData: Omit<UserAccount, 'id' | 'dateCreated'>
  ): { success: boolean; message: string; account?: UserAccount } => {
    const cleanId = accountData.loginId.trim().toLowerCase();
    const exists = accounts.some(a => a.loginId.toLowerCase() === cleanId);
    if (exists) {
      return { success: false, message: `Login ID "${accountData.loginId}" already exists.` };
    }

    const newAccount: UserAccount = {
      ...accountData,
      id: `${accountData.role}-${Date.now().toString().slice(-6)}`,
      loginId: accountData.loginId.trim(),
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setAccounts(prev => [newAccount, ...prev]);

    if (newAccount.role === 'doctor') {
      const newDoc: Doctor = {
        id: newAccount.id,
        name: newAccount.name.startsWith('Dr.') ? newAccount.name : `Dr. ${newAccount.name}`,
        degree: newAccount.doctorDegree || 'MBBS, DO, Consultant Optometry',
        specialty: newAccount.doctorSpecialty || 'Clinical Specialist',
        experienceYears: 6,
        room: newAccount.doctorRoom || 'Room 106',
        shift: newAccount.doctorShift || 'Morning',
        image: 'https://images.unsplash.com/photo-1594824813575-f860538a7c28?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        bio: 'Hospital appointed clinical staff.'
      };
      setDoctors(prev => [...prev, newDoc]);
    }

    showToast('success', 'Account Created', `Created ${newAccount.role} Login ID: "${newAccount.loginId}" with password.`);
    return { success: true, message: `Created credentials for ${newAccount.name}`, account: newAccount };
  };

  const adminDeleteAccount = (accountId: string) => {
    if (accounts.length <= 1) {
      showToast('error', 'Cannot Delete', 'At least one account must remain in the system.');
      return;
    }
    setAccounts(prev => prev.filter(a => a.id !== accountId));
    showToast('info', 'Account Removed', 'User login credentials deleted.');
  };

  const resetPassword = (accountId: string, newPass: string) => {
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, password: newPass } : a));
    if (currentUser.id === accountId) {
      setCurrentUser(prev => ({ ...prev, password: newPass }));
    }
    showToast('success', 'Password Updated', 'Password successfully changed and saved.');
  };

  const updateProfile = (accountId: string, updates: Partial<UserAccount>) => {
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, ...updates } : a));
    if (currentUser.id === accountId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
    showToast('success', 'Profile Updated', 'Account details have been refreshed.');
  };

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Monitor Firebase Auth state change
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as User;
            setCurrentUser(data);
            setCurrentRole(data.role || 'patient');
          } else {
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Patient',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '',
              role: 'patient',
              dateJoined: new Date().toISOString().split('T')[0]
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
            setCurrentRole('patient');
          }
          setIsAuthenticated(true);
          safeSetStorage('eyeclinic_auth_v8', true);
        } catch (err) {
          console.warn('Error fetching Firestore user profile:', err);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubAuth();
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const uid = res.user.uid;
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      let profile: User;
      if (snap.exists()) {
        profile = snap.data() as User;
      } else {
        profile = {
          id: uid,
          name: res.user.displayName || 'Patient',
          email: res.user.email || '',
          phone: res.user.phoneNumber || '',
          role: 'patient',
          dateJoined: new Date().toISOString().split('T')[0]
        };
        await setDoc(userRef, profile);
      }
      setCurrentUser(profile);
      setIsAuthenticated(true);
      safeSetStorage('eyeclinic_active_user_v8', profile);
      safeSetStorage('eyeclinic_auth_v8', true);
      showToast('success', 'Signed In with Google', `Welcome, ${profile.name}!`);
      return { success: true, message: 'Google sign in successful' };
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      showToast('error', 'Google Sign In Failed', err.message || 'Could not authenticate with Google.');
      return { success: false, message: err.message || 'Google sign in failed' };
    }
  };

  const signUpWithEmail = async (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
  }): Promise<{ success: boolean; message: string }> => {
    try {
      let uid = `usr-${Date.now()}`;
      if (data.password && data.password.length >= 6) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
          uid = cred.user.uid;
        } catch (authErr: any) {
          console.warn('Firebase Email Auth Notice:', authErr.message);
        }
      }

      const userProfile: User = {
        id: uid,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        role: 'patient',
        patientAge: data.age,
        patientGender: data.gender,
        dateJoined: new Date().toISOString().split('T')[0]
      };

      // Store in Firestore users collection
      await setDoc(doc(db, 'users', uid), userProfile);
      setCurrentUser(userProfile);
      setIsAuthenticated(true);
      safeSetStorage('eyeclinic_active_user_v8', userProfile);
      safeSetStorage('eyeclinic_auth_v8', true);
      showToast('success', 'Account Registered!', `Welcome to EyeClinic, ${data.name}!`);
      return { success: true, message: 'Account registered successfully' };
    } catch (err: any) {
      console.error('Sign up error:', err);
      showToast('error', 'Registration Failed', err.message || 'Could not register user account.');
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const signInWithEmail = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      let foundUser: User | null = null;

      if (password && password.length >= 6) {
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          const snap = await getDoc(doc(db, 'users', cred.user.uid));
          if (snap.exists()) {
            foundUser = snap.data() as User;
          }
        } catch (authErr: any) {
          console.warn('Firebase Sign In check:', authErr.message);
        }
      }

      if (!foundUser) {
        try {
          const q = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            foundUser = qSnap.docs[0].data() as User;
          }
        } catch (queryErr) {
          console.warn('Firestore user search notice:', queryErr);
        }
      }

      if (foundUser) {
        setCurrentUser(foundUser);
        setIsAuthenticated(true);
        safeSetStorage('eyeclinic_active_user_v8', foundUser);
        safeSetStorage('eyeclinic_auth_v8', true);
        showToast('success', 'Welcome Back!', `Signed in as ${foundUser.name}.`);
        return { success: true, message: 'Signed in successfully' };
      } else {
        // Create user record in Firestore
        const newUid = `usr-${Date.now()}`;
        const newUserProfile: User = {
          id: newUid,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '',
          role: 'patient',
          dateJoined: new Date().toISOString().split('T')[0]
        };
        await setDoc(doc(db, 'users', newUid), newUserProfile);
        setCurrentUser(newUserProfile);
        setIsAuthenticated(true);
        safeSetStorage('eyeclinic_active_user_v8', newUserProfile);
        safeSetStorage('eyeclinic_auth_v8', true);
        showToast('success', 'Signed In', `Signed in as ${newUserProfile.name}.`);
        return { success: true, message: 'Signed in successfully' };
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      showToast('error', 'Sign In Failed', err.message || 'Could not sign in.');
      return { success: false, message: err.message || 'Sign in failed' };
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut notice:', err);
    }
    setIsAuthenticated(false);
    safeSetStorage('eyeclinic_auth_v8', false);
    safeSetStorage('eyeclinic_active_user_v8', null);
    showToast('info', 'Signed Out', 'You have been logged out of EyeClinic.');
  };

  const logout = () => {
    signOutUser();
    setActiveView('home');
  };

  // Role switching
  const switchRole = (role: Role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    const match = accounts.find(a => a.role === role);
    if (match) {
      setCurrentUser(match);
    }
    if (role === 'patient') {
      setActiveView('patient-portal');
      showToast('info', 'Patient Dashboard', `Switched to Patient: ${match?.name || 'Patient'}`);
    } else if (role === 'doctor') {
      setActiveView('doctor-portal');
      showToast('info', 'Doctor Dashboard', `Switched to Doctor: ${match?.name || 'Doctor'}`);
    } else if (role === 'admin') {
      setActiveView('admin-panel');
      showToast('info', 'Admin Dashboard', `Switched to Admin: ${match?.name || 'Admin'}`);
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

    // Persist to Firestore
    setDoc(doc(db, 'appointments', newAppointment.id), newAppointment).catch(err => {
      console.warn('Could not sync appointment to Firestore:', err);
    });

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
    // Update in Firestore
    updateDoc(doc(db, 'appointments', id), { status }).catch(err => {
      console.warn('Could not update appointment status in Firestore:', err);
    });
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

    // Persist to Firestore
    setDoc(doc(db, 'prescriptions', newRx.id), newRx).catch(err => {
      console.warn('Could not sync prescription to Firestore:', err);
    });

    // Also mark associated appointment as completed and link Rx
    if (data.appointmentId) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === data.appointmentId
            ? { ...apt, status: 'completed', prescriptionId: newRxId }
            : apt
        )
      );
      updateDoc(doc(db, 'appointments', data.appointmentId), {
        status: 'completed',
        prescriptionId: newRxId
      }).catch(err => {
        console.warn('Could not update appointment status in Firestore:', err);
      });
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

    // Persist to Firestore
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
      console.warn('Could not sync order to Firestore:', err);
    });

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
    // Update in Firestore
    updateDoc(doc(db, 'orders', orderId), { orderStatus: status }).catch(err => {
      console.warn('Could not update order in Firestore:', err);
    });
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

    // Persist to Firestore
    setDoc(doc(db, 'reviews', newReview.id), newReview).catch(err => {
      console.warn('Could not sync review to Firestore:', err);
    });

    showToast('success', 'Review Submitted', 'Thank you for your valuable feedback!');
  };

  const moderateReview = (id: string, approved: boolean, featured = false) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, approved, featured } : r))
    );
    // Update in Firestore
    updateDoc(doc(db, 'reviews', id), { approved, featured }).catch(err => {
      console.warn('Could not moderate review in Firestore:', err);
    });
    showToast('info', 'Review Moderated', `Review visibility updated.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isAuthLoading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOutUser,
        accounts,
        login,
        registerAccount,
        logout,
        adminCreateAccount,
        adminDeleteAccount,
        resetPassword,
        updateProfile,
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
