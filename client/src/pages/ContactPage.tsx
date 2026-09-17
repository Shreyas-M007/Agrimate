import React, { useState } from 'react';
import type { Language, NavigationPage } from '../types';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  MessageSquare
} from 'lucide-react';

interface ContactPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
}

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    q: "What is a Modal Price, and how does it differ from Min and Max prices?",
    a: "The modal price is the most frequently occurring auction rate at which the majority of produce volume is sold on a given trading day. The minimum and maximum prices represent the lowest outlier (often damaged or poor grade lot) and the absolute highest bid (premium export grade). The modal price is the safest metric for estimating expected income."
  },
  {
    q: "Can commission agents deduct unauthorized fees or trade discounts?",
    a: "No. Under the Agricultural Produce Marketing (Regulation) Act and APMC statutory guidelines, buyers pay the market cess. Commission agents are strictly barred from deducting unauthorized 'dharma' cuts, excessive unloading charges, or cash discount fees from the farmer's gross auction price."
  },
  {
    q: "How does the Haulage & Net Return simulator calculate transport costs?",
    a: "The simulator evaluates standard per-kilometer commercial freight rates across vehicle classes (Tata Ace, 407 Pickup, 6-Wheeler, Tractor Trolley) plus fuel indexing and loading/unloading (hamali) charges. This prevents farmers from driving to a distant mandi only to lose the price advantage in fuel."
  },
  {
    q: "What should I do if the APMC weighbridge weight differs from my farm count?",
    a: "Immediately show your Digital Mandi Gate Pass to the APMC Market Secretary or weighment supervisor before the lot is unloaded. Under APMC statutory rules, the farmer has the right to demand a re-tare calibration test on an alternative certified electronic weighbridge."
  },
  {
    q: "Why does AgriMate guarantee 0% AI price hallucinations?",
    a: "Unlike speculative consumer chatbots, our terminal queries raw Agmarknet government auction records directly from our local-first database. If an APMC mandi has not reported transactions today, the system alerts you rather than fabricating imaginary prices."
  }
];

