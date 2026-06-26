import type { StepConfig } from './types'

// ── PICKER STEPS (before the payment gate) ────────────────────────────────────
// These are the two desire-building steps. The gate fires after both are done.
// To add a third pre-gate step: push an entry here and add its case to WizardShell.
export const PICKER_STEPS: StepConfig[] = [
  {
    id:        'photo',
    label:     'Room',
    heading:   'Photograph your window.',
    skippable: true,
    validate:  () => true,
  },
  {
    id:        'color',
    label:     'Colour',
    heading:   'Choose a colour.',
    skippable: false,
    validate:  s => !!s.color,
  },
]
