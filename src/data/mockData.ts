import { Doctor, Product, TimeSlot, Appointment, Prescription, PatientReview, Order, UserAccount } from '../types';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'patient-demo',
    loginId: 'patient_aditya',
    password: 'patient123',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'patient',
    dateCreated: '2026-09-12',
    patientAge: 32,
    patientGender: 'Male',
    bloodGroup: 'B+'
  },
  {
    id: 'patient-2',
    loginId: 'patient_priya',
    password: 'patient123',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98112 34567',
    role: 'patient',
    dateCreated: '2026-10-01',
    patientAge: 27,
    patientGender: 'Female',
    bloodGroup: 'O+'
  },
  {
    id: 'doc-1',
    loginId: 'doc_abishek',
    password: 'doctor123',
    name: 'Dr. Abishek Raut',
    email: 'abishek.raut@eyeclinic.org',
    phone: '+91 98110 54321',
    role: 'doctor',
    doctorSpecialty: 'Senior Consultant & Refractive Specialist',
    doctorDegree: 'MBBS, MS (Ophthalmology), FICO',
    doctorRoom: 'Room 102 (OPD Wing A)',
    doctorShift: 'Morning',
    dateCreated: '2024-03-01'
  },
  {
    id: 'doc-2',
    loginId: 'doc_yuvraj',
    password: 'doctor123',
    name: 'Dr. Yuvraj Tiwari',
    email: 'yuvraj.tiwari@eyeclinic.org',
    phone: '+91 98220 12345',
    role: 'doctor',
    doctorSpecialty: 'Clinical Optometrist & Contact Lens Specialist',
    doctorDegree: 'B.Optom, M.Optom (AIIMS)',
    doctorRoom: 'Room 105 (Vision Therapy Wing)',
    doctorShift: 'Afternoon',
    dateCreated: '2024-04-10'
  },
  {
    id: 'doc-3',
    loginId: 'doc_suman',
    password: 'doctor123',
    name: 'Dr. Suman Jha',
    email: 'suman.jha@eyeclinic.org',
    phone: '+91 98330 67890',
    role: 'doctor',
    doctorSpecialty: 'Glaucoma & Pediatric Eye Specialist',
    doctorDegree: 'MBBS, DO, DNB (Ophthalmology)',
    doctorRoom: 'Room 201 (Diagnostic Wing)',
    doctorShift: 'Evening',
    dateCreated: '2024-05-15'
  },
  {
    id: 'doc-4',
    loginId: 'doc_arvind',
    password: 'doctor123',
    name: 'Dr. Arvind Singh',
    email: 'arvind.singh@eyeclinic.org',
    phone: '+91 98440 98765',
    role: 'doctor',
    doctorSpecialty: 'Computer Vision Syndrome & Dry Eye Care',
    doctorDegree: 'B.Optom, Fellow in Low Vision Care',
    doctorRoom: 'Room 104 (Wellness Lab)',
    doctorShift: 'Evening',
    dateCreated: '2024-06-20'
  },
  {
    id: 'admin-super',
    loginId: 'admin_master',
    password: 'admin123',
    name: 'Clinic Operations Admin',
    email: 'admin@eyeclinic.org',
    phone: '+91 99990 00112',
    role: 'admin',
    dateCreated: '2024-01-01'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Abishek Raut',
    degree: 'MBBS, MS (Ophthalmology), FICO',
    specialty: 'Senior Consultant & Refractive Specialist',
    experienceYears: 14,
    room: 'Room 102 (OPD Wing A)',
    shift: 'Morning',
    image: 'https://images.unsplash.com/photo-1594824813575-f860538a7c28?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bio: 'Specialist in comprehensive eye examinations, corneal topography, digital refraction, and refractive surgery consultations.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Yuvraj Tiwari',
    degree: 'B.Optom, M.Optom (AIIMS)',
    specialty: 'Clinical Optometrist & Contact Lens Specialist',
    experienceYears: 9,
    room: 'Room 105 (Vision Therapy Wing)',
    shift: 'Afternoon',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    bio: 'Lead optometrist focusing on binocular vision anomalies, orthokeratology, and advanced progressive lens dispensing.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Suman Jha',
    degree: 'MBBS, DO, DNB (Ophthalmology)',
    specialty: 'Glaucoma & Pediatric Eye Specialist',
    experienceYears: 11,
    room: 'Room 201 (Diagnostic Wing)',
    shift: 'Evening',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
    bio: 'Specialized in pediatric amblyopia management, tonometry, visual field analysis, and non-invasive ocular health screenings.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Arvind Singh',
    degree: 'B.Optom, Fellow in Low Vision Care',
    specialty: 'Computer Vision Syndrome & Dry Eye Care',
    experienceYears: 7,
    room: 'Room 104 (Wellness Lab)',
    shift: 'Evening',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
    bio: 'Expert in ergonomic visual assessments, blue-light filtering diagnostics, and dry eye meibomian gland evaluation.'
  }
];

