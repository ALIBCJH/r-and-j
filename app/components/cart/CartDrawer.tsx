'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { useCart } from '@/app/lib/cart'

function fmt(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE')
}

export default function CartDrawer() {
  const { items, totalItems, totalKsh, drawerOpen, closeDrawer, removeFromCart, updateQty } = useCart()

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            style={{
              position:   'fixed',
              inset:      0,
              background: 'rgba(0,0,0,0.72)',
              zIndex:     100,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position:    'fixed',
              top:         0,
              right:       0,
              bottom:      0,
              width:       'min(440px, 100vw)',
              background:  '#070E1A',
              borderLeft:  '1px solid rgba(201,168,76,0.18)',
              zIndex:      101,
              display:     'flex',
              flexDirection:'column',
            }}
          >
            {/* Header */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '24px 24px 20px',
              borderBottom:   '1px solid rgba(201,168,76,0.1)',
              flexShrink:     0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={18} color="#C9A84C" />
                <span style={{
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     '20px',
                  color:        '#F0EBE0',
                  fontWeight:   400,
                }}>
                  Your Order
                </span>
                {totalItems > 0 && (
                  <span style={{
                    background:    'rgba(201,168,76,0.15)',
                    border:        '1px solid rgba(201,168,76,0.3)',
                    color:         '#C9A84C',
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '11px',
                    fontWeight:    600,
                    padding:       '2px 8px',
                    borderRadius:  '20px',
                  }}>
                    {totalItems} {totalItems === 1 ? 'panel' : 'panels'}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                style={{
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      '#6A7A88',
                  padding:    '4px',
                  display:    'flex',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0EBE0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6A7A88')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  height:         '100%',
                  gap:            '16px',
                  paddingBottom:  '80px',
                }}>
                  <ShoppingBag size={40} color="rgba(201,168,76,0.2)" />
                  <p style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   '14px',
                    color:      '#3A4A58',
                    textAlign:  'center',
                  }}>
                    Your order is empty.<br />Browse the catalog to add panels.
                  </p>
                  <Link
                    href="/catalog"
                    onClick={closeDrawer}
                    style={{
                      fontFamily:     'var(--font-inter, sans-serif)',
                      fontSize:       '12px',
                      fontWeight:     600,
                      letterSpacing:  '1.5px',
                      textTransform:  'uppercase',
                      color:          '#C9A84C',
                      textDecoration: 'none',
                      border:         '1px solid rgba(201,168,76,0.3)',
                      padding:        '10px 24px',
                      borderRadius:   '4px',
                    }}
                  >
                    View Catalog
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {items.map(item => (
                    <div
                      key={item.productId}
                      style={{
                        display:      'flex',
                        gap:          '14px',
                        padding:      '14px',
                        border:       '1px solid rgba(201,168,76,0.1)',
                        borderRadius: '4px',
                        background:   'rgba(201,168,76,0.02)',
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        position:     'relative',
                        width:        '64px',
                        aspectRatio:  '2/3',
                        flexShrink:   0,
                        borderRadius: '2px',
                        overflow:     'hidden',
                      }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily:    'var(--font-inter, sans-serif)',
                          fontSize:      '9px',
                          color:         '#C9A84C',
                          letterSpacing: '2.5px',
                          textTransform: 'uppercase',
                          marginBottom:  '4px',
                        }}>
                          {item.collection}
                        </p>
                        <p style={{
                          fontFamily:    'var(--font-playfair, Georgia, serif)',
                          fontSize:      '15px',
                          color:         '#F0EBE0',
                          fontWeight:    400,
                          marginBottom:  '10px',
                          overflow:      'hidden',
                          textOverflow:  'ellipsis',
                          whiteSpace:    'nowrap',
                        }}>
                          {item.name}
                        </p>

                        {/* Qty controls + price row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                            <QtyButton onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                              <Minus size={11} />
                            </QtyButton>
                            <span style={{
                              fontFamily:  'var(--font-inter, sans-serif)',
                              fontSize:    '14px',
                              color:       '#F0EBE0',
                              minWidth:    '28px',
                              textAlign:   'center',
                              lineHeight:  1,
                            }}>
                              {item.quantity}
                            </span>
                            <QtyButton onClick={() => updateQty(item.productId, item.quantity + 1)}>
                              <Plus size={11} />
                            </QtyButton>
                            <span style={{
                              fontFamily:    'var(--font-inter, sans-serif)',
                              fontSize:      '10px',
                              color:         '#3A4A58',
                              marginLeft:    '6px',
                            }}>
                              panels
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              fontFamily: 'var(--font-playfair, Georgia, serif)',
                              fontSize:   '16px',
                              color:      '#F0EBE0',
                            }}>
                              {fmt(item.priceKsh * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              style={{
                                background: 'none',
                                border:     'none',
                                cursor:     'pointer',
                                color:      '#3A4A58',
                                padding:    '2px',
                                display:    'flex',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#E05555')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#3A4A58')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <p style={{
                          fontFamily:  'var(--font-inter, sans-serif)',
                          fontSize:    '10px',
                          color:       '#2A3A48',
                          marginTop:   '4px',
                        }}>
                          {fmt(item.priceKsh)} per panel
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding:     '20px 24px 32px',
                borderTop:   '1px solid rgba(201,168,76,0.1)',
                flexShrink:  0,
              }}>
                {/* Subtotal */}
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  marginBottom:   '6px',
                }}>
                  <span style={{
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '12px',
                    color:         '#6A7A88',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    Subtotal
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize:   '22px',
                    color:      '#F0EBE0',
                  }}>
                    {fmt(totalKsh)}
                  </span>
                </div>
                <p style={{
                  fontFamily:   'var(--font-inter, sans-serif)',
                  fontSize:     '11px',
                  color:        '#2A3A48',
                  marginBottom: '20px',
                }}>
                  Reserve with a KSh 1,000 founding deposit · fully refundable · credited to your order
                </p>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            '10px',
                    background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
                    color:          '#0A0F1C',
                    padding:        '17px',
                    borderRadius:   '4px',
                    fontFamily:     'var(--font-inter, sans-serif)',
                    fontSize:       '13px',
                    fontWeight:     700,
                    letterSpacing:  '1.5px',
                    textTransform:  'uppercase',
                    textDecoration: 'none',
                    boxShadow:      '0 0 28px rgba(201,168,76,0.25)',
                    width:          '100%',
                    boxSizing:      'border-box' as const,
                  }}
                >
                  Reserve Your Slot
                  <ArrowRight size={14} />
                </Link>

                <button
                  onClick={closeDrawer}
                  style={{
                    background:    'none',
                    border:        'none',
                    cursor:        'pointer',
                    width:         '100%',
                    padding:       '12px',
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '12px',
                    color:         '#3A4A58',
                    marginTop:     '8px',
                    transition:    'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3A4A58')}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function QtyButton({ onClick, disabled, children }: {
  onClick:   () => void
  disabled?: boolean
  children:  React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width:      '26px',
        height:     '26px',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border:     '1px solid rgba(201,168,76,0.2)',
        borderRadius:'2px',
        cursor:     disabled ? 'default' : 'pointer',
        color:      disabled ? '#2A3A48' : '#C9A84C',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
