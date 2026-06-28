'use client'

import { useState }              from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWizard }              from './WizardProvider'
import { API_URL }                from '@/app/lib/api'
import { StepIndicator }          from './StepIndicator'
import { StepFooter }             from './StepFooter'
import { PICKER_STEPS }           from '../config/steps.config'
import { StepPhoto }              from '../steps/StepPhoto'
import { StepColor }              from '../steps/StepColor'
import { GateScreen }             from '../steps/GateScreen'
import { BookingDateStep }        from '../steps/BookingDateStep'
import { BookingContactStep }     from '../steps/BookingContactStep'
import { WizardConfirmation }     from '../steps/WizardConfirmation'
import { useRouter }              from 'next/navigation'

const ease = [0.22, 1, 0.36, 1] as const

// Booking has 2 sub-steps: 0 = date+time, 1 = contact details
const BOOKING_HEADINGS = [
  'Pick your date & time.',
  'Just a few details.',
]

function PickerContent({ stepIndex }: { stepIndex: number }) {
  const { set, state } = useWizard()
  const { selections } = state
  switch (PICKER_STEPS[stepIndex].id) {
    case 'photo': return <StepPhoto value={selections.photo}  onChange={v => set('photo', v)} />
    case 'color': return <StepColor value={selections.color}  onChange={v => set('color', v)} />
    default:      return null
  }
}