export const INITIAL_SLOTS: TimeSlot[] = [
  // Morning Shift (09:00 - 12:00)
  { id: 'm-1', time: '09:00 AM', shift: 'Morning', maxCapacity: 4, bookedCount: 3 },
  { id: 'm-2', time: '09:45 AM', shift: 'Morning', maxCapacity: 4, bookedCount: 2 },
  { id: 'm-3', time: '10:30 AM', shift: 'Morning', maxCapacity: 4, bookedCount: 4 }, // full
  { id: 'm-4', time: '11:15 AM', shift: 'Morning', maxCapacity: 4, bookedCount: 1 },
  // Afternoon Shift (01:00 - 04:00)
  { id: 'a-1', time: '01:00 PM', shift: 'Afternoon', maxCapacity: 4, bookedCount: 2 },
  { id: 'a-2', time: '01:45 PM', shift: 'Afternoon', maxCapacity: 4, bookedCount: 0 },
  { id: 'a-3', time: '02:30 PM', shift: 'Afternoon', maxCapacity: 4, bookedCount: 3 },
  { id: 'a-4', time: '03:15 PM', shift: 'Afternoon', maxCapacity: 4, bookedCount: 1 },
  // Evening Shift (05:00 - 08:00)
  { id: 'e-1', time: '05:00 PM', shift: 'Evening', maxCapacity: 4, bookedCount: 2 },
  { id: 'e-2', time: '05:45 PM', shift: 'Evening', maxCapacity: 4, bookedCount: 1 },
  { id: 'e-3', time: '06:30 PM', shift: 'Evening', maxCapacity: 4, bookedCount: 3 },
  { id: 'e-4', time: '07:15 PM', shift: 'Evening', maxCapacity: 4, bookedCount: 0 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroTitan AirLight Pro',
    brand: 'Titan Eye+',
    category: 'Men',
    frameShape: 'Rectangular',
    gender: 'Men',
    frameMaterial: 'Ultra-Pure Beta Titanium',
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Featherlight 9.2g titanium alloy spectacles designed for long work hours and screen usage with hypoallergenic silicone nose pads.',
    features: ['Ultra-Lightweight 9.2g', 'Anti-Corrosion Finish', 'Memory Metal Temples', 'Supports High-Index Lenses'],
    isBestSeller: true,
    prescriptionReady: true,
    frameSize: 'Medium',
    color: 'Matte Gunmetal'
  },
  {
    id: 'prod-2',
    name: 'Luxe Florence Cat-Eye',
    brand: 'Vogue Eyewear',
    category: 'Women',
    frameShape: 'Cat-Eye',
    gender: 'Women',
    frameMaterial: 'Italian Bio-Acetate',
    price: 4290,
    originalPrice: 5800,
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    stockCount: 12,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Elegant winged silhouette handcrafted from glossy tortoise bio-acetate with custom 5-barrel German hinges for effortless elegance.',
    features: ['Handcrafted Acetate', 'Ergonomic Bridge', 'High Gloss Tortoise Hue', 'Prescription Compatible'],
    isNewArrival: true,
    prescriptionReady: true,
    frameSize: 'Medium',
    color: 'Havana Tortoise'
  },
  {
    id: 'prod-3',
    name: 'Junior FlexiShield Kids',
    brand: 'Lenskart Air Junior',
    category: 'Kids',
    frameShape: 'Round',
    gender: 'Kids',
    frameMaterial: 'TR90 Unbreakable Food-Grade Polymer',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 165,
    inStock: true,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Virtually indestructible, 180° twistable frame designed specifically for active children aged 5-12. Features wrap-around silicone ear grips.',
    features: ['180-Degree Flex Bend', 'Zero Screw Hinges', 'Skin-Safe Non-Toxic Material', 'Comfort Head Strap Included'],
    isBestSeller: true,
    prescriptionReady: true,
    frameSize: 'Small',
    color: 'Ocean Blue & Lime'
  },
  {
    id: 'prod-4',
    name: 'Cambridge Classic Wayfarer',
    brand: 'Ray-Ban',
    category: 'Unisex',
    frameShape: 'Wayfarer',
    gender: 'Unisex',
    frameMaterial: 'Acetate & Steel Core',
    price: 6890,
    originalPrice: 8490,
    rating: 4.9,
    reviewCount: 310,
    inStock: true,
    stockCount: 14,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'The iconic vintage square silhouette engineered for both prescription clear lenses and polarized sun lenses with metal rivets.',
    features: ['Iconic Vintage Styling', 'Wire Core Temples', 'UV400 Certified Option', 'Hand-Polished Finish'],
    isBestSeller: true,
    prescriptionReady: true,
    frameSize: 'Wide',
    color: 'Classic Polished Black'
  },
  {
    id: 'prod-5',
    name: 'Aura Round Minimalist',
    brand: 'Fastrack Studio',
    category: 'Women',
    frameShape: 'Round',
    gender: 'Women',
    frameMaterial: 'Rose Gold Stainless Steel',
    price: 2599,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    stockCount: 20,
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Chic circular wire rims with delicate filigree bridge engraving and lustrous warm rose-gold electroplating.',
    features: ['Slim Rim Profile', 'Featherweight Comfort', 'Adjustable Clear Pads', 'Blue-Cut Compatible'],
    prescriptionReady: true,
    frameSize: 'Medium',
    color: 'Polished Rose Gold'
  },
  {
    id: 'prod-6',
    name: 'CyberShield Computer Glasses',
    brand: 'EyeClinic Lab Essentials',
    category: 'Men',
    frameShape: 'Geometric',
    gender: 'Men',
    frameMaterial: 'Carbon Composite',
    price: 2899,
    originalPrice: 3999,
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    stockCount: 16,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Engineered specifically for software developers and data analysts facing 10+ screen hours daily to alleviate eye fatigue.',
    features: ['High blue light absorbance (420nm)', 'Anti-glare reflection buster', 'Spring hinges', 'Includes micro-fiber case'],
    isNewArrival: true,
    prescriptionReady: true,
    frameSize: 'Medium',
    color: 'Matte Obsidian'
  },
  {
    id: 'prod-7',
    name: 'Aviator Horizon Pilot Gold',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameShape: 'Aviator',
    gender: 'Unisex',
    frameMaterial: 'Monel Metal Alloy',
    price: 7490,
    originalPrice: 9200,
    rating: 5.0,
    reviewCount: 220,
    inStock: true,
    stockCount: 8,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Timeless teardrop aviators with double bridge and polarized G-15 crystal green optical glass lenses.',
    features: ['Polarized UV400', 'Double Brow Bar', 'Dynamic Contrast Tint', 'Full Prescription Glazing Available'],
    prescriptionReady: true,
    frameSize: 'Wide',
    color: 'Arista Gold'
  },
  {
    id: 'prod-8',
    name: 'Petite Blossom Kids Frame',
    brand: 'Titan Zoop',
    category: 'Kids',
    frameShape: 'Round',
    gender: 'Kids',
    frameMaterial: 'Soft-Touch Rubberized Silicone',
    price: 1599,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    stockCount: 22,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80'
    ],
    description: 'Adorable and resilient pastel kids frame engineered without metal sharp points for daycare and school safety.',
    features: ['Shatterproof Structure', 'Drop-proof Durability', 'Prescription Friendly', 'Hypoallergenic'],
    prescriptionReady: true,
    frameSize: 'Small',
    color: 'Candy Pink & Mint'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-9021',
    appointmentId: 'apt-101',
    patientId: 'patient-demo',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abishek Raut',
    doctorDegree: 'MBBS, MS (Ophthalmology)',
    date: '2026-10-24',
    validUntil: '2027-10-24',
    od: { sph: '-1.50', cyl: '-0.50', axis: '90', add: '+0.00' },
    os: { sph: '-1.75', cyl: '-0.25', axis: '85', add: '+0.00' },
    pd: '63',
    recommendedLens: 'Blue-Cut Digital Protection',
    clinicalAdvice: 'Mild compound myopic astigmatism. Advised 20-20-20 screen rule, artificial tear drops (Carboxymethylcellulose 0.5%) twice daily for computer strain.',
    medications: [
      { name: 'Refresh Tears (Carboxymethylcellulose 0.5%)', dosage: '1 drop', frequency: 'Twice daily', duration: '30 days' }
    ]
  },
  {
    id: 'rx-9022',
    appointmentId: 'apt-102',
    patientId: 'patient-demo',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-2',
    doctorName: 'Dr. Yuvraj Tiwari',
    doctorDegree: 'B.Optom, M.Optom (AIIMS)',
    date: '2026-08-15',
    validUntil: '2027-08-15',
    od: { sph: '-1.25', cyl: '-0.50', axis: '90', add: '+0.00' },
    os: { sph: '-1.50', cyl: '-0.25', axis: '80', add: '+0.00' },
    pd: '63',
    recommendedLens: 'Single Vision',
    clinicalAdvice: 'Routine annual refraction. Visual acuity with correction 6/6 OU. Fundus normal.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'patient-demo',
    patientName: 'Aditya Sharma',
    patientPhone: '+91 98765 43210',
    patientEmail: 'aditya.sharma@niu.edu.in',
    patientAge: 23,
    patientGender: 'Male',
    date: '2026-10-24',
    timeSlot: '10:30 AM',
    shift: 'Morning',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abishek Raut',
    doctorSpecialty: 'Senior Consultant & Refractive Specialist',
    serviceType: 'Comprehensive Eye Exam',
    status: 'completed',
    notes: 'Regular check-up, mild headaches while reading late at night.',
    createdAt: '2026-10-20',
    prescriptionId: 'rx-9021'
  },
  {
    id: 'apt-102',
    patientId: 'patient-demo',
    patientName: 'Aditya Sharma',
    patientPhone: '+91 98765 43210',
    patientEmail: 'aditya.sharma@niu.edu.in',
    patientAge: 23,
    patientGender: 'Male',
    date: '2026-11-05',
    timeSlot: '01:45 PM',
    shift: 'Afternoon',
    doctorId: 'doc-2',
    doctorName: 'Dr. Yuvraj Tiwari',
    doctorSpecialty: 'Clinical Optometrist & Contact Lens Specialist',
    serviceType: 'Contact Lens Fitting',
    status: 'confirmed',
    notes: 'Fitting trial for monthly disposable toric soft contacts.',
    createdAt: '2026-10-29'
  },
  {
    id: 'apt-103',
    patientId: 'patient-p2',
    patientName: 'Priya Mehra',
    patientPhone: '+91 98112 34567',
    patientEmail: 'priya.mehra@gmail.com',
    patientAge: 29,
    patientGender: 'Female',
    date: '2026-11-02',
    timeSlot: '09:00 AM',
    shift: 'Morning',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abishek Raut',
    doctorSpecialty: 'Senior Consultant & Refractive Specialist',
    serviceType: 'Comprehensive Eye Exam',
    status: 'pending',
    notes: 'Blurry distance vision noticed during driving.',
    createdAt: '2026-10-31'
  },
  {
    id: 'apt-104',
    patientId: 'patient-p3',
    patientName: 'Rohan Verma',
    patientPhone: '+91 97110 88992',
    patientEmail: 'rohan.v@outlook.com',
    patientAge: 38,
    patientGender: 'Male',
    date: '2026-11-03',
    timeSlot: '05:45 PM',
    shift: 'Evening',
    doctorId: 'doc-3',
    doctorName: 'Dr. Suman Jha',
    doctorSpecialty: 'Glaucoma & Pediatric Eye Specialist',
    serviceType: 'Glaucoma Screening',
    status: 'confirmed',
    notes: 'Family history of open-angle glaucoma, intraocular pressure check requested.',
    createdAt: '2026-10-30'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-801',
    orderNumber: 'EYE-2026-801',
    patientId: 'patient-demo',
    customerName: 'Aditya Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'aditya.sharma@niu.edu.in',
    shippingAddress: {
      street: 'Hostel Block B, Room 314, NIU Campus, Plot 1',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '203201'
    },
    items: [
      {
        id: 'cart-item-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        lensType: 'blue-cut-digital',
        lensPrice: 1200,
        prescriptionType: 'doctor-issued',
        prescriptionId: 'rx-9021'
      }
    ],
    subtotal: 3499,
    lensTotal: 1200,
    tax: 235,
    discount: 300,
    total: 4634,
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    orderStatus: 'Lens Glazing',
    createdAt: '2026-10-26',
    estimatedDelivery: '2026-11-04'
  }
];

