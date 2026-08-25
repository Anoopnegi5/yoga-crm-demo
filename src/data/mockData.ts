import { Client, PaymentRecord, LeaveRecord, AttendanceRecord, TrainerProfile, TrainerLeave, TrainerDreamGoal, BlogPost } from '../types';

export const DEFAULT_TRAINER_PROFILE: TrainerProfile = {
  name: 'Aarav Sharma',
  studioName: 'Prana Yoga Studio',
  phone: '+91 98765 43210',
  upiId: 'pranayogastudio@upi',
  photoUrl: '/instructor-hero.jpg',
  studioLogoUrl: '/logo.png',
  appTitle: 'Prana Yoga',
  appSubtitle: 'Yoga Journal & Fee Manager'
};

export const INITIAL_TRAINER_LEAVES: TrainerLeave[] = [
  {
    id: 'tl-1',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    reason: 'Independence Day Yoga Workshop Preparation',
    status: 'Self Practice',
    notes: 'Studio open for self-guided meditation'
  }
];

export const INITIAL_TRAINER_DREAMS: TrainerDreamGoal[] = [
  {
    id: 'dream-1',
    title: 'Expand to Dedicated Oceanfront Yoga Shala',
    targetAmount: 500000,
    savedAmount: 210000,
    photoUrl: '/hero-group-yoga.jpg',
    targetDate: '2027-12-31',
    category: 'Long Term',
    notes: 'Natural bamboo and wooden studio with natural airflow and live plants.'
  },
  {
    id: 'dream-2',
    title: 'Rishikesh 300-Hr Master Teacher Immersion',
    targetAmount: 85000,
    savedAmount: 55000,
    photoUrl: '/about-instructor.jpg',
    targetDate: '2026-11-30',
    category: 'Short Term',
    notes: 'Advanced alignment, pranayama therapy and sound healing immersion.'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    gender: 'Female',
    phone: '+91 98111 22334',
    whatsapp: '+91 98111 22334',
    address: 'Indiranagar, Bengaluru',
    joiningDate: '2026-01-15',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    classTime: '06:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: 'Morning',
    sessionType: 'Group',
    groupName: 'Morning Vinyasa Flow (6:00 AM)',
    reasonsForJoining: ['Spine Flexibility', 'Lower Back Pain Relief'],
    currentProblems: ['L4-L5 mild stiffness from desk job'],
    feeType: 'Monthly',
    feeStartMonth: '2026-08',
    monthlyFee: 3500,
    feeDueDate: '5th',
    membershipPlan: '12 Classes',
    completedClasses: 9,
    totalClasses: 12,
    paymentStatus: 'Paid',
    status: 'Active',
    trainerNotes: 'Very dedicated student. Focus on gentle lumbar extensions and hamstring opening.',
    goal: 'Lower Back Pain Relief & Flexibility',
    startingWeight: 62.0,
    targetWeight: 58.0,
    weightLogs: [
      { id: 'w1', date: '2026-06-01', weight: 62.0, notes: 'Starting baseline' },
      { id: 'w2', date: '2026-07-15', weight: 60.5, notes: 'Improved core stability' },
      { id: 'w3', date: '2026-08-10', weight: 59.2, notes: 'Feeling agile and free of pain' }
    ],
    medicalPrecautions: ['Avoid sudden hyperextensions']
  },
  {
    id: 'c2',
    name: 'Rohan Verma',
    gender: 'Male',
    phone: '+91 98222 33445',
    whatsapp: '+91 98222 33445',
    address: 'Koramangala, Bengaluru',
    joiningDate: '2026-02-01',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    classTime: '07:15 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlot: 'Morning',
    sessionType: 'Group',
    groupName: 'Power & Core Strength (7:15 AM)',
    reasonsForJoining: ['Weight Loss', 'Cardio Endurance', 'Stress Management'],
    currentProblems: ['Work stress, mild hypertension'],
    feeType: 'Monthly',
    feeStartMonth: '2026-08',
    monthlyFee: 4000,
    feeDueDate: '1st',
    membershipPlan: '20 Classes',
    completedClasses: 14,
    totalClasses: 20,
    paymentStatus: 'Paid',
    status: 'Active',
    trainerNotes: 'Responds well to Surya Namaskar variations and Kapalbhati pranayama.',
    goal: 'Weight Loss & Cardiovascular Endurance',
    startingWeight: 84.0,
    targetWeight: 76.0,
    weightLogs: [
      { id: 'w4', date: '2026-05-10', weight: 84.0, notes: 'Baseline' },
      { id: 'w5', date: '2026-07-01', weight: 80.2, notes: 'Consistent practice' },
      { id: 'w6', date: '2026-08-18', weight: 77.8, notes: 'Strong progress' }
    ],
    medicalPrecautions: ['Hydrate well before morning batch']
  },
  {
    id: 'c3',
    name: 'Ananya Iyer',
    gender: 'Female',
    phone: '+91 98333 44556',
    whatsapp: '+91 98333 44556',
    address: 'HSR Layout, Bengaluru',
    joiningDate: '2026-03-10',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    classTime: '05:00 PM',
    days: ['Mon', 'Wed', 'Fri'],
    timeSlot: 'Evening',
    sessionType: 'Personal',
    groupName: '1-on-1 Personalized Session',
    reasonsForJoining: ['Posture Alignment', 'Breathing Techniques'],
    currentProblems: ['Shoulder hunch, neck stiffness'],
    feeType: 'Monthly',
    feeStartMonth: '2026-08',
    monthlyFee: 10000,
    feeDueDate: '10th',
    membershipPlan: '12 Classes',
    completedClasses: 8,
    totalClasses: 12,
    paymentStatus: 'Paid',
    status: 'Active',
    trainerNotes: 'Personal 1-on-1 client. Very precise with alignment. Loves restorative yoga sequences at end of session.',
    goal: 'Posture Correction & Cervical Relief',
    startingWeight: 55.0,
    targetWeight: 54.0,
    weightLogs: [
      { id: 'w7', date: '2026-06-15', weight: 55.0 },
      { id: 'w8', date: '2026-08-01', weight: 54.2 }
    ],
    medicalPrecautions: ['No heavy neck compression poses']
  },
  {
    id: 'c4',
    name: 'Rajesh Patel',
    gender: 'Male',
    phone: '+91 98444 55667',
    whatsapp: '+91 98444 55667',
    address: 'Whitefield, Bengaluru',
    joiningDate: '2026-04-01',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    classTime: '06:30 PM',
    days: ['Tue', 'Thu', 'Sat'],
    timeSlot: 'Evening',
    sessionType: 'Group',
    groupName: 'Evening Mindful De-stress (6:30 PM)',
    reasonsForJoining: ['Stress Relief', 'Flexibility'],
    currentProblems: ['Tight hamstrings, high corporate stress'],
    feeType: 'Monthly',
    feeStartMonth: '2026-08',
    monthlyFee: 3500,
    feeDueDate: '5th',
    membershipPlan: '12 Classes',
    completedClasses: 7,
    totalClasses: 12,
    paymentStatus: 'Pending',
    status: 'Active',
    trainerNotes: 'Gentle progression. Send friendly payment reminder on 5th of every month.',
    goal: 'Mindfulness & Hamstring Mobility',
    startingWeight: 78.0,
    targetWeight: 74.0,
    weightLogs: [],
    medicalPrecautions: []
  },
  {
    id: 'c5',
    name: 'Sneha Kulkarni',
    gender: 'Female',
    phone: '+91 98555 66778',
    whatsapp: '+91 98555 66778',
    address: 'JP Nagar, Bengaluru',
    joiningDate: '2026-05-15',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    classTime: '06:00 AM',
    days: ['Sat', 'Sun'],
    timeSlot: 'Morning',
    sessionType: 'Group',
    groupName: 'Weekend Intensive Workshop',
    reasonsForJoining: ['Weekend Wellness', 'Immunity'],
    currentProblems: ['Occasional knee stiffness'],
    feeType: 'Per Session',
    feeStartMonth: '2026-08',
    perSessionFee: 1000,
    monthlyFee: 2000,
    feeDueDate: 'Per Class',
    membershipPlan: 'Per Session',
    completedClasses: 2,
    totalClasses: 4,
    paymentStatus: 'Paid',
    status: 'Active',
    trainerNotes: 'Attends per session on weekends. Prefers Pranayama and guided meditation.',
    goal: 'Weekend Rejuvenation',
    startingWeight: 58.0,
    targetWeight: 57.0,
    weightLogs: [],
    medicalPrecautions: ['Use knee pad for kneeling poses']
  },
  {
    id: 'c6',
    name: 'Vikram Mehta',
    gender: 'Male',
    phone: '+91 98666 77889',
    whatsapp: '+91 98666 77889',
    address: 'MG Road, Bengaluru',
    joiningDate: '2026-06-01',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    classTime: '05:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlot: 'Evening',
    sessionType: 'Group',
    groupName: 'Evening Mindful De-stress (6:30 PM)',
    reasonsForJoining: ['Deep Breathing', 'Sleep Quality'],
    currentProblems: ['Insomnia and restlessness'],
    feeType: 'Monthly',
    feeStartMonth: '2026-08',
    monthlyFee: 3500,
    feeDueDate: '1st',
    membershipPlan: 'Unlimited',
    completedClasses: 11,
    totalClasses: 24,
    paymentStatus: 'Paid',
    status: 'Active',
    trainerNotes: 'Showing remarkable improvement in sleep patterns after Yin yoga & Yoga Nidra.',
    goal: 'Deep Sleep & Nervous System Regulation',
    startingWeight: 72.0,
    targetWeight: 70.0,
    weightLogs: [],
    medicalPrecautions: []
  }
];

