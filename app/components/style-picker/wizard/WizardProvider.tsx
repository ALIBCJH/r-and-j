'use client'

import {
  createContext, useContext, useReducer, useEffect, useCallback,
  type Dispatch,
} from 'react'
import { INITIAL_SELECTIONS, type Selections, type WizardPhase } from '../config/types'

// ─── State ────────────────────────────────────────────────────────────────────

interface WizardState {
  phase:          WizardPhase
  stepIndex:      number          // index within PICKER_STEPS
  selections:     Selections
  paymentPending: boolean
  paymentError:   string | null
}

type Action =
  | { type: 'SET';             key: keyof Selections; value: Selections[keyof Selections] }
  | { type: 'RESTORE';         payload: Partial<Omit<Selections, 'photo'>> }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GO_TO_GATE' }
  | { type: 'GO_TO_BOOKING' }
  | { type: 'PAYMENT_START' }
  | { type: 'PAYMENT_SUCCESS'; ref: string }
  | { type: 'PAYMENT_ERROR';   message: string }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET':
      return { ...state, selections: { ...state.selections, [action.key]: action.value } }
    case 'RESTORE':
      return { ...state, selections: { ...state.selections, ...action.payload } }
    case 'NEXT':
      return { ...state, stepIndex: state.stepIndex + 1 }
    case 'BACK':
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) }
    case 'GO_TO_GATE':
      return { ...state, phase: 'gate', paymentError: null }
    case 'GO_TO_BOOKING':
      return { ...state, phase: 'booking' }
    case 'PAYMENT_START':
      return { ...state, paymentPending: true, paymentError: null }
    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        paymentPending: false,
        phase:          'booking',
        selections:     { ...state.selections, paymentRef: action.ref },
      }
    case 'PAYMENT_ERROR':
      return { ...state, paymentPending: false, paymentError: action.message }
    case 'COMPLETE':
      return { ...state, phase: 'confirmed' }
    case 'RESET':
      return { selections: INITIAL_SELECTIONS, phase: 'picking', stepIndex: 0, paymentPending: false, paymentError: null }
    default:
      return state
  }
}

const STORAGE_KEY = 'rj-wizard-v2'

// ─── Context ──────────────────────────────────────────────────────────────────

interface WizardContextValue {
  state:    WizardState
  dispatch: Dispatch<Action>
  set:      (key: keyof Selections, value: Selections[keyof Selections]) => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    selections:     INITIAL_SELECTIONS,
    phase:          'picking',
    stepIndex:      0,
    paymentPending: false,
    paymentError:   null,
  })

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Omit<Selections, 'photo'>>
        dispatch({ type: 'RESTORE', payload: saved })
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      const { photo: _photo, ...rest } = state.selections
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch { /* ignore */ }
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
