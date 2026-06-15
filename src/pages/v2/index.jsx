import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Home, TrendingUp, ShoppingBag, User,
  Bell, ChevronLeft, ChevronRight, ChevronDown, Clock,
  Copy, MoreVertical, Users, Delete, Check
} from 'lucide-react'

// ============================================================
// Global Styles (applied once)
// ============================================================
const globalStyleId = 'v2-global-styles'
if (typeof document !== 'undefined' && !document.getElementById(globalStyleId)) {
  const style = document.createElement('style')
  style.id = globalStyleId
  style.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { overscroll-behavior: none; overflow-x: hidden; width: 100%; }
    .v1-screen { user-select: none; -webkit-user-select: none; }
    .v1-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: none; }
    .v1-scroll::-webkit-scrollbar { display: none; }
    .v1-hide-scrollbar::-webkit-scrollbar { display: none; }
    @keyframes v1-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes v1-slide-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
    @keyframes v1-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes v1-spin { to { transform: rotate(360deg); } }
  `
  document.head.appendChild(style)
}

// ============================================================
// Typography Helpers
// ============================================================
const T = {
  display40: (w = 'bold') => ({ fontSize: 'var(--font-display40-' + w + '-size)', lineHeight: 'var(--font-display40-' + w + '-line-height)', fontWeight: 'var(--font-display40-' + w + '-weight)' }),
  headline32: (w = 'bold') => ({ fontSize: 'var(--font-headline32-' + w + '-size)', lineHeight: 'var(--font-headline32-' + w + '-line-height)', fontWeight: 'var(--font-headline32-' + w + '-weight)' }),
  headline28: (w = 'bold') => ({ fontSize: 'var(--font-headline28-' + w + '-size)', lineHeight: 'var(--font-headline28-' + w + '-line-height)', fontWeight: 'var(--font-headline28-' + w + '-weight)' }),
  headline24: (w = 'bold') => ({ fontSize: 'var(--font-headline24-' + w + '-size)', lineHeight: 'var(--font-headline24-' + w + '-line-height)', fontWeight: 'var(--font-headline24-' + w + '-weight)' }),
  title20: (w = 'semibold') => ({ fontSize: 'var(--font-title20-' + w + '-size)', lineHeight: 'var(--font-title20-' + w + '-line-height)', fontWeight: 'var(--font-title20-' + w + '-weight)' }),
  body17: (w = 'medium') => ({ fontSize: 'var(--font-body17-' + w + '-size)', lineHeight: 'var(--font-body17-' + w + '-line-height)', fontWeight: 'var(--font-body17-' + w + '-weight)' }),
  body15: (w = 'medium') => ({ fontSize: 'var(--font-body15-' + w + '-size)', lineHeight: 'var(--font-body15-' + w + '-line-height)', fontWeight: 'var(--font-body15-' + w + '-weight)' }),
  label13: (w = 'medium') => ({ fontSize: 'var(--font-label13-' + w + '-size)', lineHeight: 'var(--font-label13-' + w + '-line-height)', fontWeight: 'var(--font-label13-' + w + '-weight)' }),
  label11: (w = 'medium') => ({ fontSize: 'var(--font-label11-' + w + '-size)', lineHeight: 'var(--font-label11-' + w + '-line-height)', fontWeight: 'var(--font-label11-' + w + '-weight)' }),
}

// ============================================================
// Layout Styles
// ============================================================
const S = {
  screen: {
    width: '100%',
    maxWidth: '100%',
    minHeight: '100dvh',
    margin: '0 auto',
    backgroundColor: 'var(--color-neutral-000)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Pretendard, -apple-system, sans-serif',
  },
  scrollBody: {
    height: '100dvh',
    overflowY: 'auto',
    paddingBottom: 'calc(81px + env(safe-area-inset-bottom, 0px))',
  },
  safeTop: {
    height: 'env(safe-area-inset-top, 0px)',
  },
  appBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'var(--color-neutral-000)',
  },
  appBarRow: {
    height: 60,
    padding: '0 6px 0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    ...T.headline24('bold'),
    color: 'var(--color-neutral-900)',
  },
  appBarCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    ...T.body15('semibold'),
    color: 'var(--color-neutral-800)',
    pointerEvents: 'none',
  },
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-neutral-000)',
    borderTop: '1px solid var(--color-neutral-050)',
    zIndex: 20,
  },
  tabBarInner: {
    display: 'flex',
    height: 47,
    paddingTop: 4,
    padding: '4px 20px 0',
    gap: 4,
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
    minHeight: 44,
  },
  tabLabel: (active) => ({
    ...T.label11(active ? 'medium' : 'medium'),
    color: active ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)',
  }),
  safeBottom: {
    height: 'calc(env(safe-area-inset-bottom, 0px) + 0px)',
    minHeight: 0,
    backgroundColor: 'var(--color-neutral-000)',
  },
  divider: {
    height: 12,
    backgroundColor: 'var(--color-neutral-050)',
  },
}

// ============================================================
// AppBar Variants
// ============================================================
function HomeAppBar({ title = '홈' }) {
  return (
    <div style={S.appBar}>
      <div style={S.safeTop} />
      <div style={S.appBarRow}>
        <span style={S.appBarTitle}>{title}</span>
        <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={24} color="var(--color-neutral-400)" />
        </div>
      </div>
    </div>
  )
}

function SubAppBar({ title, onBack, light = false }) {
  const bg = light ? 'transparent' : 'var(--color-neutral-000)'
  const textColor = light ? '#fff' : 'var(--color-neutral-800)'
  return (
    <div style={{ ...S.appBar, backgroundColor: bg }}>
      <div style={S.safeTop} />
      <div style={{ ...S.appBarRow, position: 'relative' }}>
        <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={textColor} />
        </div>
        <div style={{ ...S.appBarCenter, color: textColor }}>{title}</div>
        <div style={{ width: 44 }} />
      </div>
    </div>
  )
}

// ============================================================
// TabBar
// ============================================================
function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'home', label: '홈', Icon: Home },
    { key: 'shopping', label: '쇼핑', Icon: ShoppingBag },
    { key: 'my', label: '마이', Icon: User },
  ]
  return (
    <div style={S.tabBar}>
      <div style={S.tabBarInner}>
        {tabs.map(({ key, label, Icon }) => (
          <div key={key} style={S.tabItem} onClick={() => onTabChange(key)}>
            <Icon
              size={24}
              color={activeTab === key ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)'}
              fill={activeTab === key ? 'var(--color-neutral-800)' : 'none'}
              strokeWidth={activeTab === key ? 2 : 1.5}
            />
            <span style={S.tabLabel(activeTab === key)}>{label}</span>
          </div>
        ))}
      </div>
      <div style={S.safeBottom} />
    </div>
  )
}

// ============================================================
// Phase Transition Button (black pill above tab bar)
// ============================================================
function PhaseTransitionButton({ label, onClick }) {
  return (
    <div style={{
      position: 'fixed', bottom: 'calc(55px + env(safe-area-inset-bottom, 0px))', left: 0, right: 0,
      display: 'flex', justifyContent: 'center', zIndex: 15, pointerEvents: 'none',
    }}>
      <div onClick={onClick} style={{
        padding: '6px 14px',
        backgroundColor: 'var(--color-neutral-800)', color: '#fff',
        borderRadius: 16, ...T.label13('semibold'),
        cursor: 'pointer', pointerEvents: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>{label}</div>
    </div>
  )
}

// ============================================================
// Product Cards
// ============================================================
function ProductCard({ onClick }) {
  return (
    <div onClick={onClick} style={{
      borderRadius: 16,
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, rgba(68, 135, 255, 0.2) 0%, rgba(68, 135, 255, 0.1) 100%), var(--color-neutral-000)',
      padding: 8,
    }}>
      <div style={{ padding: '8px 8px 0', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          backgroundColor: 'var(--color-neutral-000)', borderRadius: 40,
          padding: '5px 12px 5px 8px',
          ...T.label13('medium'),
          color: 'var(--color-neutral-900)',
        }}>
          <Clock size={16} color="var(--color-primary-500)" />
          13일 23:59:59 남음
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <img src="/product.png" alt="투자상품" style={{ height: 140, objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            backgroundColor: 'rgba(255,255,255,0.64)', border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: 16, padding: '5px 12px',
            ...T.label13('medium'),
            color: 'var(--color-neutral-800)',
          }}>
            <Users size={14} color="var(--color-neutral-600)" />
            9,999명 투자중
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: 'var(--color-neutral-000)',
        borderRadius: 8,
        padding: '20px 16px',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>A 투자 상품</div>
        <div style={{
          display: 'inline-block', padding: '2px 8px',
          backgroundColor: 'var(--color-neutral-050)', borderRadius: 6,
          ...T.label13('medium'), color: 'var(--color-neutral-700)',
          fontSize: 10, marginBottom: 12,
        }}>10마리 투자상품</div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-600)', lineHeight: '18px' }}>1C 금액</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: '26px' }}>20,000원~</div>
          </div>
          <div style={{ width: 1, height: 36, backgroundColor: 'var(--color-neutral-100)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-600)', lineHeight: '18px' }}>마감 일자</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: '26px' }}>2023.12.31</div>
          </div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ height: 6, backgroundColor: 'var(--color-neutral-200)', borderRadius: 100 }}>
            <div style={{ width: '33%', height: 6, backgroundColor: 'var(--color-neutral-700)', borderRadius: 7 }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            <span style={{ color: 'var(--color-neutral-700)' }}>8,475 </span>
            <span style={{ color: 'var(--color-neutral-500)' }}>/ 25,278C</span>
          </span>
          <span style={{
            padding: '2px 8px', backgroundColor: 'var(--color-neutral-050)',
            borderRadius: 8, fontSize: 12, fontWeight: 500,
            color: 'var(--color-neutral-700)',
          }}>모집중</span>
        </div>
      </div>
    </div>
  )
}

function ClosedProductCard() {
  return (
    <div style={{
      minWidth: 320, flexShrink: 0, borderRadius: 16, overflow: 'hidden', padding: 8,
      background: 'linear-gradient(135deg, rgba(68, 135, 255, 0.2) 0%, rgba(68, 135, 255, 0.1) 100%), var(--color-neutral-000)',
    }}>
      <div style={{ height: 178, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/product.png" alt="투자상품" style={{ height: 140, objectFit: 'contain' }} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(7,23,51,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ ...T.headline24('semibold'), color: '#fff' }}>120% 투자 달성</span>
        </div>
      </div>
      <div style={{
        backgroundColor: 'var(--color-neutral-000)', borderRadius: 8,
        padding: '20px 16px', marginTop: 8,
        boxShadow: '0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>유전지수 높은 상품</div>
        <div style={{
          display: 'inline-block', padding: '2px 8px',
          backgroundColor: 'var(--color-neutral-050)', borderRadius: 6,
          fontSize: 10, fontWeight: 500, color: 'var(--color-neutral-700)',
          marginBottom: 12,
        }}>10마리 투자상품</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-600)', lineHeight: '18px' }}>1C 금액</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: '26px' }}>50,000원~</div>
          </div>
          <div style={{ width: 1, height: 36, backgroundColor: 'var(--color-neutral-100)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-600)', lineHeight: '18px' }}>마감 일자</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: '26px' }}>2023.12.31</div>
          </div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ height: 6, backgroundColor: 'var(--color-neutral-800)', borderRadius: 100 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            <span style={{ color: 'var(--color-neutral-800)' }}>8,475 </span>
            <span style={{ color: 'var(--color-neutral-500)' }}>/ 25,278C</span>
          </span>
          <span style={{
            padding: '2px 8px', backgroundColor: 'var(--color-neutral-800)',
            borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#fff',
          }}>마감</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CTA Button
// ============================================================
function CTAButton({ label, onClick, variant = 'primary' }) {
  const isPrimary = variant === 'primary'
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
      backgroundColor: 'var(--color-neutral-000)', zIndex: 15,
    }}>
      <div onClick={onClick} style={{
        height: 56, borderRadius: 14,
        backgroundColor: isPrimary ? 'var(--color-primary-500)' : 'var(--color-neutral-100)',
        color: isPrimary ? '#fff' : 'var(--color-neutral-700)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...T.body17('semibold'), cursor: 'pointer',
        minHeight: 56,
      }}>
        {label}
      </div>
    </div>
  )
}

// ============================================================
// Shared UI Blocks
// ============================================================
function PendingOrderCard({ onClick }) {
  return (
    <div onClick={onClick} style={{
      backgroundColor: 'var(--color-neutral-050)', borderRadius: 16,
      padding: '20px 16px', cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-primary-500)' }} />
        <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>신청중인 주문 1건</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          backgroundColor: 'var(--color-primary-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>60,000원</span>
          </div>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>3C</div>
        </div>
      </div>
    </div>
  )
}

function SettledProductItem({ onClick, label = 'A 투자 상품', amount = '20,000원', sub = '1C' }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        backgroundColor: 'var(--color-primary-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{label}</span>
          <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{amount}</span>
        </div>
        <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>{sub}</div>
      </div>
    </div>
  )
}

function MenuItem({ label, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '20px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: onClick ? 'pointer' : 'default',
      minHeight: 44,
    }}>
      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{label}</span>
      <ChevronRight size={24} color="var(--color-neutral-400)" />
    </div>
  )
}

// ============================================================
// Settlement Pending Card (정산 예정 상품)
// ============================================================
function SettlementPendingCard({ daysLeft = '7일 남음', onClick }) {
  return (
    <div onClick={onClick} style={{
      backgroundColor: 'var(--color-neutral-050)', borderRadius: 16,
      padding: '20px 16px', cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-secondary-500)' }} />
        <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>정산 예정 상품 1건</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          backgroundColor: 'var(--color-primary-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
            <span style={{
              padding: '2px 8px', borderRadius: 6,
              backgroundColor: 'var(--color-secondary-050)',
              ...T.label13('semibold'), color: 'var(--color-secondary-600)',
            }}>{daysLeft}</span>
          </div>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>1C · 20,000원</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Banner
// ============================================================
function Banner() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{
        height: 120, borderRadius: 16,
        backgroundColor: 'var(--color-neutral-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...T.body15('semibold'), color: 'var(--color-neutral-500)',
        opacity: 0.5,
      }}>배너</div>
    </div>
  )
}

// ============================================================
// Shared Icon
// ============================================================
function IconCheck({ filled = false }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="16" fill={filled ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'} />
      <path d="M10 17l5 5L24 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StepNumber({ num, active = false }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 17,
      backgroundColor: active ? 'var(--color-primary-500)' : 'var(--color-neutral-100)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...T.body17('semibold'), color: active ? '#fff' : 'var(--color-neutral-500)',
      margin: '0 auto',
    }}>{num}</div>
  )
}

// ============================================================
// Home Screens
// ============================================================
function HomeMyInvestSection({ amount, accountAmount = '100,000원', nav, goTab, children }) {
  return (
    <div style={{ padding: '24px 16px 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 20 }}>
        <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>내 투자</span>
        <div
          onClick={() => nav('invest')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{amount}</span>
          <ChevronRight size={28} color="var(--color-neutral-400)" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: children ? 16 : 0 }}>
        <div onClick={() => nav('asset')} style={{
          flex: 1, padding: 16,
          backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
          cursor: 'pointer',
        }}>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', marginBottom: 2 }}>내 계좌</div>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{accountAmount}</div>
        </div>
        <div onClick={() => nav('history')} style={{
          flex: 1, padding: 16,
          backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>투자 내역</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function HomeProductSections({ nav }) {
  return (
    <>
      <div style={{ padding: '24px 16px 32px' }}>
        <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 9 }}>투자 상품</div>
        <ProductCard onClick={() => nav('product_detail')} />
      </div>
      <div style={{ padding: '24px 0 120px' }}>
        <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 12, padding: '0 16px' }}>마감 상품</div>
        <div className="v1-hide-scrollbar" style={{
          display: 'flex', gap: 16, overflowX: 'auto',
          paddingBottom: 16, paddingLeft: 16,
        }}>
          <ClosedProductCard />
          <ClosedProductCard />
          <div style={{ minWidth: 1, flexShrink: 0 }} />
        </div>
      </div>
    </>
  )
}

// --- Existing Home Screens ---

function HomePreScreen({ nav, goTab }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <HomeMyInvestSection amount="0원" nav={nav} goTab={goTab} />
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeApplyingScreen({ nav, goTab, onJumpToSettled }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <PhaseTransitionButton label="체결 당일로 이동하기" onClick={onJumpToSettled} />
        <HomeMyInvestSection
          amount="0원"
          accountAmount="40,000원"
          nav={nav}
          goTab={goTab}
        >
          <PendingOrderCard onClick={() => nav('history_detail_applying')} />
        </HomeMyInvestSection>
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeSettledScreen({ nav, goTab, onJumpToPreSettlement }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <PhaseTransitionButton label="정산 7일 전으로 이동하기" onClick={onJumpToPreSettlement} />
        <HomeMyInvestSection amount="20,000원" accountAmount="80,000원" nav={nav} goTab={goTab} />
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)', marginBottom: 12 }}>사육중 상품</div>
          <SettledProductItem label="A 투자 상품" amount="20,000원" sub="1주" />
        </div>
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

// --- NEW Home Screens ---

function HomePreSettlementScreen({ nav, goTab, onJumpToSettlementDay }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <PhaseTransitionButton label="정산 당일로 이동하기" onClick={onJumpToSettlementDay} />
        <HomeMyInvestSection amount="20,000원" accountAmount="80,000원" nav={nav} goTab={goTab}>
          <SettlementPendingCard daysLeft="7일 남음" onClick={() => nav('history_detail_pre_settlement')} />
        </HomeMyInvestSection>
        {/* 사육중 상품 */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)', marginBottom: 12 }}>사육중 상품</div>
          <SettledProductItem label="A 투자 상품" amount="20,000원" sub="1C" />
        </div>
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeSettlementDayScreen({ nav, goTab, onJumpToPostSettlement }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <PhaseTransitionButton label="정산 완료로 이동하기" onClick={onJumpToPostSettlement} />
        <HomeMyInvestSection amount="20,000원" accountAmount="80,000원" nav={nav} goTab={goTab}>
          {/* 정산 당일 - 정산 진행중 표시 */}
          <div style={{
            backgroundColor: 'var(--color-neutral-050)', borderRadius: 16,
            padding: '20px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: 'var(--color-green-500)',
              }} />
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>정산 진행중 1건</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                backgroundColor: 'var(--color-primary-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6,
                    backgroundColor: 'var(--color-green-050)',
                    ...T.label13('semibold'), color: 'var(--color-green-600)',
                  }}>오늘 지급 예정</span>
                </div>
                <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>1C · 20,000원</div>
              </div>
            </div>
          </div>
        </HomeMyInvestSection>
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomePostSettlementScreen({ nav, goTab }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <div style={{ padding: '24px 16px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 20 }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>내 투자</span>
            <div
              onClick={() => nav('invest')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
              <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>0원</span>
              <ChevronRight size={28} color="var(--color-neutral-400)" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div onClick={() => nav('asset')} style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
              cursor: 'pointer',
            }}>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', marginBottom: 2 }}>내 계좌</div>
              <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>102,000원</div>
            </div>
            <div onClick={() => nav('history')} style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>투자 내역</span>
            </div>
          </div>
          {/* 정산 완료 알림 카드 */}
          <div onClick={() => nav('settlement_history')} style={{
            backgroundColor: 'var(--color-green-050)', borderRadius: 16,
            padding: '20px 16px', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: 'var(--color-green-500)',
              }} />
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>정산 완료 1건</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                backgroundColor: 'var(--color-primary-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-green-600)' }}>+2,000원</span>
                </div>
                <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>정산금 22,000원 지급 완료</div>
              </div>
            </div>
          </div>
        </div>
        <Banner />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

// ============================================================
// Product Detail & Apply Complete
// ============================================================
function ProductDetailScreen({ onBack, onApply, phase }) {
  return (
    <div className="v1-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <SubAppBar title="" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...T.headline28('semibold'), color: 'var(--color-neutral-900)', opacity: 0.2 }}>투자 상품 상세</span>
      </div>
      {phase === 'pre' ? (
        <CTAButton label="투자하기" onClick={onApply} />
      ) : (
        <CTAButton label="확인" onClick={onBack} />
      )}
    </div>
  )
}

// ============================================================
// 투자중상품상세_정산결과 (Settlement Result Detail)
// ============================================================
function ProductSettlementResultScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('result')

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        {/* Blue gradient header */}
        <div style={{
          background: 'linear-gradient(180deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
          padding: '0 0 24px',
        }}>
          <SubAppBar title="" onBack={onBack} light />
          <div style={{ padding: '0 16px' }}>
            <div style={{ ...T.headline24('bold'), color: '#fff', marginBottom: 4 }}>A 투자 상품</div>
            <div style={{ ...T.body15('medium'), color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>10마리 투자상품</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.label13('medium'), color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>내 보유 C</div>
                <div style={{ ...T.title20('bold'), color: '#fff' }}>1/100C</div>
              </div>
              <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...T.label13('medium'), color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>내 투자금</div>
                <div style={{ ...T.title20('bold'), color: '#fff' }}>20,000원</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-neutral-100)' }}>
          {[
            { key: 'info', label: '송아지 정보' },
            { key: 'result', label: '정산 결과' },
          ].map(({ key, label }) => (
            <div key={key} onClick={() => setActiveTab(key)} style={{
              flex: 1, padding: '16px 0', textAlign: 'center',
              ...T.body15(activeTab === key ? 'semibold' : 'medium'),
              color: activeTab === key ? 'var(--color-neutral-900)' : 'var(--color-neutral-500)',
              borderBottom: activeTab === key ? '2px solid var(--color-neutral-900)' : 'none',
              cursor: 'pointer',
            }}>{label}</div>
          ))}
        </div>

        {activeTab === 'info' ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>송아지 정보 영역</div>
          </div>
        ) : (
          <>
            {/* 정산 결과 */}
            <div style={{ padding: '24px 16px' }}>
              <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>정산 결과</div>
              {[
                { label: '정산금', value: '22,000원', bold: true },
                { label: '투자금', value: '20,000원' },
                { label: '이익금', value: '+2,000원', color: 'var(--color-red-500)' },
                { label: '이익률', value: '+20.00%', color: 'var(--color-red-500)' },
              ].map(({ label, value, bold, color }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                }}>
                  <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>{label}</span>
                  <span style={{
                    ...(bold ? T.body17('bold') : T.body17('medium')),
                    color: color || 'var(--color-neutral-900)',
                  }}>{value}</span>
                </div>
              ))}
            </div>

            {/* 세금 */}
            <div style={{
              margin: '0 16px', padding: 16, borderRadius: 12,
              backgroundColor: 'var(--color-neutral-050)',
            }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-700)', marginBottom: 12 }}>세금</div>
              {[
                { label: '배당소득세', value: '308원' },
                { label: '세후 이익금', value: '+1,692원', color: 'var(--color-red-500)' },
                { label: '세후 이익률', value: '+8.46%', color: 'var(--color-red-500)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                }}>
                  <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>{label}</span>
                  <span style={{ ...T.body15('semibold'), color: color || 'var(--color-neutral-900)' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={S.divider} />

            {/* 정산 히스토리 */}
            <div style={{ padding: '24px 16px' }}>
              <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>정산 히스토리</div>
              {[
                { label: '경매금', value: '28,000,000원' },
                { label: '가축구매비', value: '-6,000,000원' },
                { label: '사료구매비', value: '-4,500,000원' },
                { label: '사육관리비', value: '-3,000,000원' },
                { label: '증권관리비', value: '-1,200,000원' },
                { label: '경매결과', value: '13,300,000원', bold: true },
                { label: '보상금', value: '+500,000원' },
                { label: '농가장려금', value: '-200,000원' },
                { label: '운영성과금', value: '-1,100,000원' },
                { label: '전체이익금', value: '12,500,000원', bold: true },
                { label: '내 이익금', value: '2,000원', bold: true, color: 'var(--color-red-500)' },
              ].map(({ label, value, bold, color }, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                  borderTop: (label === '경매결과' || label === '전체이익금') ? '1px solid var(--color-neutral-200)' : 'none',
                  marginTop: (label === '경매결과' || label === '전체이익금') ? 8 : 0,
                  paddingTop: (label === '경매결과' || label === '전체이익금') ? 16 : 10,
                }}>
                  <span style={{
                    ...(bold ? T.body15('semibold') : T.body15('medium')),
                    color: 'var(--color-neutral-700)',
                  }}>{label}</span>
                  <span style={{
                    ...(bold ? T.body15('bold') : T.body15('medium')),
                    color: color || 'var(--color-neutral-900)',
                  }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 60 }} />
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Quantity Input Screen (수량입력)
// ============================================================
function QuantityInputScreen({ onBack, onInvest }) {
  const [quantity, setQuantity] = useState(0)
  const pricePerC = 20000
  const maxAmount = 100000
  const maxC = Math.floor(maxAmount / pricePerC)

  const totalPrice = quantity * pricePerC
  const formattedPrice = totalPrice.toLocaleString() + '원'

  const handleNumber = (num) => {
    const next = quantity * 10 + num
    if (next <= maxC) setQuantity(next)
  }
  const handleDelete = () => setQuantity(Math.floor(quantity / 10))
  const handleQuick = (val) => {
    if (val === 'max') {
      setQuantity(maxC)
    } else {
      const next = Math.min(quantity + val, maxC)
      setQuantity(next)
    }
  }

  return (
    <div className="v1-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <SubAppBar title="A 투자 상품" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            backgroundColor: 'var(--color-neutral-050)',
            ...T.label13('medium'), color: 'var(--color-neutral-700)',
          }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'var(--color-neutral-200)' }} />
            NH농협은행
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <span style={{ ...T.display40('bold'), color: quantity > 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-300)' }}>
              {quantity > 0 ? quantity : '0'}
            </span>
            <span style={{ ...T.headline24('bold'), color: quantity > 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-300)' }}>C</span>
          </div>
          <span style={{ ...T.body17('semibold'), color: quantity > 0 ? 'var(--color-primary-500)' : 'var(--color-neutral-400)' }}>
            {quantity > 0 ? formattedPrice : '0원'}
          </span>
        </div>
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>구매가능금액</span>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{maxAmount.toLocaleString()}원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>이용료</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4,
                backgroundColor: 'var(--color-primary-050)',
                ...T.label11('semibold'), color: 'var(--color-primary-500)',
              }}>수수료 뱅카우 지원</span>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>0원</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 12px' }}>
          {[
            { label: '1C', val: 1 },
            { label: '10C', val: 10 },
            { label: '100C', val: 100 },
            { label: '최대', val: 'max' },
          ].map(({ label, val }) => (
            <div key={label} onClick={() => handleQuick(val)} style={{
              flex: 1, height: 40, borderRadius: 10,
              backgroundColor: 'var(--color-neutral-050)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...T.body15('semibold'), color: 'var(--color-neutral-700)',
              cursor: 'pointer',
            }}>{label}</div>
          ))}
        </div>
        <div style={{ padding: '0 16px' }}>
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9], ['', 0, 'del']].map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((key, ci) => (
                <div
                  key={ci}
                  onClick={() => {
                    if (key === 'del') handleDelete()
                    else if (key !== '') handleNumber(key)
                  }}
                  style={{
                    flex: 1, height: 56,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: key !== '' ? 'pointer' : 'default',
                    ...T.title20('semibold'), color: 'var(--color-neutral-900)',
                  }}
                >
                  {key === 'del' ? <Delete size={24} color="var(--color-neutral-700)" /> : key}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}>
          <div onClick={quantity > 0 ? onInvest : undefined} style={{
            height: 56, borderRadius: 14,
            backgroundColor: quantity > 0 ? 'var(--color-primary-500)' : 'var(--color-neutral-200)',
            color: quantity > 0 ? '#fff' : 'var(--color-neutral-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), cursor: quantity > 0 ? 'pointer' : 'default',
          }}>투자하기</div>
        </div>
      </div>
    </div>
  )
}

function ApplyCompleteScreen({ onConfirm }) {
  return (
    <div className="v1-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <div style={S.safeTop} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 16px', marginTop: -80,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: 'var(--color-primary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>투자 신청 완료</div>
        <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)', textAlign: 'center', lineHeight: '24px' }}>
          투자 신청이 완료됐어요.<br/>6월 12일에 배정 결과를 알려드릴게요.
        </div>
      </div>
      <CTAButton label="확인" onClick={onConfirm} />
    </div>
  )
}

// ============================================================
// Push Notification Screens
// ============================================================
function PushNotificationScreen({ title, message, onTap }) {
  return (
    <div className="v1-screen" style={{
      ...S.screen, backgroundColor: 'var(--color-dark-900)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={S.safeTop} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div onClick={onTap} style={{
          width: '100%', padding: '14px 16px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16, display: 'flex', gap: 12,
          alignItems: 'flex-start', cursor: 'pointer',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            backgroundColor: 'var(--color-primary-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src="/product.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ ...T.body15('semibold'), color: '#fff' }}>{title}</span>
              <span style={{ ...T.label13('medium'), color: 'rgba(255,255,255,0.5)' }}>9:41 AM</span>
            </div>
            <div style={{ ...T.body15('medium'), color: 'rgba(255,255,255,0.8)', lineHeight: '20px' }}>
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest Tab Screen
// ============================================================
function InvestScreen({ nav, onBack, phase }) {
  const config = {
    pre:              { amount: '0원', account: '100,000원' },
    applying:         { amount: '60,000원', account: '40,000원' },
    settled:          { amount: '20,000원', account: '80,000원' },
    pre_settlement:   { amount: '20,000원', account: '80,000원' },
    settlement_day:   { amount: '20,000원', account: '80,000원' },
    post_settlement:  { amount: '0원', account: '102,000원' },
  }
  const c = config[phase]

  const showSettlementHistory = phase === 'post_settlement'

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>내 투자</span>
            <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{c.amount}</span>
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)', marginBottom: 12 }}>계좌</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <div onClick={() => nav('asset')} style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
              cursor: 'pointer',
            }}>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', marginBottom: 2 }}>내 계좌</div>
              <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{c.account}</div>
            </div>
            <div style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-100)', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>계좌 개설하기</span>
            </div>
          </div>
        </div>
        {/* 투자중 상품 */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>투자중 상품</div>
          {phase === 'pre' && (
            <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
              <img src="/empty.png" alt="" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>투자중인 상품이 없어요</div>
            </div>
          )}
          {phase === 'applying' && <PendingOrderCard onClick={() => nav('history_detail_applying')} />}
          {phase === 'settled' && <SettledProductItem onClick={() => nav('history_detail_settled')} />}
          {phase === 'pre_settlement' && (
            <SettlementPendingCard daysLeft="7일 남음" onClick={() => nav('history_detail_pre_settlement')} />
          )}
          {phase === 'settlement_day' && (
            <div style={{
              backgroundColor: 'var(--color-neutral-050)', borderRadius: 16,
              padding: '20px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-green-500)' }} />
                <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>정산 진행중 1건</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  backgroundColor: 'var(--color-primary-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img src="/product.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6,
                      backgroundColor: 'var(--color-green-050)',
                      ...T.label13('semibold'), color: 'var(--color-green-600)',
                    }}>오늘 지급 예정</span>
                  </div>
                  <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>1C · 20,000원</div>
                </div>
              </div>
            </div>
          )}
          {phase === 'post_settlement' && (
            <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
              <img src="/empty.png" alt="" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>투자중인 상품이 없어요</div>
            </div>
          )}
        </div>
        <div style={{ ...S.divider, marginTop: 24 }} />
        <div>
          <MenuItem label="투자 내역" onClick={() => nav('history')} />
          <MenuItem label="정산 내역" onClick={showSettlementHistory ? () => nav('settlement_history') : undefined} />
          <MenuItem label="자산 보호 내역" />
          <MenuItem label="세금" />
          <MenuItem label="중도해지 취소내역" />
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

// ============================================================
// Asset Screen (자산)
// ============================================================
function AssetScreen({ onBack, nav, goTab, phase }) {
  const data = {
    pre:              { total: '100,000원', bank: '100,000원', invest: '0원' },
    applying:         { total: '40,000원', bank: '40,000원', invest: '0원' },
    settled:          { total: '100,000원', bank: '80,000원', invest: '20,000원' },
    pre_settlement:   { total: '100,000원', bank: '80,000원', invest: '20,000원' },
    settlement_day:   { total: '100,000원', bank: '80,000원', invest: '20,000원' },
    post_settlement:  { total: '102,000원', bank: '102,000원', invest: '0원' },
  }
  const d = data[phase]

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="자산" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '16px 0' }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>총 자산</span>
            <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{d.total}</span>
          </div>
        </div>
        <div onClick={() => nav('account')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                backgroundColor: 'var(--color-neutral-100)',
              }} />
              <div>
                <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>NH농협은행</div>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>{d.bank}</div>
              </div>
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 8,
              backgroundColor: 'var(--color-neutral-100)',
              ...T.label13('semibold'), color: 'var(--color-neutral-700)',
            }}>출금</div>
          </div>
        </div>
        <div onClick={() => nav('invest')} style={{ padding: '16px 16px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: 'var(--color-neutral-100)',
            }} />
            <div>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>한우 투자</div>
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>{d.invest}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// History Screens
// ============================================================
function HistoryEmptyScreen({ onBack }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <SubAppBar title="투자내역" onBack={onBack} />
      <div style={{ padding: '20px 16px' }}>
        <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>신청중인 주문</div>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>신청중인 주문이 없어요</div>
        </div>
      </div>
      <div style={S.divider} />
      <div style={{ padding: '20px 16px' }}>
        <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>완료된 주문</div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 0',
        }}>
          <img src="/empty.png" alt="" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 8 }} />
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>투자내역이 없어요</div>
        </div>
      </div>
    </div>
  )
}

function HistoryApplyingScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="투자내역" onBack={onBack} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>신청중인 주문</div>
          <PendingOrderCard onClick={() => nav('history_detail_applying')} />
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>완료된 주문</div>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>완료된 주문이 없어요</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistorySettledScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="투자내역" onBack={onBack} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>신청중인 주문</div>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>신청중인 주문이 없어요</div>
          </div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>완료된 주문</div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>1C 투자 체결 완료</div>
            </div>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.12</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- NEW History Screens ---

function HistoryPreSettlementScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="투자내역" onBack={onBack} />
        {/* 정산 예정 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>정산 예정</div>
          <div onClick={() => nav('history_detail_pre_settlement')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>1C · 정산 예정</div>
            </div>
            <span style={{
              padding: '2px 8px', borderRadius: 6,
              backgroundColor: 'var(--color-secondary-050)',
              ...T.label13('semibold'), color: 'var(--color-secondary-600)',
            }}>7일 남음</span>
          </div>
        </div>
        <div style={S.divider} />
        {/* 완료된 주문 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>완료된 주문</div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>1C 투자 체결 완료</div>
            </div>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.12</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryPostSettlementScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="투자내역" onBack={onBack} />
        {/* 정산 완료 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>정산 완료</div>
          <div onClick={() => nav('history_detail_post_settlement')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-green-600)' }}>정산 완료 · +2,000원</div>
            </div>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>7.19</span>
          </div>
        </div>
        <div style={S.divider} />
        {/* 완료된 주문 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>완료된 주문</div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>1C 투자 체결 완료</div>
            </div>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.12</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// History Detail Screens
// ============================================================
function HistoryDetailApplyingScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={{ ...S.screen, position: 'relative' }}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto', paddingBottom: 120 }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 52, height: 39, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-700)' }}>체결까지 11일 남음</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)', marginTop: 11 }}>신청</div>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>취소 가능</div>
            </div>
            <div style={{ width: 114, height: 2, backgroundColor: 'var(--color-neutral-200)', margin: '0 8px', marginBottom: 50 }} />
            <div style={{ textAlign: 'center' }}>
              <StepNumber num={2} />
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-500)', marginTop: 11 }}>체결</div>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-400)' }}>취소 불가능</div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>신청 내역</div>
          <div style={{ ...T.body15('medium'), color: 'var(--color-primary-500)', marginBottom: 8 }}>모집율이 따라, 모두 체결되지 않을 수 있어요</div>
          {[
            ['투자 신청일', '2026.06.01 22:21'],
            ['투자 신청 금액', '60,000원'],
            ['신청 수량', '3주'],
            ['체결 예정일', '2026.06.12'],
            ['플랫폼 이용료', '무료'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '20px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <CTAButton label="신청 취소하기" variant="secondary" onClick={() => {}} />
    </div>
  )
}

function HistoryDetailSettledScreen({ onBack, nav }) {
  const [showApplyDetail, setShowApplyDetail] = useState(false)
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 52, height: 39, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)', marginTop: 11 }}>신청</div>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>취소 가능</div>
            </div>
            <div style={{ width: 114, height: 2, backgroundColor: 'var(--color-primary-500)', margin: '0 8px', marginBottom: 50 }} />
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)', marginTop: 11 }}>체결</div>
              <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>취소 불가능</div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 정보 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>체결 내역</div>
          {[
            ['투자 체결일', '2026.06.12 09:00'],
            ['투자 신청 금액', '60,000원'],
            ['투자 체결 금액', '20,000원'],
            ['체결 수량', '1주'],
            ['환불 금액', '40,000원'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '20px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => setShowApplyDetail(!showApplyDetail)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>신청 내역</span>
            <ChevronDown
              size={24}
              color="var(--color-neutral-400)"
              style={{ transform: showApplyDetail ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </div>
          {showApplyDetail && (
            <div style={{ marginTop: 8 }}>
              {[
                ['투자 신청일', '2026.06.01 22:21'],
                ['투자 신청 금액', '60,000원'],
                ['신청 수량', '3주'],
                ['체결 예정일', '2026.06.12'],
                ['플랫폼 이용료', '무료'],
              ].map(([l, v]) => (
                <div key={l} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '20px 0',
                }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
                  <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

// --- NEW History Detail Screens ---

function HistoryDetailPreSettlementScreen({ onBack, nav }) {
  const [showSettledDetail, setShowSettledDetail] = useState(false)
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 52, height: 39, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-700)' }}>A 투자 상품</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 6,
                  backgroundColor: 'var(--color-primary-050)',
                  ...T.label13('semibold'), color: 'var(--color-primary-500)',
                }}>정산 예정</span>
              </div>
            </div>
          </div>
          {/* 2-step progress: 정산 예정 ✓ — 정산 (pending, 7일남음) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>정산 예정</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.1</div>
            </div>
            <div style={{ width: 100, height: 2, backgroundColor: 'var(--color-neutral-200)', marginTop: 17 }} />
            <div style={{ textAlign: 'center' }}>
              <StepNumber num={2} />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-500)', marginTop: 8 }}>정산</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'center' }}>
                <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.12</span>
                <span style={{
                  padding: '2px 6px', borderRadius: 4,
                  backgroundColor: 'var(--color-primary-050)',
                  ...T.label11('semibold'), color: 'var(--color-primary-500)',
                }}>7일남음</span>
              </div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        {/* 정산 내역 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>정산 내역</div>
          <div style={{ ...T.body15('medium'), color: 'var(--color-primary-500)', marginBottom: 16 }}>정산금은 순차 지급될 예정입니다.</div>
          {[
            ['정산 예정일', '2026.07.19'],
            ['정산 예정 금액', '20,000원'],
            ['정산 수량', '1주'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '16px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.divider} />
        {/* 체결 내역 (collapsible) */}
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => setShowSettledDetail(!showSettledDetail)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>체결 내역</span>
            <ChevronDown size={24} color="var(--color-neutral-400)"
              style={{ transform: showSettledDetail ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </div>
          {showSettledDetail && (
            <div style={{ marginTop: 8 }}>
              {[
                ['투자 체결일', '2026.06.12 09:00'],
                ['투자 신청 금액', '60,000원'],
                ['투자 체결 금액', '20,000원'],
                ['체결 수량', '1주'],
                ['환불 금액', '40,000원'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
                  <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

function HistoryDetailSettlementDayScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 52, height: 39, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-700)' }}>A 투자 상품</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 6,
                  backgroundColor: 'var(--color-primary-050)',
                  ...T.label13('semibold'), color: 'var(--color-primary-500)',
                }}>정산 예정</span>
              </div>
            </div>
          </div>
          {/* 2-step progress: 정산 예정 ✓ — 정산 (active, 오늘 지급 예정) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>정산 예정</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>6.1</div>
            </div>
            <div style={{ width: 100, height: 2, backgroundColor: 'var(--color-primary-500)', marginTop: 17 }} />
            <div style={{ textAlign: 'center' }}>
              <StepNumber num={2} active />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-primary-500)', marginTop: 8 }}>정산</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'center' }}>
                <span style={{
                  padding: '2px 6px', borderRadius: 4,
                  backgroundColor: 'var(--color-green-050)',
                  ...T.label11('semibold'), color: 'var(--color-green-600)',
                }}>오늘 지급 예정</span>
              </div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 정보 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>정산 정보</div>
          {[
            ['정산 예정일', '2026.07.19 (오늘)'],
            ['투자 체결 금액', '20,000원'],
            ['체결 수량', '1C'],
            ['정산 상태', '지급 진행중'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '16px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{
                ...T.body17('regular'),
                color: v === '지급 진행중' ? 'var(--color-green-600)' : 'var(--color-neutral-700)',
              }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

function HistoryDetailPostSettlementScreen({ onBack, nav }) {
  const [showSettledDetail, setShowSettledDetail] = useState(false)
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 52, height: 39, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-700)' }}>A 투자 상품</span>
                <span style={{
                  padding: '2px 8px', borderRadius: 6,
                  backgroundColor: 'var(--color-green-050)',
                  ...T.label13('semibold'), color: 'var(--color-green-600)',
                }}>정산 완료</span>
              </div>
            </div>
          </div>
          {/* 2-step progress: both complete */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>정산 예정</div>
            </div>
            <div style={{ width: 100, height: 2, backgroundColor: 'var(--color-primary-500)', marginTop: 17 }} />
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>정산</div>
            </div>
          </div>
          {/* 정산 결과 보기 버튼 */}
          <div onClick={() => nav('product_settlement_result')} style={{
            width: '100%', height: 48, borderRadius: 12,
            backgroundColor: 'var(--color-primary-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: '#fff',
            cursor: 'pointer', marginBottom: 16,
          }}>정산 결과 보기</div>
        </div>
        <div style={S.divider} />
        {/* 정산 내역 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>정산 내역</div>
          {[
            ['정산일', '2026.07.19'],
            ['정산금', '22,000원'],
            ['투자금', '20,000원'],
            ['이익금', '+2,000원'],
            ['세후 이익금', '+1,692원'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '16px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{
                ...T.body17('regular'),
                color: (v.startsWith('+')) ? 'var(--color-red-500)' : 'var(--color-neutral-700)',
              }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.divider} />
        {/* 체결 내역 (collapsible) */}
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => setShowSettledDetail(!showSettledDetail)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>체결 내역</span>
            <ChevronDown size={24} color="var(--color-neutral-400)"
              style={{ transform: showSettledDetail ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </div>
          {showSettledDetail && (
            <div style={{ marginTop: 8 }}>
              {[
                ['투자 체결일', '2026.06.12 09:00'],
                ['투자 체결 금액', '20,000원'],
                ['체결 수량', '1주'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
                  <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

// ============================================================
// Settlement History Screen (정산 내역)
// ============================================================
function SettlementHistoryScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="정산 내역" onBack={onBack} />
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 16px' }}>
          {['전체', '년'].map((t, i) => (
            <div key={t} style={{
              padding: '6px 16px', borderRadius: 20,
              backgroundColor: i === 0 ? 'var(--color-neutral-800)' : 'var(--color-neutral-100)',
              ...T.label13('semibold'),
              color: i === 0 ? '#fff' : 'var(--color-neutral-600)',
            }}>{t}</div>
          ))}
        </div>
        {/* Yearly summary */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', marginBottom: 4 }}>26년 실현수익</div>
          <div style={{ ...T.headline28('bold'), color: 'var(--color-red-500)', marginBottom: 16 }}>+22,000원</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>투자 원금</span>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>20,000원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>수익 합계</span>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-red-500)' }}>+2,000원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>수익률</span>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-red-500)' }}>+20.00%</span>
          </div>
        </div>
        <div style={S.divider} />
        {/* Monthly breakdown */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.headline24('bold'), color: 'var(--color-red-500)', marginBottom: 4 }}>+2,000원(20%)</div>
          <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', marginBottom: 16 }}>6월</div>
          <div onClick={() => nav('product_settlement_result')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginBottom: 2 }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>2026.07.19</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>22,000원</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-red-500)' }}>2,000 | 20%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Account Detail Screen
// ============================================================
function AccountDetailScreen({ onBack, phase }) {
  const data = {
    pre:      { balance: '100,000', count: 1, items: [
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
    applying: { balance: '40,000', count: 2, items: [
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
    settled:  { balance: '80,000', count: 3, items: [
      { date: '6월 12일', label: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
    pre_settlement: { balance: '80,000', count: 3, items: [
      { date: '6월 12일', label: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
    settlement_day: { balance: '80,000', count: 3, items: [
      { date: '6월 12일', label: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
    post_settlement: { balance: '102,000', count: 4, items: [
      { date: '6월 12일', label: 'A 투자 상품 정산', time: '12:31', type: '입금', amount: '+ 22,000원', color: 'var(--color-primary-500)' },
      { date: '6월 12일', label: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
  }
  const d = data[phase]

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={{ backgroundColor: 'var(--color-primary-500)' }}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} color="#fff" />
            </div>
            <div style={{ ...S.appBarCenter, color: '#fff' }}>NH농협은행</div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-primary-500)', padding: '8px 16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ ...T.body15('medium'), color: 'rgba(255,255,255,0.8)' }}>2123456-78-9101112</span>
            <span style={{
              padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 4, ...T.label13('medium'), color: '#fff',
            }}>복사</span>
            <div style={{ flex: 1 }} />
            <MoreVertical size={20} color="rgba(255,255,255,0.5)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ ...T.headline32('bold'), color: '#fff' }}>{d.balance}</span>
            <span style={{ ...T.title20('medium'), color: '#fff', marginLeft: 2 }}>원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {['충전 안내', '출금하기'].map(label => (
              <div key={label} style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
                ...T.body15('semibold'), color: '#fff',
              }}>{label}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid var(--color-neutral-100)' }}>
          {['전체', '입금', '출금'].map((t, i) => (
            <div key={t} style={{
              padding: '16px 0',
              ...T.body15(i === 0 ? 'semibold' : 'medium'),
              color: i === 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)',
              borderBottom: i === 0 ? '2px solid var(--color-neutral-900)' : 'none',
              marginRight: 24,
            }}>{t}</div>
          ))}
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', marginBottom: 20 }}>총 {d.count}건</div>
          {d.items.map((item, i) => (
            <div key={i}>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', marginBottom: 8, marginTop: i > 0 ? 16 : 0 }}>{item.date}</div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                paddingBottom: 16, borderBottom: '1px solid var(--color-neutral-050)',
              }}>
                <div>
                  <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>{item.time} | {item.type}</div>
                </div>
                <span style={{ ...T.body17('semibold'), color: item.color }}>{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN V2 COMPONENT
// ============================================================
export default function V2() {
  const [phase, setPhase] = useState('pre')
  // phases: pre → applying → settled → pre_settlement → settlement_day → post_settlement
  const [screen, setScreen] = useState('home')
  const [history, setHistory] = useState([])

  const navigate = useCallback((target) => {
    setHistory(prev => [...prev, screen])
    setScreen(target)
  }, [screen])

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory(h => h.slice(0, -1))
      setScreen(prev)
    }
  }, [history])

  const goTab = useCallback((tab) => {
    if (tab === 'home') {
      setScreen('home')
      setHistory([])
    }
  }, [])

  const handleGoToQuantity = () => {
    setHistory(prev => [...prev, screen])
    setScreen('quantity_input')
  }

  const handleApply = () => {
    setHistory(prev => [...prev, screen])
    setScreen('apply_complete')
  }

  const handleApplyConfirm = () => {
    setPhase('applying')
    setScreen('home')
    setHistory([])
  }

  // Phase transitions via push notifications
  const handleJumpToSettled = () => {
    setScreen('push_settled')
    setHistory([])
  }
  const handlePushSettledTap = () => {
    setPhase('settled')
    setScreen('home')
    setHistory([])
  }

  const handleJumpToPreSettlement = () => {
    setScreen('push_pre_settlement')
    setHistory([])
  }
  const handlePushPreSettlementTap = () => {
    setPhase('pre_settlement')
    setScreen('home')
    setHistory([])
  }

  const handleJumpToSettlementDay = () => {
    setScreen('push_settlement_day')
    setHistory([])
  }
  const handlePushSettlementDayTap = () => {
    setPhase('settlement_day')
    setScreen('home')
    setHistory([])
  }

  const handleJumpToPostSettlement = () => {
    setScreen('push_post_settlement')
    setHistory([])
  }
  const handlePushPostSettlementTap = () => {
    setPhase('post_settlement')
    setScreen('home')
    setHistory([])
  }

  switch (screen) {
    case 'home':
      if (phase === 'pre') return <HomePreScreen nav={navigate} goTab={goTab} />
      if (phase === 'applying') return <HomeApplyingScreen nav={navigate} goTab={goTab} onJumpToSettled={handleJumpToSettled} />
      if (phase === 'settled') return <HomeSettledScreen nav={navigate} goTab={goTab} onJumpToPreSettlement={handleJumpToPreSettlement} />
      if (phase === 'pre_settlement') return <HomePreSettlementScreen nav={navigate} goTab={goTab} onJumpToSettlementDay={handleJumpToSettlementDay} />
      if (phase === 'settlement_day') return <HomeSettlementDayScreen nav={navigate} goTab={goTab} onJumpToPostSettlement={handleJumpToPostSettlement} />
      if (phase === 'post_settlement') return <HomePostSettlementScreen nav={navigate} goTab={goTab} />
      return <HomePreScreen nav={navigate} goTab={goTab} />

    case 'invest':
      return <InvestScreen nav={navigate} onBack={goBack} phase={phase} />

    case 'asset':
      return <AssetScreen onBack={goBack} nav={navigate} goTab={goTab} phase={phase} />

    case 'product_detail':
      return <ProductDetailScreen onBack={goBack} onApply={handleGoToQuantity} phase={phase} />

    case 'product_settlement_result':
      return <ProductSettlementResultScreen onBack={goBack} />

    case 'quantity_input':
      return <QuantityInputScreen onBack={goBack} onInvest={handleApply} />

    case 'apply_complete':
      return <ApplyCompleteScreen onConfirm={handleApplyConfirm} />

    // Push notification screens
    case 'push_settled':
      return <PushNotificationScreen title="투자 체결" message="'A투자상품'에 1주 투자 체결됐어요." onTap={handlePushSettledTap} />
    case 'push_pre_settlement':
      return <PushNotificationScreen title="정산 예정일 확정" message="'A투자상품' 정산 예정일이 7월 19일로 확정됐어요." onTap={handlePushPreSettlementTap} />
    case 'push_settlement_day':
      return <PushNotificationScreen title="정산금 지급" message="'A투자상품' 정산금이 오늘 순차 지급돼요." onTap={handlePushSettlementDayTap} />
    case 'push_post_settlement':
      return <PushNotificationScreen title="정산 완료" message="'A투자상품' 정산이 완료됐어요. 정산금 22,000원이 입금됐어요." onTap={handlePushPostSettlementTap} />

    case 'account':
      return <AccountDetailScreen onBack={goBack} phase={phase} />

    case 'history':
      if (phase === 'pre') return <HistoryEmptyScreen onBack={goBack} />
      if (phase === 'applying') return <HistoryApplyingScreen onBack={goBack} nav={navigate} />
      if (phase === 'settled') return <HistorySettledScreen onBack={goBack} nav={navigate} />
      if (phase === 'pre_settlement') return <HistoryPreSettlementScreen onBack={goBack} nav={navigate} />
      if (phase === 'settlement_day') return <HistoryPreSettlementScreen onBack={goBack} nav={navigate} />
      if (phase === 'post_settlement') return <HistoryPostSettlementScreen onBack={goBack} nav={navigate} />
      return <HistoryEmptyScreen onBack={goBack} />

    case 'history_detail_applying':
      return <HistoryDetailApplyingScreen onBack={goBack} nav={navigate} />

    case 'history_detail_settled':
      return <HistoryDetailSettledScreen onBack={goBack} nav={navigate} />

    case 'history_detail_pre_settlement':
      return <HistoryDetailPreSettlementScreen onBack={goBack} nav={navigate} />

    case 'history_detail_settlement_day':
      return <HistoryDetailSettlementDayScreen onBack={goBack} nav={navigate} />

    case 'history_detail_post_settlement':
      return <HistoryDetailPostSettlementScreen onBack={goBack} nav={navigate} />

    case 'settlement_history':
      return <SettlementHistoryScreen onBack={goBack} nav={navigate} />

    default:
      return <HomePreScreen nav={navigate} goTab={goTab} />
  }
}
