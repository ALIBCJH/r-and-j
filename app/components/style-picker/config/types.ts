export interface Selections {
  photo:   File | null
  model:   string | null
  type:    string | null
  pattern: string | null
  color:   string | null
  room:    string | null
}

export interface StepConfig {
  id:        keyof Selections
  label:     string
  heading:   string
  skippable: boolean
  validate:  (sel: Selections) => boolean
}

export const INITIAL_SELECTIONS: Selections = {
  photo:   null,
  model:   null,
  type:    null,
  pattern: null,
  color:   null,
  room:    null,
}
