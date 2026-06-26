'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, type Dispatch } from 'react'
import { INITIAL_SELECTIONS, type Selections } from '../config/types'
import { STEPS } from '../config/steps.config'

// ─── State ────────────────────────────────────────────────────────────────────

interface WizardState {
  selections: Selections
  stepIndex:  number        // 0-based index into STEPS
  completed:  boolean
}

type Action =
  | { type: 'SET';      key: keyof Selections; value: Selections[keyof Selections] }
  | { type: 'RESTORE';  payload: Partial<Omit<Selections, 'photo'>> }
  | { type: 'RESET' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'COMPLETE' }

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET':
      return { ...state, selections: { ...state.selections, [action.key]: action.value } }
    case 'RESTORE':
      return { ...state, selections: { ...state.selections, ...action.payload } }
    case 'NEXT':
      if (state.stepIndex >= STEPS.length - 1) return state
      return { ...state, stepIndex: state.stepIndex + 1 }
    case 'BACK':
      if (state.stepIndex <= 0) return state
      return { ...state, stepIndex: state.stepIndex - 1 }
    case 'COMPLETE':
      return { ...state, completed: true }
    case 'RESET':
      return { selections: INITIAL_SELECTIONS, stepIndex: 0, completed: false }
    default:
      return state
  }
}

const STORAGE_KEY = 'rj-wizard-v1'

// ─── Context ──────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state:    WizardState
  dispatch: Dispatch<Action>
  set:      (key: keyof Selections, value: Selections[keyof Selections]) => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    selections: INITIAL_SELECTIONS,
    stepIndex:  0,
    completed:  false,
  })

  // Restore text selections from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Omit<Selections, 'photo'>>
        dispatch({ type: 'RESTORE', payload: saved })
      }
    } catch { /* ignore parse errors */ }
  }, [])

  // Persist text selections on every change (photo is a File — not serializable)
  useEffect(() => {
    try {
      const { photo: _photo, ...rest } = state.selections
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch { /* ignore quota errors */ }
  }, [state.selections])

  const set = useCallback(
    (key: keyof Selections, value: Selections[keyof Selections]) =>
      dispatch({ type: 'SET', key, value }),
    [],
  )

  return (
    <WizardContext.Provider value={{ state, dispatch, set }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider')
  return ctx
}
