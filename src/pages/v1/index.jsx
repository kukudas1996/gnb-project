import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Home, TrendingUp, ShoppingBag, User,
  Bell, ChevronLeft, ChevronRight, ChevronDown, Clock,
  Copy, MoreVertical, Users, Delete
} from 'lucide-react'

// ============================================================
// Global Styles (applied once)
// ============================================================
const globalStyleId = 'v1-global-styles'
if (typeof document !== 'undefined' && !document.getElementById(globalStyleId)) {
  const style = document.createElement('style')
  style.id = globalStyleId
  style.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { overscroll-behavior: none; }
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
    width: '100vw',
    maxWidth: '100vw',
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
    { key: 'invest', label: '투자', Icon: TrendingUp },
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
      {/* Top area with timer and image */}
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
      {/* Info card */}
      <div style={{
        backgroundColor: 'var(--color-neutral-000)',
        borderRadius: 8,
        padding: '20px 24px',
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
        {/* Progress bar */}
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
        padding: '20px 24px', marginTop: 8,
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

function SettledProductItem({ onClick }) {
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
          <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
          <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>20,000원</span>
        </div>
        <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)' }}>1C</div>
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
// Home Screens
// ============================================================
function HomeMyInvestSection({ amount, accountAmount = '100,000원', nav, goTab, children, showMoreButton, onMore }) {
  return (
    <div style={{ padding: '24px 16px 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 20 }}>
        <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>내 투자</span>
        <div
          onClick={() => goTab('invest')}
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
      {showMoreButton && (
        <div onClick={onMore} style={{
          height: 48, borderRadius: 12,
          backgroundColor: 'var(--color-neutral-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body15('semibold'), color: 'var(--color-neutral-700)',
          cursor: 'pointer', marginTop: 16,
        }}>더보기</div>
      )}
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
      <div style={{ padding: '24px 16px 120px' }}>
        <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 12 }}>마감 상품</div>
        <div className="v1-hide-scrollbar" style={{
          display: 'flex', gap: 16, overflowX: 'auto',
          paddingBottom: 16, marginRight: -16,
        }}>
          <ClosedProductCard />
          <ClosedProductCard />
          <div style={{ minWidth: 16, flexShrink: 0 }} />
        </div>
      </div>
    </>
  )
}

function HomePreScreen({ nav, goTab }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <Banner />
        <HomeMyInvestSection amount="0원" nav={nav} goTab={goTab} />
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
        <div style={{
          display: 'flex', justifyContent: 'center',
          position: 'sticky', top: 104, zIndex: 15,
          marginTop: -10, marginBottom: -46, pointerEvents: 'none',
        }}>
          <div onClick={onJumpToSettled} style={{
            padding: '12px 24px',
            backgroundColor: 'var(--color-neutral-800)', color: '#fff',
            borderRadius: 24, ...T.body15('semibold'),
            cursor: 'pointer', pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>체결 당일로 이동하기</div>
        </div>
        <Banner />
        <HomeMyInvestSection
          amount="0원"
          accountAmount="40,000원"
          nav={nav}
          goTab={goTab}
          showMoreButton
          onMore={() => goTab('invest')}
        >
          <PendingOrderCard onClick={() => nav('history_detail_applying')} />
        </HomeMyInvestSection>
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeSettledScreen({ nav, goTab }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar />
        <Banner />
        <HomeMyInvestSection amount="20,000원" nav={nav} goTab={goTab}>
          <SettledProductItem />
        </HomeMyInvestSection>
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
        {/* Account pill */}
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

        {/* Quantity display */}
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

        {/* Info row */}
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

        {/* Quick buttons */}
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

        {/* Number pad */}
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

        {/* CTA */}
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
        padding: '0 24px', marginTop: -80,
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

function PushNotificationScreen({ onTap }) {
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
              <span style={{ ...T.body15('semibold'), color: '#fff' }}>투자 체결</span>
              <span style={{ ...T.label13('medium'), color: 'rgba(255,255,255,0.5)' }}>9:41 AM</span>
            </div>
            <div style={{ ...T.body15('medium'), color: 'rgba(255,255,255,0.8)', lineHeight: '20px' }}>
              'A투자상품'에 1주 투자 체결됐어요.
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
function InvestScreen({ nav, goTab, phase }) {
  const config = {
    pre:      { amount: '0원', account: '100,000원' },
    applying: { amount: '60,000원', account: '40,000원' },
    settled:  { amount: '20,000원', account: '80,000원' },
  }
  const c = config[phase]

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={S.scrollBody}>
        <HomeAppBar title="투자" />
        {/* 내 투자 */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>내 투자</span>
            <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{c.amount}</span>
          </div>
        </div>
        {/* 계좌 */}
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
        </div>
        <div style={{ ...S.divider, marginTop: 24 }} />
        <div>
          <MenuItem label="투자 내역" onClick={() => nav('history')} />
          <MenuItem label="정산 내역" />
          <MenuItem label="자산 보호 내역" />
          <MenuItem label="세금" />
          <MenuItem label="중도해지 취소내역" />
        </div>
        <div style={{ height: 100 }} />
      </div>
      <TabBar activeTab="invest" onTabChange={goTab} />
    </div>
  )
}

// ============================================================
// Asset Screen (자산)
// ============================================================
function AssetScreen({ onBack, phase }) {
  const data = {
    pre:      { total: '100,000원', bank: '100,000원', invest: '0원' },
    applying: { total: '100,000원', bank: '40,000원', invest: '60,000원' },
    settled:  { total: '100,000원', bank: '80,000원', invest: '20,000원' },
  }
  const d = data[phase]

  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="자산" onBack={onBack} />
        {/* 총 자산 */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '16px 0' }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>총 자산</span>
            <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{d.total}</span>
          </div>
        </div>
        {/* 계좌 목록 */}
        <div style={{ padding: '12px 16px' }}>
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
              cursor: 'pointer',
            }}>출금</div>
          </div>
        </div>
        <div style={{ padding: '16px 16px' }}>
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
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: 500,
      }}>
        <img src="/empty.png" alt="" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 8 }} />
        <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>투자내역이 없어요</div>
      </div>
    </div>
  )
}

function HistoryApplyingScreen({ onBack, nav }) {
  return (
    <div className="v1-screen" style={S.screen}>
      <div className="v1-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="투자내역" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>신청 중인 주문</div>
            <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)', marginBottom: 16 }}>내 투자가 신청중인 이유</div>
          </div>
          <PendingOrderCard onClick={() => nav('history_detail_applying')} />
        </div>
        <div style={{ ...S.divider, marginTop: 24 }} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>완료된 주문</div>
          <div onClick={() => nav('history_detail_applying')} style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', width: 44 }}>6.1</span>
            <div>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>3주 투자 신청 완료</div>
            </div>
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
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>완료된 주문</div>
          <div onClick={() => nav('history_detail_applying')} style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', width: 44 }}>6.1</span>
            <div>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>3주 투자 신청 완료</div>
            </div>
          </div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', width: 44 }}>6.12</span>
            <div>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>1주 투자 체결 완료 / 2주 환불 처리</div>
            </div>
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
  const IconCheck = ({ filled = false }) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="16" fill={filled ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'} />
      <path d="M10 17l5 5L24 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

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
        {/* Header with product avatar */}
        <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            backgroundColor: 'var(--color-primary-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 12,
          }}>
            <img src="/product.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </div>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>A 투자 상품</div>
          <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-500)', marginBottom: 24 }}>체결까지 11일 남음</div>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginTop: 8 }}>신청</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>취소 가능</div>
            </div>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-neutral-200)', margin: '0 8px', marginBottom: 36 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: 'var(--color-neutral-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...T.body15('semibold'), color: 'var(--color-neutral-600)',
                margin: '0 auto',
              }}>2</div>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-600)', marginTop: 8 }}>체결</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>취소 불가능</div>
            </div>
          </div>

          {/* Product detail button */}
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body15('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.label13('medium'), color: 'var(--color-primary-500)', marginBottom: 20 }}>모집율에 따라, 모두 체결되지 않을 수 있어요</div>
          {[
            ['투자 신청일', '2026.06.01'],
            ['투자 신청 금액', '60,000원'],
            ['신청 수량', '3C'],
            ['체결 예정일', '2026.06.12'],
            ['플랫폼 이용료', '무료'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '20px 0',
              borderBottom: '1px solid var(--color-neutral-050)',
            }}>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>{l}</span>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{v}</span>
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
  const IconCheck = ({ filled = false }) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="16" fill={filled ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'} />
      <path d="M10 17l5 5L24 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

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
        {/* Header with product avatar */}
        <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            backgroundColor: 'var(--color-primary-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 12,
          }}>
            <img src="/product.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </div>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 24 }}>A 투자 상품</div>

          {/* Progress steps - both filled */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginTop: 8 }}>신청</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>취소 가능</div>
            </div>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-primary-500)', margin: '0 8px', marginBottom: 36 }} />
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)', marginTop: 8 }}>체결</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>취소 불가능</div>
            </div>
          </div>

          {/* Product info button */}
          <div onClick={() => nav('product_detail')} style={{
            width: '100%', height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body15('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer', marginBottom: 16,
          }}>상품 정보 보기</div>
        </div>
        <div style={S.divider} />

        {/* 체결 내역 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>체결 내역</div>
          {[
            ['투자 체결일', '2026.06.12'],
            ['투자 신청 금액', '60,000원'],
            ['투자 체결 금액', '20,000원'],
            ['체결 수량', '1C'],
            ['환불 금액', '40,000원'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '20px 0',
              borderBottom: '1px solid var(--color-neutral-050)',
            }}>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>{l}</span>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.divider} />

        {/* 신청 내역 (collapsible) */}
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => setShowApplyDetail(!showApplyDetail)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>신청 내역</span>
            <ChevronDown
              size={24}
              color="var(--color-neutral-400)"
              style={{ transform: showApplyDetail ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </div>
          {showApplyDetail && (
            <div style={{ marginTop: 8 }}>
              {[
                ['투자 신청일', '2026.06.01'],
                ['투자 신청 금액', '60,000원'],
                ['신청 수량', '3C'],
                ['플랫폼 이용료', '무료'],
              ].map(([l, v]) => (
                <div key={l} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '20px 0',
                  borderBottom: '1px solid var(--color-neutral-050)',
                }}>
                  <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>{l}</span>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{v}</span>
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
        <div style={{ backgroundColor: 'var(--color-primary-500)', padding: '8px 24px 24px' }}>
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
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--color-neutral-100)' }}>
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
        <div style={{ padding: '20px 24px' }}>
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
// MAIN V1 COMPONENT
// ============================================================
export default function V1() {
  const [phase, setPhase] = useState('pre')
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
    } else if (tab === 'invest') {
      setScreen('invest')
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

  const handleJumpToSettled = () => {
    setScreen('push_notification')
    setHistory([])
  }

  const handlePushTap = () => {
    setPhase('settled')
    setScreen('home')
    setHistory([])
  }

  switch (screen) {
    case 'home':
      if (phase === 'pre') return <HomePreScreen nav={navigate} goTab={goTab} />
      if (phase === 'applying') return <HomeApplyingScreen nav={navigate} goTab={goTab} onJumpToSettled={handleJumpToSettled} />
      return <HomeSettledScreen nav={navigate} goTab={goTab} />

    case 'invest':
      return <InvestScreen nav={navigate} goTab={goTab} phase={phase} />

    case 'asset':
      return <AssetScreen onBack={goBack} phase={phase} />

    case 'product_detail':
      return <ProductDetailScreen onBack={goBack} onApply={handleGoToQuantity} phase={phase} />

    case 'quantity_input':
      return <QuantityInputScreen onBack={goBack} onInvest={handleApply} />

    case 'apply_complete':
      return <ApplyCompleteScreen onConfirm={handleApplyConfirm} />

    case 'push_notification':
      return <PushNotificationScreen onTap={handlePushTap} />

    case 'account':
      return <AccountDetailScreen onBack={goBack} phase={phase} />

    case 'history':
      if (phase === 'pre') return <HistoryEmptyScreen onBack={goBack} />
      if (phase === 'applying') return <HistoryApplyingScreen onBack={goBack} nav={navigate} />
      return <HistorySettledScreen onBack={goBack} nav={navigate} />

    case 'history_detail_applying':
      return <HistoryDetailApplyingScreen onBack={goBack} nav={navigate} />

    case 'history_detail_settled':
      return <HistoryDetailSettledScreen onBack={goBack} nav={navigate} />

    default:
      return <HomePreScreen nav={navigate} goTab={goTab} />
  }
}
