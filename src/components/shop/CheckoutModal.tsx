import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  Building
} from 'lucide-react';
import { PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    cartTotal,
    placeOrder,
    currentUser,
    setActiveView
  } = useApp();

  // Form states
  const [customerName, setCustomerName] = useState(currentUser.name || 'Aditya Sharma');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || 'aditya.sharma@niu.edu.in');
  const [street, setStreet] = useState('Hostel Block B, Room 314, NIU Campus, Plot 1');
  const [city, setCity] = useState('Greater Noida');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('203201');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  // Completed order view
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (activeModal !== 'checkout') return null;

  const discount = 300;
  const taxable = Math.max(0, cartTotal.total - discount);
  const gst = Math.round(taxable * 0.18);
  const finalAmount = taxable + gst;

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        patientId: currentUser.id || 'patient-demo',
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress: {
          street,
          city,
          state,
          pincode
        },
        items: [...cart],
        subtotal: cartTotal.subtotal,
        lensTotal: cartTotal.lensTotal,
        tax: gst,
        discount,
        total: finalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid',
        estimatedDelivery: '3 to 5 business days'
      });

      setIsProcessing(false);
      setCompletedOrder(order);
    }, 1200);
  };

  const handleFinish = () => {
    setActiveModal(null);
    setCompletedOrder(null);
    setActiveView('patient-portal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 p-6 text-white relative">
          {!completedOrder && (
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              256-Bit Encrypted Optical Checkout
            </span>
            <span className="text-teal-300 text-xs">• ISO/IEC 25010 Standards</span>
          </div>

          <h3 className="text-2xl font-bold font-heading">
            {completedOrder ? 'Payment & Order Confirmed' : 'Checkout & Payment Method'}
          </h3>
          <p className="text-xs text-teal-100 mt-1">
            {completedOrder
              ? `Your prescription glasses order has been registered in the optical glazing lab.`
              : `Choose between UPI QR Code, Razorpay Gateway, or Cash on Delivery (COD).`}
          </p>
        </div>

        {/* Order Completed Confirmation View */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Order Reference: {completedOrder.orderNumber}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading mt-2">
                Thank You, {completedOrder.customerName}!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Payment Method: <strong className="uppercase">{completedOrder.paymentMethod}</strong> • Status:{' '}
                <strong className="text-emerald-600">{completedOrder.paymentStatus}</strong>. Your custom spectacles have
                entered lens cut & alignment.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-700 border-b border-slate-200 pb-2">
                <span>Shipping Address:</span>
                <span className="font-normal text-slate-600">
                  {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city},{' '}
                  {completedOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frames & Prescription Glazing:</span>
                <span className="font-mono text-slate-800">
                  ₹{(completedOrder.subtotal + completedOrder.lensTotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount applied:</span>
                <span className="font-mono">-₹{completedOrder.discount}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span className="font-mono">₹{completedOrder.tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-teal-700">₹{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Track Order in Patient Portal
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrderSubmit} className="p-6 space-y-6">
            {/* Delivery Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-teal-600" />
                1. Delivery & Patient Shipping Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Address / Hostel</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector (UPI QR / Razorpay / COD) */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-teal-600" />
                2. Select Payment Option (As per System Specification)
              </h4>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-teal-600" />
                  <span className="text-xs font-bold">UPI QR Code</span>
                  <span className="text-[10px] text-teal-700 font-medium">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'razorpay'
                      ? 'bg-sky-50 border-sky-600 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <span className="text-xs font-bold">Razorpay Gateway</span>
                  <span className="text-[10px] text-sky-700 font-medium">Cards & Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-amber-700 font-medium">Doorstep Pay</span>
                </button>
              </div>

              {/* UPI QR Payment UI */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  {/* Dynamic QR Code Visualization */}
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-center shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=eyeclinic.niu@icici&pn=EyeClinic%20NIU&am=${finalAmount}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-32 h-32 mx-auto rounded-lg"
                    />
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">Scan with any UPI App</span>
                  </div>

                  <div className="space-y-2 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Clinic VPA:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-teal-700">
                        eyeclinic.niu@icici
                      </code>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>Supported:</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-indigo-700">Google Pay</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-purple-700">PhonePe</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-sky-700">Paytm</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-emerald-700">BHIM</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Instant transaction settlement with instant optical work order creation.
                    </p>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={upiVerified}
                        onChange={e => setUpiVerified(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-xs font-semibold text-teal-800">
                        Simulate UPI payment verified successfully ✓
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Razorpay Gateway UI */}
              {paymentMethod === 'razorpay' && (
                <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600" /> Razorpay Trusted Gateway
                    </span>
                    <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                      PCI-DSS Level 1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Or Select Net Banking:</label>
                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-1.5 rounded-lg border text-center transition cursor-pointer ${
                            selectedBank === b
                              ? 'bg-sky-600 text-white font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COD UI */}
              {paymentMethod === 'cod' && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Pay Cash or UPI Upon Doorstep Optical Delivery</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Our courier executive carries a mobile UPI scanner as well as accepts exact cash. Free frame
                    alignment kit and case included in your parcel.
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">Payable Total (incl. GST):</span>
                <span className="text-2xl font-extrabold text-teal-700 font-mono block">
                  ₹{finalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'cod'
                          ? 'Confirm Cash on Delivery Order'
                          : `Authorize ₹${finalAmount.toLocaleString()}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