export const INITIAL_LEAVES: LeaveRecord[] = [
  {
    id: 'leave-1',
    clientId: 'c1',
    clientName: 'Priya Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    startDate: '2026-08-12',
    endDate: '2026-08-12',
    date: '2026-08-12',
    reason: 'Family Function Out of Station',
    duration: '1 Day (2026-08-12)'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'p101',
    clientId: 'c1',
    clientName: 'Priya Sharma',
    amount: 3500,
    date: '2026-08-03',
    month: '2026-08',
    paymentMode: 'UPI',
    paymentMethod: 'Google Pay',
    status: 'Paid',
    notes: 'August Monthly Fee (12 classes pass)'
  },
  {
    id: 'p102',
    clientId: 'c2',
    clientName: 'Rohan Verma',
    amount: 4000,
    date: '2026-08-01',
    month: '2026-08',
    paymentMode: 'UPI',
    paymentMethod: 'PhonePe',
    status: 'Paid',
    notes: 'August Monthly 20-class pass'
  },
  {
    id: 'p103',
    clientId: 'c3',
    clientName: 'Ananya Iyer',
    amount: 10000,
    date: '2026-08-08',
    month: '2026-08',
    paymentMode: 'Bank',
    paymentMethod: 'NEFT Transfer',
    status: 'Paid',
    notes: 'Personal 1-on-1 Monthly Fee'
  },
  {
    id: 'p104',
    clientId: 'c5',
    clientName: 'Sneha Kulkarni',
    amount: 1000,
    date: '2026-08-16',
    month: '2026-08',
    paymentMode: 'UPI',
    paymentMethod: 'Paytm UPI',
    status: 'Paid',
    notes: 'Weekend Session Fee'
  },
  {
    id: 'p105',
    clientId: 'c6',
    clientName: 'Vikram Mehta',
    amount: 3500,
    date: '2026-08-02',
    month: '2026-08',
    paymentMode: 'Cash',
    paymentMethod: 'Cash',
    status: 'Paid',
    notes: 'August Unlimited pass'
  },
  {
    id: 'p106',
    clientId: 'c4',
    clientName: 'Rajesh Patel',
    amount: 3500,
    date: '2026-08-05',
    month: '2026-08',
    paymentMode: 'UPI',
    paymentMethod: 'UPI',
    status: 'Pending',
    notes: 'August Fee Due'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-03', status: 'Present' },
  { id: 'att-2', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-05', status: 'Present' },
  { id: 'att-3', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-07', status: 'Present' },
  { id: 'att-4', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-10', status: 'Present' },
  { id: 'att-5', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-12', status: 'Leave' },
  { id: 'att-6', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-14', status: 'Present' },
  { id: 'att-7', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-17', status: 'Present' },
  { id: 'att-8', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-19', status: 'Present' },
  { id: 'att-9', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-21', status: 'Present' },
  { id: 'att-10', clientId: 'c1', clientName: 'Priya Sharma', date: '2026-08-24', status: 'Present' },

  { id: 'att-11', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-03', status: 'Present' },
  { id: 'att-12', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-04', status: 'Present' },
  { id: 'att-13', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-05', status: 'Present' },
  { id: 'att-14', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-06', status: 'Present' },
  { id: 'att-15', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-07', status: 'Present' },
  { id: 'att-16', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-10', status: 'Present' },
  { id: 'att-17', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-11', status: 'Present' },
  { id: 'att-18', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-12', status: 'Present' },
  { id: 'att-19', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-13', status: 'Present' },
  { id: 'att-20', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-14', status: 'Present' },
  { id: 'att-21', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-17', status: 'Present' },
  { id: 'att-22', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-18', status: 'Present' },
  { id: 'att-23', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-19', status: 'Present' },
  { id: 'att-24', clientId: 'c2', clientName: 'Rohan Verma', date: '2026-08-20', status: 'Present' },

  { id: 'att-25', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-03', status: 'Present' },
  { id: 'att-26', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-05', status: 'Present' },
  { id: 'att-27', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-07', status: 'Present' },
  { id: 'att-28', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-10', status: 'Present' },
  { id: 'att-29', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-14', status: 'Present' },
  { id: 'att-30', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-17', status: 'Present' },
  { id: 'att-31', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-19', status: 'Present' },
  { id: 'att-32', clientId: 'c3', clientName: 'Ananya Iyer', date: '2026-08-21', status: 'Present' },

  { id: 'att-33', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-04', status: 'Present' },
  { id: 'att-34', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-06', status: 'Present' },
  { id: 'att-35', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-08', status: 'Present' },
  { id: 'att-36', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-11', status: 'Present' },
  { id: 'att-37', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-13', status: 'Present' },
  { id: 'att-38', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-18', status: 'Present' },
  { id: 'att-39', clientId: 'c4', clientName: 'Rajesh Patel', date: '2026-08-20', status: 'Present' }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: '5-morning-yoga-asanas-back-pain-relief',
    title: '5 Daily Morning Yoga Asanas for Instant Lower Back Pain Relief',
    excerpt: 'Sitting long hours at a desk compresses your spine. Discover 5 gentle yet highly effective yoga poses to realign your vertebrae and eliminate lower back stiffness.',
    coverImage: '/about-instructor.jpg',
    category: 'Posture & Back Pain',
    author: 'Aarav Sharma',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/instructor-hero.jpg',
    date: 'August 20, 2026',
    readTime: '4 min read',
    tags: ['Back Pain', 'Posture Correction', 'Morning Routine', 'Spine Health'],
    isPublished: true,
    featured: true,
    metaTitle: '5 Daily Morning Yoga Asanas for Lower Back Pain Relief | Prana Yoga Studio',
    metaDescription: 'Eliminate lower back pain with 5 simple morning yoga asanas. Realign your spine and improve posture with guided home practice.',
    content: `### Why Lower Back Pain Has Become Modern Society's #1 Epidemic

In our fast-paced daily lives, most of us spend 8 to 12 hours seated in front of laptops, on commutes, or hunched over smartphones. This prolonged sedentary posture places immense pressure on the lumbar spine, tightens the hip flexors, and weakens the deep core stabilizing muscles.

The good news? You do not need complex equipment or hours of painful workouts to find lasting relief. A dedicated **15-minute morning sequence of gentle, restorative asanas** can decompress your vertebrae, lubricate spinal discs, and rebuild postural balance.

---

### 1. Marjaryasana-Bitilasana (Cat-Cow Pose)
* **Target Area**: Full spinal column, neck, and pelvic tilt.
* **How to Practice**: Begin on your hands and knees in a tabletop position. Inhale deeply, drop your belly towards the mat, lift your chin and gaze upward (Cow Pose). Exhale smoothly, round your spine toward the ceiling, tucking your chin to your chest and engaging your navel (Cat Pose).
* **Repetitions**: 8–10 fluid breath cycles.

### 2. Balasana (Extended Child's Pose)
* **Target Area**: Lumbar spine decompression, hip opening, shoulders.
* **How to Practice**: Kneel on your mat with big toes touching and knees widened hip-distance apart. Fold forward from your hips, extending your arms long in front of you with palms flat, resting your forehead gently on the mat.
* **Duration**: Hold for 5–8 slow, deep diaphragmatic breaths.

### 3. Bhujangasana (Gentle Baby Cobra Pose)
* **Target Area**: Thoracic extension, erector spinae strengthening.
* **How to Practice**: Lie face down, placing palms under your shoulders. Keep elbows tucked close to your ribs. Inhale and gently lift your chest off the mat using back muscles rather than pushing through your arms. Keep your neck long and shoulders relaxed down away from your ears.
* **Repetitions**: 3–5 gentle lifts with 3-second holds.

### 4. Supta Matsyendrasana (Supine Spinal Twist)
* **Target Area**: Gluteus medius, lower back lateral release, oblique stretch.
* **How to Practice**: Lie flat on your back, hugging both knees into your chest. Extend your arms out in a 'T' shape, then gently guide both knees to the right side while gazing softly to the left.
* **Duration**: Hold for 1 minute on each side, breathing into the tightest spots.

### 5. Setu Bandhasana (Supported Bridge Pose)
* **Target Area**: Glutes, hamstrings, pelvic floor, and lumbar stabilization.
* **How to Practice**: Lie on your back with knees bent and feet hip-width apart flat on the floor. Press into your heels, engage your glutes, and lift your hips until your thighs and torso align.
* **Duration**: Hold for 30–45 seconds with calm, even breaths.

---

> *"The spine is the central pillar of human vitality. When your spine is supple and free of tension, energy flows unimpeded throughout your entire system."* — **Trainer Aarav Sharma**

### Consistency Is the Key to Lasting Relief
Practicing these 5 asanas every morning before stepping into your workstation will protect your back from cumulative strain. If you experience chronic disc issues or sciatica, personal guidance ensures each pose is modified safely for your unique anatomy.`
  },
  {
    id: 'blog-2',
    slug: 'the-science-of-vinyasa-flow-energy-breath',
    title: 'The Science of Vinyasa Flow: How Linking Breath to Movement Energizes the Body',
    excerpt: 'Vinyasa is more than a physical workout — it is moving meditation. Understand the physiological benefits of synchronized breath, heart rate variability, and cellular oxygenation.',
    coverImage: '/hero-group-yoga.jpg',
    category: 'Yoga Asanas',
    author: 'Aarav Sharma',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/instructor-hero.jpg',
    date: 'August 18, 2026',
    readTime: '5 min read',
    tags: ['Vinyasa', 'Pranayama', 'Cardio Yoga', 'Energy Flow'],
    isPublished: true,
    featured: false,
    metaTitle: 'The Science of Vinyasa Yoga Flow | Prana Yoga Studio',
    metaDescription: 'Discover how Vinyasa yoga boosts cardiovascular endurance, builds lean muscle, and calms the nervous system through dynamic breath-movement synchronization.',
    content: `### What Makes Vinyasa Flow Truly Transformative?

In classical Sanskrit, *Vinyasa* translates to *"placing in a special way"*. Unlike static yoga postures where an asana is held statically for extended durations, Vinyasa is an artful, continuous sequence where each inhalation and exhalation coordinates with a specific transition.

When you synchronize your breath (*Prana*) with bodily movement, three profound physiological shifts occur in your body:

---

### 1. Enhanced Oxygenation & Blood Circulation
During a continuous Surya Namaskar (Sun Salutation) or warrior sequence, your cardiovascular system operates in an optimal aerobic zone. The rhythmic inhalation expands lung capacity, while forceful, mindful exhalation expels residual carbon dioxide and lactic acid from muscle fibers.

### 2. Downregulation of the Sympathetic Nervous System
While modern high-intensity workouts spike cortisol (the stress hormone), Vinyasa yoga uniquely stimulates the vagus nerve through deep Ujjayi breathing. This keeps your mind centered in the parasympathetic state—meaning you burn calories and build lean muscle **without sending your nervous system into fight-or-flight overdrive**.

### 3. Joint Lubrication & Fascial Release
Fluid, multi-planar transitions lubricate synovial joints, increase bone density through bodyweight resistance, and gently stretch the deep fascial network enveloping your muscles.

---

### Key Vinyasa Principles We Emphasize at Our Studio
* **Ujjayi Pranayama (Ocean Breath)**: Inhaling and exhaling through the nose with a subtle oceanic sound created in the back of the throat.
* **Drishti (Focused Gaze)**: Directing visual attention to a single focal point to quiet the chatter of the mind.
* **Bandhas (Core Energy Locks)**: Activating Mula Bandha (pelvic floor) and Uddiyana Bandha (lower abdominal lock) for lightweight lightness and spine protection in transitions.

Whether you are a beginner looking to build functional strength or an experienced yogi seeking meditative depth, our guided online and studio sessions are designed around safe, step-by-step progression.`
  },
  {
    id: 'blog-3',
    slug: 'yoga-for-weight-loss-metabolism-boost',
    title: 'Yoga for Sustainable Weight Loss: Why Mindfulness Beats Crash Diets',
    excerpt: 'Struggling with stubborn weight? Discover how dynamic yoga flows, hormonal regulation, and mindful eating habits help you shed excess fat and build sustainable, lifelong vitality.',
    coverImage: '/hero-group-yoga.jpg',
    category: 'Weight Management',
    author: 'Aarav Sharma',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/instructor-hero.jpg',
    date: 'August 15, 2026',
    readTime: '6 min read',
    tags: ['Weight Loss', 'Metabolism', 'Fat Burn', 'Hormonal Balance'],
    isPublished: true,
    featured: false,
    metaTitle: 'Yoga for Weight Loss & Metabolism Boost | Prana Yoga Studio',
    metaDescription: 'Learn how regular yoga practice helps in fat loss, resets metabolism, regulates thyroid function, and ends stress-induced emotional eating.',
    content: `### Beyond Calorie Counting: The Holistic Secret to Weight Loss

Most commercial fitness programs approach weight loss purely as a mathematical equation: *calories in versus calories out*. Yet millions of individuals find that despite grueling gym sessions and restrictive starvation diets, their weight quickly rebounds.

Why? Because weight management is fundamentally governed by **hormones, metabolic health, sleep quality, and emotional stress levels**.

---

### How Regular Yoga Activates Sustainable Fat Loss

#### 1. Lowers Cortisol & Eliminates Stubborn Belly Fat
High stress triggers elevated cortisol levels, which chemically signals the body to store visceral fat around the abdomen and waist. Yoga's deep breathing and meditative movement dramatically lower cortisol, allowing your body to naturally access and burn stored fat reserves.

#### 2. Stimulates the Thyroid & Endocrine Glands
Asanas involving gentle neck compressions and inversions—such as **Sarvangasana (Shoulder Stand), Halasana (Plow Pose), and Matsyasana (Fish Pose)**—stimulate the thyroid and parathyroid glands, which regulate your basal metabolic rate.

#### 3. Builds Long, Lean Muscle Mass
Poses like **Utkatasana (Chair Pose), Virabhadrasana II (Warrior II), and Phalakasana (Plank Pose)** recruit large muscle groups (quadriceps, glutes, core, and back). Lean muscle tissue burns calories around the clock, even while resting.

#### 4. Fosters Mindful Eating Awareness
Yoga cultivates interoception—the ability to perceive internal bodily sensations. Practitioners naturally develop an intuitive relationship with food, recognizing genuine physical hunger versus emotional cravings caused by boredom or anxiety.

---

### Recommended Weekly Routine for Weight Management
* **3 to 4 days**: Dynamic Power Flow or Vinyasa session (45–60 mins)
* **1 to 2 days**: Hatha Yoga for deep flexibility and joint health
* **Daily**: 10 minutes of Kapalbhati & Anulom Vilom Pranayama in the morning before breakfast

At our studio, we combine tailored asana progressions with gentle lifestyle counseling to ensure you achieve healthy, glowing transformation without exhaustion.`
  },
  {
    id: 'blog-4',
    slug: 'pranayama-101-breathing-techniques-stress-relief',
    title: 'Pranayama 101: 3 Powerful Breathing Techniques to Melt Away Stress in 5 Minutes',
    excerpt: 'Your breath is the remote control to your brain. Master Box Breathing, Nadi Shodhana, and Bhramari to calm racing thoughts, lower blood pressure, and sleep deeply.',
    coverImage: '/instructor-mountain-pose.jpg',
    category: 'Pranayama & Meditation',
    author: 'Aarav Sharma',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/instructor-hero.jpg',
    date: 'August 12, 2026',
    readTime: '4 min read',
    tags: ['Pranayama', 'Stress Relief', 'Mental Peace', 'Deep Sleep'],
    isPublished: true,
    featured: false,
    metaTitle: 'Pranayama Breathing Techniques for Stress & Anxiety Relief | Prana Yoga Studio',
    metaDescription: 'Master 3 easy pranayama breathing exercises to relieve anxiety, lower stress, and induce deep restful sleep anywhere in just 5 minutes.',
    content: `### The Breath: Your Body's Built-In Stress Antidote

When anxiety strikes, our breathing instinctively becomes shallow, rapid, and concentrated in the upper chest. This sends an emergency signal to the brain's amygdala, releasing adrenaline and keeping the body in a state of high alert.

By consciously altering the depth, rhythm, and duration of your breath, you can instantly override this stress response within 60 to 90 seconds.

---

### 1. Nadi Shodhana (Alternate Nostril Breathing)
* **Best For**: Mental clarity, balancing left and right brain hemispheres, evening wind-down.
* **How to Practice**:
  1. Sit comfortably with an upright spine. Place your left hand on your knee in Chin Mudra.
  2. Use your right thumb to gently close your right nostril. Inhale slowly and silently through the left nostril for 4 counts.
  3. Close the left nostril with your ring finger, release the thumb, and exhale smoothly through the right nostril for 4 counts.
  4. Inhale through the right nostril for 4 counts, close it, and exhale through the left for 4 counts.
* **Duration**: 5 to 10 complete rounds.

### 2. Sama Vritti (Box Breathing)
* **Best For**: High-stress situations, calming a racing heart, pre-meeting focus.
* **Pattern**: Inhale for 4 seconds → Hold with lungs full for 4 seconds → Exhale smoothly for 4 seconds → Hold with lungs empty for 4 seconds.
* **Repetitions**: 4 to 6 cycles.

### 3. Bhramari (Humming Bee Breath)
* **Best For**: Instant relief from headaches, overthinking, agitation, and insomnia.
* **How to Practice**:
  1. Close your eyes and gently press your ear tragus with your thumbs.
  2. Inhale deeply through your nose.
  3. Keeping your mouth closed, make a continuous, low-pitched humming sound *"Mmmmmm"* in your throat on the exhalation. Feel the soothing vibration throughout your skull and forehead.
* **Repetitions**: 5–7 calming hums before sleep.

---

> *"When the breath wanders, the mind is unsteady. But when the breath is calmed, the mind too will find stillness."* — **Hatha Yoga Pradipika**

Try integrating just 5 minutes of these breathing techniques into your morning routine or right before bed, and observe the immediate peace it brings to your mind and day.`
  }
];

