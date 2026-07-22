'use client'

// The pricing modal: how a customer sees what a finished window costs.
//
//   · a Size × Package comparison table (all fixed prices at a glance)
//   · what's always included (measurement, installation, delivery)
//   · a quote builder — pick size, package, quantity → live total
//
// Deliberately decoupled from checkout/M-Pesa: the quote is an estimate that
// routes into the existing consultation flow. "Final quotation may vary for
// custom requests" is stated up front. Mirrors CartDrawer's dismissible overlay
// (backdrop + panel, framer AnimatePresence) and adds dialog semantics: role,
// aria-modal, ESC-to-close, focus capture, body-scroll lock.

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Check, ArrowRight } from 'lucide-react'
import {
  type PricingConfig,
  activeSizes,
  activePackages,
  priceFor,
  startingFrom,
  formatKes,
} from '@/app/lib/pricing'

const ease = [0.25, 0.1, 0.25, 1] as const

const INCLUDED = ['Free Measurement', 'Professional Installation', 'Delivery Included'] as const

export interface PricingModalProduct {
  id:   number
  name: string
}

export default function PricingModal({
  product,
  pricing,
  onClose,
}: {
  product: PricingModalProduct | null
  pricing: PricingConfig
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {product && (
        <ModalBody key={product.id} product={product} pricing={pricing} onClose={onClose} />
      )}
    </AnimatePresence>
  )
}

function ModalBody({
  product,
  pricing,
  onClose,
}: {
  product: PricingModalProduct
  pricing: PricingConfig
  onClose: () => void
}) {
  const sizes    = useMemo(() => activeSizes(pricing), [pricing])
  const packages = useMemo(() => activePackages(pricing), [pricing])
  const from     = useMemo(() => startingFrom(pricing, product.id), [pricing, product.id])

  // Quote builder state — default to the cheapest sensible starting point.
  const [sizeId,    setSizeId]    = useState(from?.sizeId    ?? sizes[0]?.id    ?? '')
  const [packageId, setPackageId] = useState(from?.packageId ?? packages[0]?.id ?? '')
  const [qty,       setQty]       = useState(1)

  const unit  = priceFor(pricing, product.id, sizeId, packageId)
  const total = unit != null ? unit * qty : null

  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId  = `pricing-modal-title-${product.id}`

  // ESC to close, focus the close button on open, lock body scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const quoteHref =
    `/contact?product=${encodeURIComponent(product.name)}` +
    `&size=${encodeURIComponent(sizeId)}` +
    `&package=${encodeURIComponent(packageId)}` +
    `&qty=${qty}`

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(6,12,22,0.78)', backdropFilter: 'blur(4px)', zIndex: 200 }}
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.34, ease }}
        style={{
          position: 'fixed', inset: 0, zIndex: 201,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4vh 16px', pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto',
            background: 'linear-gradient(180deg, #10203A 0%, #0A1526 100%)',
            border: '1px solid rgba(201,168,76,0.28)', borderRadius: '14px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', padding: '26px 28px 18px',
            borderBottom: '1px solid rgba(201,168,76,0.14)',
            position: 'sticky', top: 0, zIndex: 1,
            background: 'linear-gradient(180deg, #10203A 0%, rgba(16,32,58,0.96) 100%)',
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Pricing
              </p>
              <h2 id={titleId} style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '24px', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.15, margin: 0 }}>
                {product.name}
              </h2>
              {from && (
                <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#8A9AA8', marginTop: '8px' }}>
                  From <span style={{ color: '#E8C96D' }}>{formatKes(from.amount)}</span> · {from.sizeLabel} · {from.packageName}
                </p>
              )}
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close pricing"
              style={{
                flexShrink: 0, display: 'grid', placeItems: 'center',
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
                color: '#C9A84C', cursor: 'pointer',
              }}
            >
              <X size={17} />
            </button>
          </div>

          <div style={{ padding: '24px 28px 30px' }}>

            {/* ── Comparison table ── */}
            <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.14)', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${120 + packages.length * 130}px` }}>
                <thead>
                  <tr>
                    <th style={cellHead}>Window Size</th>
                    {packages.map(pkg => (
                      <th key={pkg.id} style={{ ...cellHead, textAlign: 'right', color: '#E8C96D' }}>{pkg.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizes.map(size => (
                    <tr key={size.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={cellBody}>
                        <span style={{ color: '#F0EBE0', fontWeight: 500 }}>{size.label}</span>
                        {size.sublabel && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#5A6A7A', marginTop: '2px' }}>{size.sublabel}</span>
                        )}
                      </td>
                      {packages.map(pkg => {
                        const amount = priceFor(pricing, product.id, size.id, pkg.id)
                        return (
                          <td key={pkg.id} style={{ ...cellBody, textAlign: 'right', fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '16px', color: '#F0EBE0', whiteSpace: 'nowrap' }}>
                            {amount != null ? formatKes(amount) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Always included ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', margin: '20px 2px 4px' }}>
              {INCLUDED.map(item => (
                <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12.5px', color: '#A8B2BE' }}>
                  <Check size={14} color="#4ADE80" /> {item}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11.5px', color: '#5A6A7A', margin: '10px 2px 0', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <Check size={13} color="#5A6A7A" /> Final quotation may vary for custom requests
            </p>

            {/* ── Quote builder ── */}
            <div style={{ marginTop: '26px', padding: '20px', borderRadius: '12px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Build Your Quote
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Window Size">
                  <select value={sizeId} onChange={e => setSizeId(e.target.value)} style={selectStyle}>
                    {sizes.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </Field>
                <Field label="Package">
                  <select value={packageId} onChange={e => setPackageId(e.target.value)} style={selectStyle}>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                <Field label="Windows">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', overflow: 'hidden' }}>
                    <StepBtn aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></StepBtn>
                    <span style={{ minWidth: '38px', textAlign: 'center', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#F0EBE0' }}>{qty}</span>
                    <StepBtn aria-label="Increase quantity" onClick={() => setQty(q => Math.min(99, q + 1))}><Plus size={14} /></StepBtn>
                  </div>
                </Field>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#8A9AA8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Estimated Total
                  </p>
                  <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '30px', color: '#FFFFFF', fontWeight: 400, lineHeight: 1, margin: 0 }}>
                    {total != null ? formatKes(total) : '—'}
                  </p>
                  {total != null && qty > 1 && unit != null && (
                    <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#5A6A7A', marginTop: '4px' }}>
                      {qty} × {formatKes(unit)}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={quoteHref}
                onClick={onClose}
                style={{
                  marginTop: '18px', width: '100%', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
                  color: '#0A0F1C', padding: '15px 24px', borderRadius: '8px',
                  fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                }}
              >
                Request This Quote <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Small UI atoms ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#8A9AA8', letterSpacing: '0.5px', marginBottom: '7px' }}>{label}</span>
      {children}
    </label>
  )
}

function StepBtn({ children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: 'grid', placeItems: 'center', width: '36px', height: '38px', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#C9A84C', cursor: 'pointer' }}
      {...rest}
    >
      {children}
    </button>
  )
}

const cellHead: React.CSSProperties = {
  textAlign: 'left', padding: '13px 16px', fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8A9AA8',
  background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap',
}
const cellBody: React.CSSProperties = {
  padding: '14px 16px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px',
  color: '#C6CFD8', verticalAlign: 'top',
}
const selectStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', appearance: 'none',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.25)',
  borderRadius: '8px', padding: '11px 13px',
  fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#F0EBE0',
  outline: 'none', cursor: 'pointer',
}