export const INITIAL_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Kavita Verma',
    patientLocation: 'Greater Noida, UP',
    rating: 5,
    date: '2026-10-22',
    comment: 'Exceptional experience! The shift-wise booking made it so effortless to pick an evening slot after college classes. Dr. Abishek Raut was thorough and explained my corneal astigmatism clearly.',
    service: 'Comprehensive Eye Exam',
    approved: true,
    featured: true
  },
  {
    id: 'rev-2',
    patientName: 'Ananya Roy',
    patientLocation: 'Noida Sector 62',
    rating: 5,
    date: '2026-10-18',
    comment: 'The digital prescription linking straight to the eyewear cart is a game-changer! I picked the AeroTitan frame, selected my prescription with 1 click, paid via UPI QR code and received it in 3 days.',
    service: 'Eyewear & Prescription Glazing',
    approved: true,
    featured: true
  },
  {
    id: 'rev-3',
    patientName: 'Vikas Kumar',
    patientLocation: 'Yamuna Expressway',
    rating: 4,
    date: '2026-10-15',
    comment: 'Very professional clinic setup. Clean waiting room, accurate time slots with no waiting queues. Highly recommend Dr. Yuvraj Tiwari for contact lens fitment.',
    service: 'Contact Lens Fitting',
    approved: true,
    featured: true
  },
  {
    id: 'rev-4',
    patientName: 'Meenakshi Iyer',
    patientLocation: 'Delhi NCR',
    rating: 5,
    date: '2026-10-11',
    comment: 'Kid-friendly pediatric checkup with Dr. Suman Jha. My 7-year old was relaxed throughout the eye chart tests. The TR90 unbreakable frames are great for kids.',
    service: 'Pediatric Optometry',
    approved: true,
    featured: false
  }
];
