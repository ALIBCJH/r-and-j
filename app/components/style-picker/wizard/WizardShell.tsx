'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useWizard }         from './WizardProvider'
import { StepIndicator }     from './StepIndicator'
import { StepFooter }        from './StepFooter'
import { STEPS }             from '../config/steps.config'
import { StepPhoto }         from '../steps/StepPhoto'
import { StepModel }         from '../steps/StepModel'
import { StepType }          from '../steps/StepType'
import { StepPattern }       from '../steps/StepPattern'
import { StepColor }         from '../steps/StepColor'
import { StepRoom }          from '../steps/StepRoom'
import { SummaryScreen }     from '../steps/SummaryScreen'
import type { Selections }   from '../config/types'

interface Props {
  onComplete: (selections: Selections) => void
}

const HEADER_HEIGHT = 72
const FOOTER_HEIGHT = 96  // approximate; safe-area handled inline

function StepContent({ stepIndex }: { stepIndex: number }) {
  const { state, set } = useWizard()
  const { selections } = state

  switch (STEPS[stepIndex].id) {
    case 'photo':   return <StepPhoto   value={selections.photo}   onChange={v => set('photo',   v)} />
    case 'model':   return <StepModel   value={selections.model}   onChange={v => set('model',   v)} />
    case 'type':    return <StepType    value={selections.type}    onChange={v => set('type',    v)} />
    case 'pattern': return <StepPattern value={selections.pattern} onChange={v => set('pattern', v)} />
    case 'color':   return <StepColor   value={selections.color}   onChange={v => set('color',   v)} />
    case 'room':    return <StepRoom    value={selections.room}    onChange={v => set('room',    v)} />
    default:        return null
  }
}

export function WizardShell({ onComplete }: Props) {
  const { state, dispatch } = useWizard()
  const { stepIndex, selections, completed } = state

  const step       = STEPS[stepIndex]
  const isLast     = stepIndex === STEPS.length - 1
  const canContinue = step.validate(selections)

  function handleNext() {
    if (!canContinue && !step.skippable) return
    if (isLast) {
      dispatch({ type: 'COMPLETE' })
      onComplete(selections)
    } else {
      dispatch({ type: 'NEXT' })
    }
  }

  function handleSkip() {
    if (!step.skippable) return
    dispatch({ type: 'NEXT' })
  }

  function handleBack() {
    dispatch({ type: 'BACK' })
  }

  if (completed) {
    return <SummaryScreen selections={selections} onReset={() => dispatch({ type: 'RESET' })} />
  }

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      display:    'flex',
      flexDirection: 'column',
      background: '#FAFAF8',
      overflow:   'hidden',
    }}>
      {/* Fixed header */}
      <div style={{
        height:        HEADER_HEIGHT,
        paddingTop:    'env(safe-area-inset-top, 0px)',
        flexShrink:    0,
        background:    '#FAFAF8',
        borderBottom:  '1px solid #EAE6DF',
        zIndex:        10,
      }}>
        <StepIndicator currentIndex={stepIndex} onBack={handleBack} />
      </div>

      {/* Scrollable step body */}
      <div style={{
        flex:       '1 1 auto',
        overflowY:  'auto',
        overflowX:  'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Step heading */}
        <div style={{ padding: '28px 20px 4px' }}>
          <p style={{
            margin:        0,
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      11,
            fontWeight:    500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#4A5C44',
            marginBottom:  8,
          }}>
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              style={{
                margin:      0,
                fontFamily:  'var(--font-playfair, Georgia, serif)',
                fontSize:    'clamp(26px, 7vw, 34px)',
                fontWeight:  400,
                color:       '#2A2520',
                lineHeight:  1.15,
              }}
            >
              {step.heading}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Step-specific content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '16px 20px', paddingBottom: FOOTER_HEIGHT + 16 }}
          >
            <StepContent stepIndex={stepIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed footer */}
      <div style={{ flexShrink: 0, zIndex: 10 }}>
        <StepFooter
          canContinue={canContinue}
          skippable={step.skippable}
          isLast={isLast}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  )
}
