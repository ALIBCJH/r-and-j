import type { StepConfig } from './types'

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────
// Reorder = swap lines. Add a step = push an object. Remove = delete the entry.
// The component is mapped by id in WizardShell.tsx (one switch/case).

export const STEPS: StepConfig[] = [
  {
    id:        'photo',
    label:     'Photo',
    heading:   'Show us your window.',
    skippable: true,
    validate:  () => true,
  },
  {
    id:        'model',
    label:     'Hanging',
    heading:   'How should it hang?',
    skippable: false,
    validate:  s => !!s.model,
  },
  {
    id:        'type',
    label:     'Style',
    heading:   'Pick your style.',
    skippable: false,
    validate:  s => !!s.type,
  },
  {
    id:        'pattern',
    label:     'Pattern',
    heading:   'Choose a pattern.',
    skippable: false,
    validate:  s => !!s.pattern,
  },
  {
    id:        'color',
    label:     'Colour',
    heading:   'What colour speaks to you?',
    skippable: false,
    validate:  s => !!s.color,
  },
  {
    id:        'room',
    label:     'Room',
    heading:   'Which room is this for?',
    skippable: false,
    validate:  s => !!s.room,
  },
]
