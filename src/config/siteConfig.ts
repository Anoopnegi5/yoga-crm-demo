// Centralized Configuration for Yoga Studio & CRM Demo
// Edit these values in one place or via the in-app Settings tab to update the entire website & CRM!

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  quote: string;
  rating: number;
  isPlaceholder?: boolean;
}

export const SITE_CONFIG = {
  brandName: "Prana Yoga Studio",
  tagline: "Yoga • Wellness • Mindful Living",
  instructorName: "Aarav Sharma",
  title: "Certified Yoga Instructor & Wellness Coach",
  
  // WhatsApp Configuration (Destination number for Free Demo lead generation)
  whatsappNumber: "+912345678901", // Primary WhatsApp destination number
  displayPhone: "+91 23456 78901",
  displayPhone2: "+91 23456 78902",
  email: "Negianoop99@gmail.com",

  // Social Links
  socials: {
    instagram: "https://instagram.com",
    instagramHandle: "@pranayogastudio",
    youtube: "https://youtube.com",
    youtubeHandle: "@pranayogastudio",
    linkedin: "https://linkedin.com",
    linkedinHandle: "@pranayoga",
    googleReviews: "https://google.com",
  },

  // Images
  logoImage: "/logo.png",
  heroImage: "/hero-group-yoga.jpg",
  aboutImage: "/instructor-hero.jpg",

  // Demo Availability & Pricing Config
  demoClassAvailability: "Daily Live Sessions (Morning & Evening)",
  demoClassPrice: "FREE (1-Day Trial)",
  
  pricing: {
    personalOneOnOne: "₹10,000 / month",
    groupClasses: "₹3,500 / month",
    perSession: "₹1,000 / session"
  },

  // Class Timings
  classTimings: [
    { label: "Morning Batch 1", time: "06:00 AM - 07:00 AM IST" },
    { label: "Morning Batch 2", time: "07:15 AM - 08:15 AM IST" },
    { label: "Evening Batch 1", time: "05:00 PM - 06:00 PM IST" },
    { label: "Evening Batch 2", time: "06:30 PM - 07:30 PM IST" },
  ],

  // Testimonials
  testimonials: [
    {
      id: "t1",
      name: "Priya Sharma",
      location: "New Delhi",
      quote: "The sessions have completely transformed my posture and daily energy levels. The step-by-step guidance makes online yoga feel like a personal studio at home!",
      rating: 5,
      isPlaceholder: false
    },
    {
      id: "t2",
      name: "Meera Nair",
      location: "Bangalore",
      quote: "As a complete beginner suffering from lower back stiffness, I was hesitant. The instructor adapted every pose for my body. Within 4 weeks, my mobility improved dramatically.",
      rating: 5,
      isPlaceholder: false
    },
    {
      id: "t3",
      name: "Ritu Verma",
      location: "Mumbai",
      quote: "The 60-minute session is perfectly structured — strength, breathwork, and deep relaxation. Attentive, calm, and truly cares about individual progress.",
      rating: 5,
      isPlaceholder: false
    },
    {
      id: "t4",
      name: "Rohan Verma",
      location: "Verified Practitioner",
      quote: "Personal attention and customized yoga routines have helped me achieve my health and fitness goals.",
      rating: 5,
      isPlaceholder: false
    }
  ] as Testimonial[]
};

