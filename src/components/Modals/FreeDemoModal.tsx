import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SITE_CONFIG } from '../../config/siteConfig';
import { COUNTRIES, Country } from '../../data/countries';
import { X, MessageCircle, Sparkles, Search, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGoal?: string;
  defaultProgram?: string;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultGoal = '', 
  defaultProgram = 'Group Yoga Classes' 
}) => {
  const { addClient, customGroupBatches, showSuccessToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default India +91
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [whatsappNum, setWhatsappNum] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(defaultProgram || 'Group Yoga Classes');
  const [goal, setGoal] = useState(defaultGoal || 'Flexibility');
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [selectedGroupBatch, setSelectedGroupBatch] = useState(
    customGroupBatches?.[0] || 'Morning Vinyasa Batch (07:00 AM)'
  );
  const [agreeContact, setAgreeContact] = useState(true);

  // Sync state when props change
  useEffect(() => {
    if (defaultProgram) {
      setSelectedProgram(defaultProgram);
    }
    if (defaultGoal) {
      setGoal(defaultGoal);
    }
  }, [defaultProgram, defaultGoal]);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(c => 
    (c.name || '').toLowerCase().includes((countrySearch || '').toLowerCase()) || 
    (c.dialCode || '').includes(countrySearch) ||
    (c.code || '').toLowerCase().includes((countrySearch || '').toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const cleanPhoneDigits = whatsappNum.replace(/[^0-9]/g, '');

    if (!trimmedName) {
      alert('Please enter your full name.');
      return;
    }

    if (!cleanPhoneDigits || cleanPhoneDigits.length < 7) {
      alert('Please enter a valid WhatsApp number.');
      return;
    }

    if (!agreeContact) {
      alert('Please agree to be contacted on WhatsApp.');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dialCode} ${cleanPhoneDigits}`;

    // 1. WhatsApp Automated Message Generation with Selected Program & Group Batch
    const waMessage = `Hi Anjali! 👋\n\nI would like to join the Free Demo Yoga Class.\n\n• Name: ${trimmedName}\n• WhatsApp: ${fullPhoneNumber}\n• Selected Program: ${selectedProgram}\n• Selected Group Batch: ${selectedGroupBatch}\n• My Goal: ${goal}\n• Preferred Time: ${preferredTime}\n\nPlease share the available demo class timings. 🧘🌿`;

    // Destination WhatsApp Business Number from SITE_CONFIG
    const destinationNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');

    // Open WhatsApp directly
    const waUrl = `https://api.whatsapp.com/send?phone=${destinationNumber}&text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    // 2. Feed Client Data into AppContext for Trainer Backend Management
    const todayStr = new Date().toISOString().split('T')[0];
    addClient({
      name: trimmedName,
      gender: 'Female',
      phone: fullPhoneNumber,
      whatsapp: fullPhoneNumber,
      address: `${selectedCountry.name} (${selectedCountry.code})`,
      joiningDate: todayStr,
      photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(trimmedName)}`,
      classTime: preferredTime === 'Morning' ? '07:00 AM' : preferredTime === 'Afternoon' ? '12:00 PM' : '05:00 PM',
      days: ['Mon', 'Wed', 'Fri'],
      timeSlot: preferredTime === 'Morning' ? 'Morning' : 'Evening',
      sessionType: selectedProgram.includes('Group') ? 'Group' : 'Personal',
      groupName: selectedGroupBatch || selectedProgram,
      reasonsForJoining: [goal],
      currentProblems: [],
      feeType: 'Monthly',
      monthlyFee: 10000,
      feeDueDate: '5th',
      membershipPlan: '12 Classes',
      totalClasses: 12,
      trainerNotes: `Free Demo Lead via Website on ${todayStr}. Program: ${selectedProgram}, Batch: ${selectedGroupBatch}, Goal: ${goal}, Preferred Time: ${preferredTime}`,
      goal: goal
    });

    showSuccessToast(`Opening WhatsApp for Anjali Negi! Selected: ${selectedProgram}. Welcome ${trimmedName}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3F4D2A]/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#F7F3E8] rounded-3xl w-full max-w-lg shadow-2xl border border-[#EAE4D5] relative overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#68784B] to-[#3F4D2A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#F7F3E8]">Book Your Free Yoga Demo</h3>
              <p className="text-xs text-[#F7F3E8]/80 font-sans">Tell us a little about yourself and we'll connect with you on WhatsApp.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          
          {/* Field 1: Full Name */}
          <div>
            <label className="block font-bold text-[#3F4D2A] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EAE4D5] text-slate-900 font-semibold focus:ring-2 focus:ring-[#68784B] outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Field 2: Searchable Country Code + WhatsApp Number */}
          <div>
            <label className="block font-bold text-[#3F4D2A] mb-1">WhatsApp Number *</label>
            
            <div className="flex items-center gap-2 relative">
              
              {/* Country Code Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-white border border-[#EAE4D5] font-bold text-slate-800 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Country Search Dropdown */}
                {isCountryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-2 animate-fadeIn">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country or code..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                            setCountrySearch('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F7F3E8] text-slate-800 text-xs text-left transition-colors"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                          <span className="font-bold text-[#68784B]">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                required
                value={whatsappNum}
                onChange={(e) => setWhatsappNum(e.target.value)}
                placeholder="WhatsApp number"
                className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#EAE4D5] text-slate-900 font-semibold focus:ring-2 focus:ring-[#68784B] outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Field 3: Selected Program Option */}
          <div>
            <label className="block font-bold text-[#3F4D2A] mb-1">Selected Yoga Program Choice *</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#EAE4D5]/60 border border-[#68784B]/40 text-[#2D3B27] font-extrabold focus:ring-2 focus:ring-[#68784B] outline-none"
            >
              <option value="Group Yoga Classes">👥 Group Yoga Classes</option>
              <option value="Wellness-Focused Yoga">🌿 Wellness-Focused Yoga</option>
              <option value="General Yoga Inquiry">✨ General Yoga Inquiry</option>
            </select>
          </div>

          {/* Field 4: Main Goal */}
          <div>
            <label className="block font-bold text-[#3F4D2A] mb-1">Your Main Goal (Optional)</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EAE4D5] text-slate-900 font-bold focus:ring-2 focus:ring-[#68784B] outline-none"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Strength">Strength</option>
              <option value="Stress Relief">Stress Relief</option>
              <option value="PCOS Wellness">PCOS Wellness</option>
              <option value="Thyroid Wellness">Thyroid Wellness</option>
              <option value="Back Pain Relief">Back Pain Relief</option>
              <option value="Sciatica Relief">Sciatica Relief</option>
              <option value="Beginner Yoga">Beginner Yoga</option>
              <option value="General Fitness">General Fitness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Field 5: Preferred Class Time */}
          <div>
            <label className="block font-bold text-[#3F4D2A] mb-1">Preferred Class Time (Optional)</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EAE4D5] text-slate-900 font-bold focus:ring-2 focus:ring-[#68784B] outline-none"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>



          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 font-medium leading-relaxed">
              <input
                type="checkbox"
                checked={agreeContact}
                onChange={(e) => setAgreeContact(e.target.checked)}
                className="w-4 h-4 rounded text-[#68784B] focus:ring-[#68784B] border-slate-300 mt-0.5"
              />
              <span>I agree to be contacted on WhatsApp regarding my free demo class.</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-[#EAE4D5]">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#68784B] to-[#3F4D2A] hover:from-[#58673E] hover:to-[#333F22] text-[#F7F3E8] font-extrabold text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-300" />
              GET MY FREE DEMO →
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
