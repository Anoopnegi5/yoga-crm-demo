export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { name: 'India', code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', dialCode: '+971' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', dialCode: '+65' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾', dialCode: '+60' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', dialCode: '+966' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', dialCode: '+974' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲', dialCode: '+968' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', dialCode: '+965' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭', dialCode: '+973' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', dialCode: '+64' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', dialCode: '+27' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', dialCode: '+353' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', dialCode: '+31' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', dialCode: '+41' }
];