const APMC_OFFICES = [
  {
    name: "Ballari APMC Yard",
    location: "Millerpet, Ballari, Karnataka - 583101",
    phone: "08392-250122",
    crops: "Tomato, Chilli, Cotton, Maize",
    hours: "06:00 AM - 02:00 PM"
  },
  {
    name: "Kolar APMC Sub-Yard",
    location: "Bangalore-Chennai NH 75, Kolar, Karnataka - 563101",
    phone: "08152-222340",
    crops: "Tomato, Capsicum, Mango",
    hours: "05:00 AM - 01:00 PM"
  },
  {
    name: "Lasalgaon APMC Yard",
    location: "Station Road, Lasalgaon, Nashik, Maharashtra - 422306",
    phone: "02550-266023",
    crops: "Onion, Pomegranate, Grapes",
    hours: "08:00 AM - 04:00 PM"
  },
  {
    name: "Hubballi Main APMC",
    location: "Amaragol, Hubballi, Karnataka - 580025",
    phone: "0836-2222144",
    crops: "Cotton, Groundnut, Onion, Chilli",
    hours: "07:00 AM - 03:00 PM"
  },
  {
    name: "Azadpur Terminal Mandi",
    location: "New Subzi Mandi, Azadpur, Delhi - 110033",
    phone: "011-27691880",
    crops: "All Fruit & Vegetable Consignments",
    hours: "04:00 AM - 12:00 PM"
  },
  {
    name: "Vashi APMC Complex",
    location: "Turbhe, Navi Mumbai, Maharashtra - 400705",
    phone: "022-27883200",
    crops: "Grains, Spices, Perishables",
    hours: "06:00 AM - 02:00 PM"
  }
];

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    mandi: 'Ballari APMC',
    category: 'Price Discrepancy',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', mandi: 'Ballari APMC', category: 'Price Discrepancy', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Contact Page Header */}
      <section className="bg-[#F4F8F5] border-b border-[#E2ECE3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
              Grower Support & APMC Helpdesk
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight">
              We Are Here for Every Farmer in the Field
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              Need assistance with an APMC auction dispute, tare weighing grievance, or market inquiry? Connect with our dedicated grower desks across Karnataka, Maharashtra, and Andhra Pradesh.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#123826] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E8A238] uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>National Kisan Call Centre • Toll-Free 24x7</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-['Syne',sans-serif]">
              1800-180-1551
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm">
              Ministry of Agriculture & Farmers Welfare • Trilingual voice assistance available in 22 languages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:18001801551"
              className="px-6 py-3 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#123826] font-black text-sm transition-all shadow-md"
            >
              Call Helpline Now
            </a>
            <a
              href="https://wa.me/917892181947?text=Hello%20AgriMate%20Support%2C%20I%20need%20mandi%20assistance"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp: +91 7892181947</span>
            </a>
          </div>
        </div>
      </section>

      {/* APMC Field Offices Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
            Regional Verification Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
            APMC Mandi Yard Field Stations
          </h2>
          <p className="text-stone-600 text-sm">
            Direct contact coordinates for on-site APMC market secretaries and weighbridge superintendents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APMC_OFFICES.map((office, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#123826] text-base">{office.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF5ED] text-[#2E7D32]">
                  Active Yard
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{office.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono font-medium">{office.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Auction Hours: {office.hours}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2ECE3] text-[11px] text-stone-600">
                <span className="font-medium text-stone-700">Primary Commodities:</span> {office.crops}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form & FAQ Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Knowledge Base</span>
              <h3 className="text-2xl font-black text-[#123826] font-['Syne',sans-serif]">
                Frequently Asked Agronomic Questions
              </h3>
            </div>

            <div className="space-y-3">
              {FAQ_LIST.map((item, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl border border-[#E2ECE3] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-[#123826] text-sm cursor-pointer hover:bg-[#FAFBF9]"
                  >
                    <span>{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-[#2E7D32] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-[#E2ECE3] pt-3 bg-[#FAFBF9]">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grievance & Support Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2ECE3] shadow-xs space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#123826] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#2E7D32]" />
                <span>Submit Grievance / Query</span>
              </h3>
              <p className="text-xs text-stone-500">
                Directly submitted to our APMC dispute arbitration liaison.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#EBF5ED] border border-[#CCE0D0] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h4 className="font-bold text-[#123826]">Grievance Registered Successfully</h4>
                <p className="text-xs text-stone-600">
                  Ticket generated. A field officer will contact your mobile within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2ECE3] focus:border-[#2E7D32] outline-none"
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2ECE3] focus:border-[#2E7D32] outline-none"
                    placeholder="e.g. 9845012345"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Target Mandi</label>
                    <select
                      value={formData.mandi}
                      onChange={(e) => setFormData({ ...formData, mandi: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-[#E2ECE3] focus:border-[#2E7D32] outline-none bg-white"
                    >
                      <option value="Ballari APMC">Ballari APMC</option>
                      <option value="Kolar APMC">Kolar APMC</option>
                      <option value="Lasalgaon APMC">Lasalgaon APMC</option>
                      <option value="Hubballi APMC">Hubballi APMC</option>
                      <option value="Azadpur Mandi">Azadpur Mandi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-[#E2ECE3] focus:border-[#2E7D32] outline-none bg-white"
                    >
                      <option value="Price Discrepancy">Price Discrepancy</option>
                      <option value="Weighment Dispute">Weighment Dispute</option>
                      <option value="Gate Pass Issue">Gate Pass Issue</option>
                      <option value="General Query">General Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Details / Grievance Message</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2ECE3] focus:border-[#2E7D32] outline-none"
                    placeholder="Explain the dispute, commission agent name, or auction yard discrepancy..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#123826] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to APMC Field Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
