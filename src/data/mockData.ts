import { Client, PaymentRecord, LeaveRecord, AttendanceRecord, TrainerProfile, TrainerLeave, TrainerDreamGoal } from '../types';

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