export const DEFAULT_WEBSITE_CMS = {
  // Top Announcement & Brand
  announcementBar: "🌸 1-Day Free Trial Available • Book Your Live Demo Session Today",
  brandName: "Prana Yoga Studio",
  instructorName: "Aarav Sharma",
  tagline: "Yoga Should Fit Into Your Life, Not Make It Complicated",

  // Hero Section (#home)
  heroTagline: "CERTIFIED YOGA INSTRUCTOR & HOLISTIC WELLNESS COACH",
  heroTitle: "Transform Your Body, Mind & Spirit With Authentic Yoga",
  heroSubtitle: "Experience personalized online 1-on-1 sessions and energetic group batches tailored for holistic wellness practitioners.",
  heroImage: "/hero-group-yoga.jpg",

  // Why Choose Us Section (#benefits)
  whyTitle: "Why Choose Our Studio?",
  whySubtitle: "Experience authentic, personalized yoga tailored around your unique body, goals and schedule.",
  whyCard1Title: "Personal 1-on-1 Attention",
  whyCard1Desc: "Customized live posture alignment, breathing guidance and pace designed specifically for your body and strength.",
  whyCard2Title: "Flexible Timing & Batches",
  whyCard2Desc: "Morning and Evening online group batches and private slots that seamlessly fit your daily lifestyle.",
  whyCard3Title: "Holistic Health Focus",
  whyCard3Desc: "Combines physical asanas, core strength, joint mobility, stress relief, and pranayama breathing.",
  whyCard4Title: "Beginner Friendly Environment",
  whyCard4Desc: "Step-by-step gentle progression with zero pressure. Suitable for all age groups and experience levels.",

  // About Section (#about)
  aboutTitle: "Meet Your Instructor",
  aboutQuote: '"Yoga should fit into your life, not make your life complicated."',
  aboutBio1: "Certified yoga instructor and wellness coach dedicated to helping practitioners build sustainable movement habits, core strength, and inner stillness.",
  aboutBio2: "Sessions combine yoga asanas, mobility work, pranayama, breathing practices, relaxation and mindful movement.",
  aboutImage: "/instructor-hero.jpg",

  // Yoga Programs Section (#classes)
  classesTitle: "Yoga Programs Designed Around You",
  classesSubtitle: "Choose the practice format that fits your daily routine, goals and lifestyle.",
  personalClassTitle: "Personal Online Yoga",
  personalClassDesc: "Customized live 1-on-1 yoga adapted specifically to your body structure, health goals, injuries and daily pace.",
  personalClassPrice: "₹10,000 / month",
  groupClassTitle: "Group Yoga Batches",
  groupClassDesc: "Energetic, motivating online group sessions designed for consistent daily practice and community spirit.",
  groupClassPrice: "₹3,500 / month",
  wellnessClassTitle: "Wellness & Care Yoga",
  wellnessClassDesc: "Therapeutic yoga focused on back pain relief, joint mobility, stress reduction, and hormonal balance.",
  wellnessClassPrice: "₹5,000 / month",

  // Goals Section (#goals)
  goalsTitle: "Programs Targeted To Your Health Goals",
  goalsSubtitle: "Specific practices designed to deliver real, noticeable health transformations.",

  // Onboarding Section (#onboarding)
  onboardingTitle: "Simple 4-Step Onboarding Process",
  onboardingSubtitle: "Start your personalized yoga journey in 4 easy steps.",
  step1Title: "Book Free Demo",
  step1Desc: "Fill out the quick 1-minute form to choose your preferred demo slot.",
  step2Title: "Select Batch & Time",
  step2Desc: "Pick 1-on-1 or group batch timing that fits your schedule.",
  step3Title: "Receive Custom Plan",
  step3Desc: "Instructor reviews your health notes and crafts your routine.",
  step4Title: "Begin Practice",
  step4Desc: "Join live online sessions and build sustainable health habits.",

  // Timeline Section
  timelineTitle: "60 Minutes For You",
  timelineSubtitle: "Every session is structured to balance movement, strength, breath and relaxation.",

  // Testimonials Section (#testimonials)
  testimonialsTitle: "What My Students Say",
  testimonialsSubtitle: "Real stories from practitioners who transformed their health and daily peace.",

  // FAQ Section (#faq)
  faqTitle: "Frequently Asked Questions",
  faqSubtitle: "Got questions? Here is everything you need to know about joining our studio.",

  // Contact / Final CTA Section (#contact)
  contactTitle: "Ready to Transform Your Body & Peace of Mind?",
  contactSubtitle: "Join our studio today for personalized guidance, core strength and daily tranquility.",
  contactImage: "/instructor-mountain-pose.jpg",
  logoImage: "/logo.png",

  // Contacts & Social Links
  displayPhone: "+91 23456 78901",
  displayPhone2: "+91 23456 78902",
  email: "Negianoop99@gmail.com",
  googleReviewsUrl: "https://google.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com"
};