export function WizardShell() {
  const { state, dispatch, set } = useWizard()
  const { phase, stepIndex, selections, paymentPending, paymentError } = state
  const router = useRouter()

  // Booking sub-step (0 = date+time, 1 = contact)
  const [bookingStep,       setBookingStep]       = useState(0)
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingError,      setBookingError]      = useState<string | null>(null)

  // ── Picker phase logic ────────────────────────────────────────────────────
  const pickerStep    = PICKER_STEPS[stepIndex]
  const isLastPicker  = stepIndex === PICKER_STEPS.length - 1
  const pickerValid   = pickerStep?.validate(selections)

  function pickerNext() {
    if (isLastPicker) {
      dispatch({ type: 'GO_TO_GATE' })
    } else {
      dispatch({ type: 'NEXT' })
    }
  }
  function pickerBack() { dispatch({ type: 'BACK' }) }
  function pickerSkip() { if (pickerStep?.skippable) pickerNext() }

  // ── Booking phase logic ───────────────────────────────────────────────────
  const bookingDateValid = !!selections.bookingDate && !!selections.bookingTime
  const bookingContactValid = !!selections.contactName.trim() && !!selections.contactPhone.trim()

  async function bookingNext() {
    if (bookingStep === 0 && bookingDateValid) {
      setBookingStep(1)
      setBookingError(null)
    } else if (bookingStep === 1 && bookingContactValid) {
      setBookingSubmitting(true)
      setBookingError(null)
      try {
        const res = await fetch(`${API_URL}/bookings`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:        selections.contactName,
            phone:       selections.contactPhone,
            email:       selections.contactEmail || undefined,
            date:        selections.bookingDate,
            time:        selections.bookingTime,
            payment_ref: selections.paymentRef,
          }),
        })
        if (res.status === 409) {
          setBookingError('That slot was just taken. Please pick a different time.')
          setBookingStep(0)
          return
        }
        if (!res.ok) throw new Error()
        dispatch({ type: 'COMPLETE' })
      } catch {
        setBookingError('Something went wrong. Please try again.')
      } finally {
        setBookingSubmitting(false)
      }
    }
  }
  function bookingBack() {
    if (bookingStep === 0) dispatch({ type: 'GO_TO_GATE' })
    else { setBookingStep(s => s - 1); setBookingError(null) }
  }

  // ── Phase: confirmed ──────────────────────────────────────────────────────
  if (phase === 'confirmed') {
    return (
      <WizardConfirmation
        colorId={selections.color}
        bookingDate={selections.bookingDate}
        bookingTime={selections.bookingTime}
        name={selections.contactName}
        paymentRef={selections.paymentRef}
        onDone={() => router.push('/')}
      />
    )
  }

  // ── Phase: gate ───────────────────────────────────────────────────────────
  if (phase === 'gate') {
    return (
      <GateScreen
        photo={selections.photo}
        colorId={selections.color}
        pending={paymentPending}
        error={paymentError}
        onPayStart={() => dispatch({ type: 'PAYMENT_START' })}
        onSuccess={ref => dispatch({ type: 'PAYMENT_SUCCESS', ref })}
        onPayError={msg => dispatch({ type: 'PAYMENT_ERROR', message: msg })}
      />
    )
  }

  // ── Phase: booking (post-payment) ─────────────────────────────────────────
  if (phase === 'booking') {
    const canContinue   = (bookingStep === 0 ? bookingDateValid : bookingContactValid) && !bookingSubmitting
    const isLastBooking = bookingStep === 1

    return (
      <div style={{
        position:      'fixed',
        inset:         0,
        display:       'flex',
        flexDirection: 'column',
        background:    '#FAFAF8',
        overflow:      'hidden',
      }}>
        {/* Booking header */}
        <div style={{
          height:       72,
          paddingTop:   'env(safe-area-inset-top, 0px)',
          flexShrink:   0,
          background:   '#FAFAF8',
          borderBottom: '1px solid #EAE6DF',
          display:      'flex',
          alignItems:   'center',
          padding:      '0 20px',
          gap:          12,
          zIndex:       10,
        }}>
          <button onClick={bookingBack} style={{
            width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#4A5C44" strokeWidth="2.2" strokeLinecap="round">
              <path d="M19 12H5M11 6l-6 6 6 6"/>
            </svg>
          </button>

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10, color: '#4A5C44', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              Step {bookingStep + 1} of 2 — Booking
            </p>
          </div>

          {/* Mini payment badge */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          5,
            padding:      '4px 10px',
            borderRadius: 20,
            background:   '#EEF0E8',
            border:       '1px solid rgba(74,92,68,0.2)',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4A5C44" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10, color: '#4A5C44', fontWeight: 600 }}>Paid</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: '1 1 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ padding: '24px 20px 4px' }}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={`bh-${bookingStep}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease }}
                style={{
                  margin:     0,
                  fontFamily: 'var(--font-playfair, Georgia, serif)',
                  fontSize:   'clamp(26px, 7vw, 34px)',
                  fontWeight: 400,
                  color:      '#2A2520',
                  lineHeight: 1.15,
                }}
              >
                {BOOKING_HEADINGS[bookingStep]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`bs-${bookingStep}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease }}
              style={{ padding: '16px 20px 100px' }}
            >
              {bookingStep === 0 ? (
                <BookingDateStep
                  dateValue={selections.bookingDate}
                  timeValue={selections.bookingTime}
                  onDate={v => set('bookingDate', v)}
                  onTime={v => set('bookingTime', v)}
                />
              ) : (
                <BookingContactStep
                  name={selections.contactName}
                  phone={selections.contactPhone}
                  email={selections.contactEmail}
                  onName={v => set('contactName', v)}
                  onPhone={v => set('contactPhone', v)}
                  onEmail={v => set('contactEmail', v)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ flexShrink: 0, zIndex: 10 }}>
          {bookingError && (
            <div style={{
              margin:       '0 20px 8px',
              padding:      '10px 14px',
              borderRadius: 10,
              background:   '#FDF2F0',
              border:       '1px solid #E8C4BC',
            }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13, color: '#C0503A' }}>
                {bookingError}
              </p>
            </div>
          )}
          <StepFooter
            canContinue={canContinue}
            skippable={false}
            isLast={isLastBooking}
            onNext={bookingNext}
            onSkip={() => {}}
            nextLabel={bookingSubmitting ? 'Confirming…' : undefined}
          />
        </div>
      </div>
    )
  }

  // ── Phase: picking ────────────────────────────────────────────────────────
  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      display:       'flex',
      flexDirection: 'column',
      background:    '#FAFAF8',
      overflow:      'hidden',
    }}>
      {/* Fixed header */}
      <div style={{
        height:       72,
        paddingTop:   'env(safe-area-inset-top, 0px)',
        flexShrink:   0,
        background:   '#FAFAF8',
        borderBottom: '1px solid #EAE6DF',
        zIndex:       10,
      }}>
        <StepIndicator
          currentIndex={stepIndex}
          showBack={stepIndex > 0}
          onBack={pickerBack}
        />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: '1 1 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '28px 20px 4px' }}>
          <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A5C44' }}>
            Step {stepIndex + 1} of {PICKER_STEPS.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={pickerStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease }}
              style={{ margin: 0, fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(26px, 7vw, 34px)', fontWeight: 400, color: '#2A2520', lineHeight: 1.15 }}
            >
              {pickerStep.heading}
            </motion.h1>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pickerStep.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease }}
            style={{ padding: '16px 20px 100px' }}
          >
            <PickerContent stepIndex={stepIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed footer */}
      <div style={{ flexShrink: 0, zIndex: 10 }}>
        <StepFooter
          canContinue={pickerValid}
          skippable={pickerStep.skippable}
          isLast={false}
          onNext={pickerNext}
          onSkip={pickerSkip}
          nextLabel={isLastPicker ? 'See my room' : undefined}
        />
      </div>
    </div>
  )
}
