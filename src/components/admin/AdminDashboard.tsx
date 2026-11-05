import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Calendar,
  ShoppingBag,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  ArrowUpRight,
  PackageCheck,
  FileText,
  KeyRound,
  UserPlus,
  Lock,
  RefreshCw,
  LogIn,
  Search,
  Check,
  Info
} from 'lucide-react';
import { AppointmentStatus, OrderStatus, Doctor, Product, ShiftType, UserAccount, Role } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    accounts,
    adminCreateAccount,
    adminDeleteAccount,
    resetPassword,
    switchRole,
    showToast,
    appointments,
    updateAppointmentStatus,
    assignDoctorToAppointment,
    products,
    addProduct,
    updateProductStock,
    updateProductPrice,
    orders,
    updateOrderStatus,
    doctors,
    addDoctor,
    reviews,
    moderateReview
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'inventory' | 'orders' | 'doctors' | 'reviews'>('appointments');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Doctor form toggle
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocDegree, setNewDocDegree] = useState('B.Optom, M.Optom');
  const [newDocShift, setNewDocShift] = useState<ShiftType>('Morning');
  const [newDocRoom, setNewDocRoom] = useState('Room 106');

  // New Product form toggle
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Titan Eye+');
  const [newProdCategory, setNewProdCategory] = useState<any>('Men');
  const [newProdShape, setNewProdShape] = useState<any>('Rectangular');
  const [newProdPrice, setNewProdPrice] = useState(2999);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdMaterial, setNewProdMaterial] = useState('Beta Titanium');

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + appointments.filter(a => a.status === 'completed').length * 500;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stockCount < 15).length;
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered').length;

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    const newDoc: Doctor = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      name: newDocName,
      specialty: newDocSpecialty || 'Senior Optometrist',
      degree: newDocDegree,
      shift: newDocShift,
      room: newDocRoom,
      experienceYears: 6,
      image: 'https://images.unsplash.com/photo-1594824813575-f860538a7c28?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      bio: 'Clinical specialist in ocular refractive diagnostics.'
    };
    addDoctor(newDoc);
    setNewDocName('');
    setShowAddDoctor(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    const newProd: Product = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name: newProdName,
      brand: newProdBrand,
      category: newProdCategory,
      frameShape: newProdShape,
      gender: newProdCategory === 'Kids' ? 'Kids' : newProdCategory === 'Women' ? 'Women' : 'Men',
      frameMaterial: newProdMaterial,
      price: newProdPrice,
      originalPrice: Math.round(newProdPrice * 1.3),
      rating: 4.8,
      reviewCount: 1,
      inStock: true,
      stockCount: newProdStock,
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80'],
      description: 'Ergonomic precision eyewear with anti-slip silicone nosepads.',
      features: ['Ultra-Durable Frame', 'Prescription Glazing Compatible', '1-Year Warranty'],
      prescriptionReady: true,
      frameSize: 'Medium',
      color: 'Matte Charcoal'
    };
    addProduct(newProd);
    setNewProdName('');
    setShowAddProduct(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Operations Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Executive Clinic Operations Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              EyeClinic Central Management System
            </h1>
            <p className="text-xs text-indigo-200 mt-1">
              Real-time monitoring of appointments, doctor rotas, optical glazing queue, and customer feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Operations Console</span>
            </div>
            <span className="text-xs px-3 py-2 rounded-xl bg-white/10 text-slate-200 font-mono">
              System: Online
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs text-slate-400 block">Total Revenue</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ₹{totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">+18.4% this month</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs text-slate-400 block">Total Appointments</span>
            <span className="text-2xl font-bold font-mono text-indigo-300">
              {appointments.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Booked & completed</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs text-slate-400 block">Active Glazing Orders</span>
            <span className="text-2xl font-bold font-mono text-sky-400">
              {activeOrdersCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Lab in progress</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs text-slate-400 block">Low Stock Frames</span>
            <span className="text-2xl font-bold font-mono text-rose-400">
              {lowStockProducts}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Under 15 units</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-100 rounded-2xl">
        {[
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: 'inventory', label: `Glasses Inventory (${products.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'orders', label: `Orders & Glazing (${orders.length})`, icon: <PackageCheck className="w-4 h-4" /> },
          { id: 'doctors', label: `Doctor Team (${doctors.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'reviews', label: `Reviews Moderation (${reviews.length})`, icon: <Star className="w-4 h-4" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Appointments Management */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-sm">Consultation Slot Bookings</h3>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={shiftFilter}
                onChange={e => setShiftFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="all">All Shifts</option>
                <option value="Morning">Morning Shift</option>
                <option value="Afternoon">Afternoon Shift</option>
                <option value="Evening">Evening Shift</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Slot & Shift</th>
                  <th className="py-3 px-4">Patient Demographics</th>
                  <th className="py-3 px-4">Clinical Service</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments
                  .filter(
                    a =>
                      (shiftFilter === 'all' || a.shift === shiftFilter) &&
                      (statusFilter === 'all' || a.status === statusFilter)
                  )
                  .map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{apt.timeSlot}</span>
                        <span className="text-[10px] text-slate-500 block">{apt.date} • {apt.shift}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{apt.patientName}</span>
                        <span className="text-[10px] text-slate-500 block">{apt.patientPhone}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {apt.serviceType}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={apt.doctorId}
                          onChange={e => assignDoctorToAppointment(apt.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-medium"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.shift})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-semibold capitalize text-[10px] ${
                            apt.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'confirmed'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : apt.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          ● {apt.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium cursor-pointer"
                          >
                            Mark Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Glasses Catalogue & Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Optical Frame Inventory & Pricing</h3>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Optical Frame</span>
            </button>
          </div>

          {/* Add Product Form Modal / Collapsible */}
          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h4 className="font-bold text-slate-800">New Product Form</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Titan FlexiLite Zero"
                    value={newProdName}
                    onChange={e => setNewProdName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Frame Shape</label>
                  <select
                    value={newProdShape}
                    onChange={e => setNewProdShape(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Rectangular">Rectangular</option>
                    <option value="Round">Round</option>
                    <option value="Aviator">Aviator</option>
                    <option value="Wayfarer">Wayfarer</option>
                    <option value="Cat-Eye">Cat-Eye</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Material</label>
                  <input
                    type="text"
                    value={newProdMaterial}
                    onChange={e => setNewProdMaterial(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save Frame to Database
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Frame</th>
                    <th className="py-3 px-4">Category & Shape</th>
                    <th className="py-3 px-4">Material</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Units</th>
                    <th className="py-3 px-4 text-right">Quick Stock Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{p.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{p.category}</span>
                        <span className="text-slate-400 block text-[10px]">{p.frameShape}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.frameMaterial}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{p.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            p.stockCount < 10
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => updateProductStock(p.id, Math.max(0, p.stockCount - 1))}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateProductStock(p.id, p.stockCount + 5)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                        >
                          +5
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Orders & Lens Glazing */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Eyewear Orders & Optical Glazing Queue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Patient & Shipping</th>
                  <th className="py-3 px-4">Prescription & Items</th>
                  <th className="py-3 px-4">Amount & Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-indigo-700 block">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{order.createdAt}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{order.customerName}</span>
                      <span className="text-[10px] text-slate-500 block">
                        {order.shippingAddress.city}, {order.shippingAddress.pincode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {order.items.map((it, i) => (
                          <div key={i} className="text-[11px] text-slate-700">
                            <strong>{it.product.name}</strong> x{it.quantity}
                            {it.prescriptionId && (
                              <span className="ml-1 text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200">
                                Rx: {it.prescriptionId}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">₹{order.total.toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full font-semibold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200">
                        ⚙️ {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={order.orderStatus}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-medium text-[11px]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Lens Glazing">Lens Glazing</option>
                        <option value="Quality Check">Quality Check</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Doctor Team Profiles */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Consultant Optometrists & Ophthalmologists</h3>
            <button
              onClick={() => setShowAddDoctor(!showAddDoctor)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Specialist</span>
            </button>
          </div>

          {showAddDoctor && (
            <form onSubmit={handleCreateDoctor} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Add Doctor Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Amit Tiwari"
                    value={newDocName}
                    onChange={e => setNewDocName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Pediatric Optometry"
                    value={newDocSpecialty}
                    onChange={e => setNewDocSpecialty(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Clinic Shift</label>
                  <select
                    value={newDocShift}
                    onChange={e => setNewDocShift(e.target.value as ShiftType)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Afternoon">Afternoon Shift</option>
                    <option value="Evening">Evening Shift</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctor(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-700 block">{doc.shift} Shift</span>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500">{doc.degree}</p>
                  <p className="text-[11px] text-teal-700 font-medium mt-1">{doc.specialty}</p>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{doc.room}</span>
                  <span className="font-bold text-amber-500">★ {doc.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Patient Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Patient Reviews & Rating Moderation</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{rev.patientName}</span>
                    <span className="text-[10px] text-slate-400">({rev.patientLocation})</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    {rev.featured && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold uppercase">
                        Featured on Home
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-teal-700 font-medium block">Service: {rev.service} • {rev.date}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => moderateReview(rev.id, !rev.approved, rev.featured)}
                    className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                      rev.approved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {rev.approved ? 'Approved ✓' : 'Hidden ✕'}
                  </button>

                  <button
                    onClick={() => moderateReview(rev.id, rev.approved, !rev.featured)}
                    className={`px-3 py-1.5 rounded-lg font-medium border cursor-pointer ${
                      rev.featured
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {rev.featured ? 'Featured ★' : 'Feature'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
