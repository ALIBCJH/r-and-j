export interface Selections {
  // Phase 1 — picker
  photo:        File | null
  color:        string | null
  // Phase 2 — booking (collected after payment)
  bookingDate:  string | null   // 'YYYY-MM-DD'
  bookingTime:  string | null
  contactName:  string
  contactPhone: string
  contactEmail: string
  // Payment
  paymentRef:   string | null
}

export type WizardPhase = 'picking' | 'gate' | 'booking' | 'confirmed'

export interface StepConfig {
  id:        'photo' | 'color'
  label:     string
  heading:   string
  skippable: boolean
  validate:  (sel: Selections) => boolean
}

export const INITIAL_SELECTIONS: Selections = {
  photo:        null,
  color:        null,
  bookingDate:  null,
  bookingTime:  null,
  contactName:  '',
  contactPhone: '',
  contactEmail: '',
  paymentRef:   null,
}
