// Smart Medical Safety Shield Engine for Yoganjali Yoga Studio

export interface SafetyPrecaution {
  condition: string;
  severity: 'high' | 'medium' | 'info';
  avoid: string[];
  recommended: string[];
  trainerNote: string;
}

const PRECAUTION_RULES: { keywords: string[]; precaution: SafetyPrecaution }[] = [
  {
    keywords: ['back pain', 'lower back', 'slip disc', 'sciatica', 'spondylitis', 'lumbar', 'spine'],
    precaution: {
      condition: 'Spinal / Lower Back Sensitivity',
      severity: 'high',
      avoid: [
        'Deep unsupported forward bends (Paschimottanasana)',
        'Aggressive spinal twisting or sudden jerks',
        'Heavy hyperextension under load'
      ],
      recommended: [
        'Bhujangasana (Gentle Cobra Pose)',
        'Setu Bandhasana (Bridge Pose)',
        'Marjariasana-Bitilasana (Cat-Cow)',
        'Makarasana (Crocodile relaxation)'
      ],
      trainerNote: 'Instruct client to keep knees softly bent in standing poses and engage core gently.'
    }
  },
  {
    keywords: ['high bp', 'hypertension', 'blood pressure', 'heart', 'cardiac'],
    precaution: {
      condition: 'High Blood Pressure / Cardiovascular',
      severity: 'high',
      avoid: [
        'Sirsasana (Headstand) & inverted poses where head is below heart for prolonged periods',
        'Kumbhaka (Prolonged breath retention)',
        'Rapid Kapalbhati at high force'
      ],
      recommended: [
        'Nadi Shodhan (Alternate Nostril Breathing)',
        'Sheetali / Sheetkari Pranayama',
        'Shavasana with gentle head elevation',
        'Slow paced gentle rhythmic Vinyasa'
      ],
      trainerNote: 'Avoid rapid transitions from forward bends to standing to prevent dizziness.'
    }
  },
  {
    keywords: ['cervical', 'neck pain', 'neck stiffness', 'neck'],
    precaution: {
      condition: 'Cervical Spine / Neck Sensitivity',
      severity: 'high',
      avoid: [
        'Sarvangasana (Shoulder stand) & Halasana (Plow)',
        'Aggressive neck rotations or head hanging back unsupported',
        'Heavy neck compression in Matsyasana'
      ],
      recommended: [
        'Gentle isometric neck strengthening',
        'Gomukhasana arms (Chest opening)',
        'Tadasana with neutral cervical alignment',
        'Gentle shoulder rolls & scapular mobilization'
      ],
      trainerNote: 'Always support the back of the neck and cue gazing straight ahead.'
    }
  },
  {
    keywords: ['knee', 'knee pain', 'arthritis', 'meniscus', 'ligament'],
    precaution: {
      condition: 'Knee Joint Sensitivity',
      severity: 'medium',
      avoid: [
        'Padmasana (Full Lotus) & Virasana (Hero Pose) on floor without props',
        'Deep uncontrolled lunges where knee crosses toes',
        'Torquing the knee during standing twists'
      ],
      recommended: [
        'Supported Tadasana & gentle quad isometrics',
        'Utkatasana with block between thighs (controlled depth)',
        'Supta Padangusthasana with strap',
        'Using folded blanket/bolster under knees in all kneeling poses'
      ],
      trainerNote: 'Provide blanket cushions under knees during all kneeling postures.'
    }
  },
  {
    keywords: ['pcos', 'pcod', 'hormonal', 'thyroid', 'period', 'menstrual'],
    precaution: {
      condition: 'Hormonal / Pelvic Vitality Focus',
      severity: 'info',
      avoid: [
        'Overheating during extreme fatigue or heavy menstrual days',
        'Over-exhausting high-intensity drills on low energy days'
      ],
      recommended: [
        'Baddha Konasana (Butterfly Pose)',
        'Supta Baddha Konasana with bolster',
        'Dhanurasana (Bow Pose)',
        'Surya Namaskar at moderate rhythmic flow'
      ],
      trainerNote: 'Encourage restorative and pelvic opening postures.'
    }
  },
  {
    keywords: ['insomnia', 'sleep', 'stress', 'anxiety', 'mental fatigue'],
    precaution: {
      condition: 'Nervous System & Stress Relief',
      severity: 'info',
      avoid: [
        'High-energy heating practices right before evening session end'
      ],
      recommended: [
        'Viparita Karani (Legs-Up-the-Wall)',
        'Yoga Nidra & extended Shavasana (8-10 mins)',
        'Bhramari Pranayama (Humming Bee Breath)',
        'Chandra Bhedana Pranayama'
      ],
      trainerNote: 'Conclude evening sessions with cooling pranayama and deep grounding.'
    }
  },
  {
    keywords: ['weight loss', 'weight reduction', 'obesity', 'belly fat', 'strength'],
    precaution: {
      condition: 'Metabolic Conditioning & Core Strength',
      severity: 'info',
      avoid: [
        'Compromising spine alignment to rush through repetitions'
      ],
      recommended: [
        'Classical Surya Namaskar (Dynamic 12 Steps)',
        'Phalakasana (Plank) & Vasisthasana (Side Plank)',
        'Virabhadrasana Series (Warrior Poses)',
        'Navasana (Boat Pose for deep core engagement)'
      ],
      trainerNote: 'Maintain focus on steady breath while building metabolic heat.'
    }
  }
];

export const getMedicalSafetyShield = (
  reasonsForJoining: string[] = [],
  currentProblems: string[] = [],
  customPrecautions: string[] = []
): SafetyPrecaution[] => {
  const combinedText = [
    ...(reasonsForJoining || []),
    ...(currentProblems || []),
    ...(customPrecautions || [])
  ].join(' ').toLowerCase();

  const matched: SafetyPrecaution[] = [];
  const addedConditions = new Set<string>();

  PRECAUTION_RULES.forEach(rule => {
    const isMatch = rule.keywords.some(kw => combinedText.includes(kw.toLowerCase()));
    if (isMatch && !addedConditions.has(rule.precaution.condition)) {
      matched.push(rule.precaution);
      addedConditions.add(rule.precaution.condition);
    }
  });

  // If client has custom precautions entered
  if (customPrecautions && customPrecautions.length > 0) {
    customPrecautions.forEach((cp) => {
      if (cp.trim() && !addedConditions.has(cp)) {
        matched.push({
          condition: `Custom Note: ${cp}`,
          severity: 'info',
          avoid: ['Exercise mindfulness per trainer consultation'],
          recommended: ['Follow customized session flow'],
          trainerNote: cp
        });
        addedConditions.add(cp);
      }
    });
  }

  // Fallback if no specific condition matched
  if (matched.length === 0) {
    matched.push({
      condition: 'General Yoga Wellness & Safe Practice',
      severity: 'info',
      avoid: ['Never force any posture through sharp joint pain'],
      recommended: ['Gentle full-body Vinyasa flow', 'Sukhasana Pranayama', 'Daily Shavasana'],
      trainerNote: 'Standard safety alignment cues apply. Listen to the body on the mat.'
    });
  }

  return matched;
};
