'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeCtxValue {
  theme: Theme
  isDark: boolean
  toggle: () => void
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: 'light',
  isDark: false,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Read what the anti-flash script already set on <html>
    const saved = document.documentElement.getAttribute('data-theme') as Theme | null
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rj-theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <ThemeCtx.Provider value={{ theme, isDark: theme === 'dark', toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeCtx)
}

// ─── Convenience hook — returns a full colour palette for the current theme ──

export function useThemeColors() {
  const { isDark } = useTheme()
  return {
    isDark,
    // ── Marketing page backgrounds ──────────────────────────────────────────
    pageBg:     isDark ? '#0F0F12' : '#FAFAF8',
    altBg:      isDark ? '#111113' : '#F3F0EB',
    // ── Cards ───────────────────────────────────────────────────────────────
    card:       isDark ? '#1A1A1D' : '#FAFAF8',
    cardShadow: isDark ? '0 2px 20px rgba(0,0,0,0.35)' : '0 2px 20px rgba(27,58,107,0.06)',
    // ── Typography ──────────────────────────────────────────────────────────
    heading:    isDark ? '#F0EBE0' : '#1B3A6B',
    body:       isDark ? 'rgba(240,235,224,0.6)' : '#5A5248',
    muted:      isDark ? 'rgba(240,235,224,0.35)' : '#9A9088',
    bodyAlt:    isDark ? 'rgba(240,235,224,0.55)' : '#6A6258',
    // ── Surfaces / borders ──────────────────────────────────────────────────
    border:     isDark ? 'rgba(255,255,255,0.07)' : 'rgba(27,58,107,0.08)',
    surface:    isDark ? 'rgba(201,168,76,0.08)' : 'rgba(27,58,107,0.06)',
    iconColor:  isDark ? '#C9A84C' : '#1B3A6B',
    divider:    isDark ? 'rgba(255,255,255,0.06)' : 'rgba(27,58,107,0.08)',
    // ── Marketing navbar ────────────────────────────────────────────────────
    navSolid:   isDark ? 'rgba(15,15,18,0.96)' : 'rgba(250,250,248,0.96)',
    navBorder:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(27,58,107,0.08)',
    navText:    isDark ? '#F0EBE0' : '#1B3A6B',
    navLink:    isDark ? 'rgba(240,235,224,0.65)' : '#3A3530',
    // ── Studio shell ────────────────────────────────────────────────────────
    studioBg:       isDark ? '#111113' : '#F3F0EB',
    studioNav:      isDark ? '#0E0E10' : '#FFFFFF',
    studioNavBorder:isDark ? '#1E1E21' : 'rgba(27,58,107,0.1)',
    studioText:     isDark ? '#F0EBE0' : '#1B3A6B',
    studioMuted:    isDark ? '#504840' : '#6A6258',
    studioDivider:  isDark ? '#2A2A2D' : 'rgba(27,58,107,0.12)',
    // ── Studio panel (ConfigPanel) ───────────────────────────────────────────
    panelBg:        isDark ? '#18181A' : '#FFFFFF',
    panelBorder:    isDark ? '#1E1E21' : 'rgba(27,58,107,0.1)',
    panelText:      isDark ? '#F0EBE0' : '#1B3A6B',
    panelMuted:     isDark ? '#706860' : '#7A7268',
    panelSubtle:    isDark ? '#404040' : '#9A9088',
    panelDivider:   isDark ? '#1E1E21' : 'rgba(27,58,107,0.08)',
    panelItemBg:    isDark ? '#1E1E21' : 'rgba(27,58,107,0.04)',
    panelItemHover: isDark ? '#242428' : 'rgba(27,58,107,0.08)',
    panelIconBg:    isDark ? '#2A2A2D' : 'rgba(27,58,107,0.08)',
    panelItemText:  isDark ? '#F0EBE0' : '#1B3A6B',
    panelItemSub:   isDark ? '#484840' : '#9A9088',
  }
}
