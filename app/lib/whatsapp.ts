// Single source of truth for the R&J WhatsApp line.
// Change the number here and it updates the floating button, navbar icon,
// and any other wa.me link across the site.

// International format, digits only (no '+', no spaces) — this is what wa.me expects.
export const WHATSAPP_NUMBER = '254781830101'

// Human-friendly version for display (tel: links, labels).
export const WHATSAPP_DISPLAY = '+254 781 830 101'

// Default greeting pre-filled in the customer's chat box.
const DEFAULT_MESSAGE =
  "Hi R&J Interiors! I'd like to ask about your curtains."

/**
 * Build a wa.me deep link with a pre-filled message.
 * @param message optional custom greeting; falls back to the default.
 */
export function whatsappUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Build a WhatsApp *share* link with no fixed recipient — opens WhatsApp so the
 * sender can pick which contact(s) to forward the message to. Used for the
 * "tell a friend" referral nudge.
 */
export function whatsappShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
