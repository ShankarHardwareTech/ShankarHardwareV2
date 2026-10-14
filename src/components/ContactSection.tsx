import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeData';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Send, CheckCircle2, MessageSquare, Navigation, Globe, Star, Share2, BookmarkCheck, PhoneCall } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    inquiryType: 'Materials Quotation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const getWhatsAppDirectUrl = () => {
    const text = `Namaste Shankar Hardware & Agro (Sonwadi),\nMy name is ${formData.name || 'a customer'} from ${formData.village || 'Sonwadi area'}.\nInquiry: ${formData.inquiryType}\nDetails: ${formData.message || 'Please send material quotation and delivery details.'}`;
    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${STORE_INFO.name} (${STORE_INFO.regionalName})`,
        text: `Shankar Hardware and Agro Materials, AT Post Sonawadi TAL, Sonwadi, Maharashtra 413801. Phone: ${STORE_INFO.phoneMain}`,
        url: 'https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText('https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div id="contact-info" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Verified Google Maps Listing Header Card */}
      <div className="p-6 md:p-8 bg-stone-900 text-white border-b border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#8c4b3f]/40 text-[#f5d9d4] uppercase tracking-wider">
                Google Maps Verified Business
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-300 font-medium">Hardware store</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
              {STORE_INFO.name}
            </h2>
            <p className="text-lg text-[#bb948d] font-serif font-medium">
              {STORE_INFO.regionalName}
            </p>

            <div className="flex items-center gap-3 pt-1 text-sm">
              <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0</span>
              </div>
              <span className="text-stone-400">({STORE_INFO.googleMapsReviewsCount} review)</span>
              <span className="text-stone-600">·</span>
              <span className="text-[#bb948d] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#bb948d]" />
                <span>Open · Closes 5 pm</span>
              </span>
            </div>
          </div>

          {/* Google Listing Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.google.com/maps/search/?api=1&query=FHH8%2BJ6+Sonwadi%2C+Maharashtra"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Directions</span>
            </a>

            <a
              href={`tel:${STORE_INFO.phoneMain}`}
              className="px-4 py-2.5 bg-[#8c4b3f] hover:bg-[#773f35] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call ({STORE_INFO.phoneMain})</span>
            </a>

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-[#128C7E] hover:bg-[#0c6b60] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Contact Info & Store Details */}
        <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Address */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <MapPin className="w-4 h-4 text-[#8c4b3f] shrink-0" />
                <span>Store Physical Address</span>
              </div>
              <p className="text-stone-800 font-semibold leading-relaxed">
                {STORE_INFO.address}
              </p>
              <p className="text-stone-600 font-medium">
                Taluka: {STORE_INFO.taluka}, Dist: {STORE_INFO.district}, PIN: {STORE_INFO.pincode}
              </p>
              <div className="pt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700">Plus Code:</span>
                <span className="bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-800 font-bold">{STORE_INFO.plusCode}</span>
              </div>
            </div>

            {/* Timings */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <Clock className="w-4 h-4 text-[#8c4b3f] shrink-0" />
                <span>Store Timings</span>
              </div>
              <p className="text-stone-900 font-extrabold text-sm">
                {STORE_INFO.openingHours}
              </p>
              <p className="text-stone-600">
                Serving all farmers, contractors, and local homeowners in Sonwadi & Daund taluka.
              </p>
              <div className="pt-1 text-[11px] text-[#8c4b3f] font-semibold">
                ✓ Local bike dispatch (MH42AU5236) during business hours
              </div>
            </div>

            {/* Direct Calling Hotline */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <Phone className="w-4 h-4 text-[#8c4b3f] shrink-0" />
                <span>Direct Contact Numbers</span>
              </div>
              <div className="space-y-1">
                <div>
                  <a href={`tel:${STORE_INFO.phoneMain}`} className="font-extrabold text-stone-900 text-base hover:underline block font-mono">
                    {STORE_INFO.phoneMain}
                  </a>
                  <span className="text-[11px] text-stone-500">Listed on Google Maps / Primary Line</span>
                </div>
                <div className="pt-1">
                  <a href={`tel:${STORE_INFO.phoneSecondary}`} className="font-semibold text-stone-800 hover:underline block font-mono">
                    {STORE_INFO.phoneSecondary}
                  </a>
                  <span className="text-[11px] text-stone-500">Direct Mobile & WhatsApp Dispatch</span>
                </div>
              </div>
            </div>

            {/* Website & Online Channels */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <Globe className="w-4 h-4 text-[#8c4b3f] shrink-0" />
                <span>Online Presence</span>
              </div>
              <div>
                <a
                  href={`http://${STORE_INFO.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#8c4b3f] text-sm hover:underline block font-mono"
                >
                  {STORE_INFO.website}
                </a>
                <span className="text-[11px] text-stone-500">Official Web Domain</span>
              </div>
              <div className="pt-1.5">
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#128C7E] hover:underline font-semibold block"
                >
                  WhatsApp: +91 70587 29696
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Direct Contact / Inquiry Form */}
        <div className="lg:col-span-5 p-6 md:p-8 bg-stone-50/80 border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base font-display mb-1">
              Send Inquiry or Material List
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Need prices for hardware, drip pipes, fencing wire, or schedule local delivery to your Sonwadi / Daund farm? Submit below.
            </p>

            {submitted ? (
              <div className="p-6 bg-stone-100 border border-stone-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#8c4b3f] mx-auto" />
                <h4 className="font-bold text-stone-900 text-sm">Inquiry Received!</h4>
                <p className="text-xs text-stone-700">
                  Thank you, {formData.name}. Shankar Hardware will contact you at {formData.phone} shortly.
                </p>
                <div className="pt-2">
                  <a
                    href={getWhatsAppDirectUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#128C7E] text-white rounded-lg text-xs font-semibold hover:bg-[#0c6b60] transition-colors"
                  >
                    <span>Send Message on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Balasaheb Pawar"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="070587 29696"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Village / Gat No.</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Sonwadi / Girim"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.inquiryType}
                    onChange={e => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                  >
                    <option value="Materials Quotation">Hardware & Agro Materials Price Quotation</option>
                    <option value="Drip Irrigation Layout">Drip Irrigation & Pipe Requirement</option>
                    <option value="Agro Fencing & Hardware Order">GI Barbed Wire, Fencing & Heavy Hardware</option>
                    <option value="Local Delivery Inquiry">Local Delivery Schedule (Bike MH42AU5236)</option>
                    <option value="Power Tool Inquiry">Power Tools / Battery Sprayer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Material Details</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="List required items, pipe diameters, wire rolls, or farm drop details..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8c4b3f]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-[#8c4b3f] hover:bg-[#773f35] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Store</span>
                  </button>
                  <a
                    href={getWhatsAppDirectUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#128C7E] hover:bg-[#0c6b60] text-white rounded-lg font-bold transition-colors shadow-xs"
                    title="Send via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </form>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Store Phone:</span>
            <span className="font-semibold text-stone-800 font-mono">{STORE_INFO.phoneMain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
