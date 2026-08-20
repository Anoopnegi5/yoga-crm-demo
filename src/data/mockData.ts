import { Client, PaymentRecord, LeaveRecord, AttendanceRecord, TrainerProfile, TrainerLeave, TrainerDreamGoal, BlogPost } from '../types';

export const DEFAULT_TRAINER_PROFILE: TrainerProfile = {
  name: 'Anjali Negi',
  studioName: 'Yoganjali',
  phone: '+91 95281 91678',
  upiId: 'yoganjali@upi',
  photoUrl: '/anjali-hero.jpg',
  studioLogoUrl: '/yoganjali-logo.png',
  appTitle: 'Yoganjali',
  appSubtitle: 'Yoga Journal & Fee Manager'
};

export const INITIAL_TRAINER_LEAVES: TrainerLeave[] = [];

export const INITIAL_TRAINER_DREAMS: TrainerDreamGoal[] = [
  {
    id: 'dream-1',
    title: 'My Own Physical Yoga Studio Sanctuary',
    targetAmount: 500000,
    savedAmount: 120000,
    photoUrl: '/hero-group-yoga.jpg',
    targetDate: '2027-12-31',
    category: 'Long Term',
    notes: 'A serene garden yoga shala with wooden flooring and natural sunlight.'
  },
  {
    id: 'dream-2',
    title: 'Advanced Rishikesh Yoga Teacher Certification',
    targetAmount: 75000,
    savedAmount: 45000,
    photoUrl: '/anjali-mountain-pose.jpg',
    targetDate: '2026-11-30',
    category: 'Short Term',
    notes: '300-hour Advanced Pranayama & Alignment Teacher Training.'
  }
];

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_LEAVES: LeaveRecord[] = [];

export const INITIAL_PAYMENTS: PaymentRecord[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: '5-morning-yoga-asanas-back-pain-relief',
    title: '5 Daily Morning Yoga Asanas for Instant Lower Back Pain Relief',
    excerpt: 'Sitting long hours at a desk compresses your spine. Discover 5 gentle yet highly effective yoga poses recommended by Trainer Anjali Negi to realign your vertebrae and eliminate lower back stiffness.',
    coverImage: '/about-anjali.jpg',
    category: 'Posture & Back Pain',
    author: 'Anjali Negi',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/anjali-hero.jpg',
    date: 'August 20, 2026',
    readTime: '4 min read',
    tags: ['Back Pain', 'Posture Correction', 'Morning Routine', 'Spine Health'],
    isPublished: true,
    featured: true,
    metaTitle: '5 Daily Morning Yoga Asanas for Lower Back Pain Relief | Yoganjali',
    metaDescription: 'Eliminate lower back pain with 5 simple morning yoga asanas by Trainer Anjali Negi. Realign your spine and improve posture with guided home practice.',
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

> *"The spine is the central pillar of human vitality. When your spine is supple and free of tension, energy flows unimpeded throughout your entire system."* — **Trainer Anjali Negi**

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
    author: 'Anjali Negi',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/anjali-hero.jpg',
    date: 'August 18, 2026',
    readTime: '5 min read',
    tags: ['Vinyasa', 'Pranayama', 'Cardio Yoga', 'Energy Flow'],
    isPublished: true,
    featured: false,
    metaTitle: 'The Science of Vinyasa Yoga Flow | Yoganjali Studio by Anjali Negi',
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

### Key Vinyasa Principles We Emphasize at Yoganjali
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
    coverImage: '/yoga-pose-sunset.jpg',
    category: 'Weight Management',
    author: 'Anjali Negi',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/anjali-hero.jpg',
    date: 'August 15, 2026',
    readTime: '6 min read',
    tags: ['Weight Loss', 'Metabolism', 'Fat Burn', 'Hormonal Balance'],
    isPublished: true,
    featured: false,
    metaTitle: 'Yoga for Weight Loss & Metabolism Boost | Yoganjali Studio',
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

At Yoganjali, we combine tailored asana progressions with gentle lifestyle counseling to ensure you achieve healthy, glowing transformation without exhaustion.`
  },
  {
    id: 'blog-4',
    slug: 'pranayama-101-breathing-techniques-stress-relief',
    title: 'Pranayama 101: 3 Powerful Breathing Techniques to Melt Away Stress in 5 Minutes',
    excerpt: 'Your breath is the remote control to your brain. Master Box Breathing, Nadi Shodhana, and Bhramari to calm racing thoughts, lower blood pressure, and sleep deeply.',
    coverImage: '/meditation-sanctuary.jpg',
    category: 'Pranayama & Meditation',
    author: 'Anjali Negi',
    authorRole: 'Founder & Certified Senior Yoga Instructor',
    authorPhoto: '/anjali-hero.jpg',
    date: 'August 12, 2026',
    readTime: '4 min read',
    tags: ['Pranayama', 'Stress Relief', 'Mental Peace', 'Deep Sleep'],
    isPublished: true,
    featured: false,
    metaTitle: 'Pranayama Breathing Techniques for Stress & Anxiety Relief | Yoganjali',
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

