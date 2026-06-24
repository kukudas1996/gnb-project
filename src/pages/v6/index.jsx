import { createElement, useState, useCallback } from 'react'
import {
  Home, ShoppingBag, Newspaper,
  ChevronLeft, ChevronRight, ChevronDown, Clock,
  Copy, MoreVertical, Users, Delete, Check, X,
  Wallet, Download,
} from 'lucide-react'

// ============================================================
// Global Styles (applied once)
// ============================================================
const globalStyleId = 'v6-global-styles'
if (typeof document !== 'undefined' && !document.getElementById(globalStyleId)) {
  const style = document.createElement('style')
  style.id = globalStyleId
  style.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #root { margin: 0; min-height: 100%; overscroll-behavior: none; overflow-x: hidden; width: 100%; }
    .v6-screen { user-select: none; -webkit-user-select: none; }
    .v6-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: none; }
    .v6-scroll::-webkit-scrollbar { display: none; }
    .v6-hide-scrollbar::-webkit-scrollbar { display: none; }
    @keyframes v6-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes v6-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes v6-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
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
    borderBottom: '1px solid var(--color-neutral-100)',
  },
  appBarRow: {
    height: 56,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
// App Install Banner (sticky top on tab screens)
// ============================================================
function AppInstallBanner() {
  return (
    <div style={{
      backgroundColor: 'var(--color-primary-500)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img src="/앱설치유도.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <span style={{ flex: 1, ...T.label13('medium'), color: '#fff' }}>
        더 편리한 뱅카우앱을 만나보세요
      </span>
      <div style={{
        padding: '4px 12px',
        backgroundColor: '#fff',
        borderRadius: 14,
        ...T.label13('semibold'),
        color: 'var(--color-primary-500)',
        cursor: 'pointer',
        flexShrink: 0,
      }}>앱 다운로드</div>
    </div>
  )
}

// ============================================================
// Web AppBar (bankcow logo left, links right)
// ============================================================
function WebAppBar({ phase, onLogin, nav }) {
  const isGuest = phase === 'guest'
  return (
    <div style={S.appBar}>
      <div style={S.safeTop} />
      <div style={S.appBarRow}>
        <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>bankcow</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {isGuest ? (
            <span
              onClick={onLogin}
              style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center' }}
            >로그인</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <span
                onClick={() => nav('history')}
                style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: '0 8px' }}
              >투자내역</span>
              <span style={{ color: 'var(--color-neutral-300)', margin: '0 2px' }}>|</span>
              <span
                onClick={() => nav('asset')}
                style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)', cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', padding: '0 8px' }}
              >내 계좌</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SubAppBar (back + center title)
// ============================================================
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
// TabBar (3 tabs: 홈/쇼핑/피드)
// ============================================================
function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'home', label: '홈', TabIcon: Home },
    { key: 'shopping', label: '쇼핑', TabIcon: ShoppingBag },
    { key: 'feed', label: '피드', TabIcon: Newspaper },
  ]
  return (
    <div style={S.tabBar}>
      <div style={S.tabBarInner}>
        {tabs.map(({ key, label, TabIcon }) => (
          <div key={key} style={S.tabItem} onClick={() => onTabChange(key)}>
            {createElement(TabIcon, {
              size: 24,
              color: activeTab === key ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)',
              fill: activeTab === key ? 'var(--color-neutral-800)' : 'none',
              strokeWidth: activeTab === key ? 2 : 1.5,
            })}
            <span style={S.tabLabel(activeTab === key)}>{label}</span>
          </div>
        ))}
      </div>
      <div style={S.safeBottom} />
    </div>
  )
}

// ============================================================
// Phase Transition Button (black pill)
// ============================================================
function PhaseTransitionButton({ label, onClick }) {
  return (
    <div style={{
      position: 'fixed', bottom: 'calc(130px + env(safe-area-inset-bottom, 0px))', left: 0, right: 0,
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
// Fixed Bottom CTA
// ============================================================
function FixedBottomCTA({ label, onClick }) {
  return (
    <div style={{
      position: 'fixed', bottom: 'calc(55px + env(safe-area-inset-bottom, 0px))', left: 0, right: 0,
      padding: '8px 16px',
      backgroundColor: 'var(--color-neutral-000)',
      zIndex: 15,
      borderTop: '1px solid var(--color-neutral-050)',
    }}>
      <div onClick={onClick} style={{
        height: 56, borderRadius: 14,
        backgroundColor: 'var(--color-primary-500)',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...T.body17('semibold'), cursor: 'pointer',
        minHeight: 56,
      }}>{label}</div>
    </div>
  )
}

// ============================================================
// CTA Button (for full-screen pages)
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
// App Install Bottom Sheet (shown once on initial entry)
// ============================================================
function AppInstallBottomSheet({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div style={{
        backgroundColor: 'var(--color-neutral-000)',
        borderRadius: '20px 20px 0 0',
        padding: '20px 16px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        animation: 'v6-sheet-up 0.3s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <div onClick={onDismiss} style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <X size={24} color="var(--color-neutral-500)" />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)', whiteSpace: 'pre-line', marginBottom: 8 }}>
            {'앱으로 하면 더 쉬워요\n한우 투자부터 구매까지 빠르게!'}
          </div>
        </div>
        <div style={{
          height: 180, borderRadius: 16,
          backgroundColor: 'var(--color-neutral-050)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, overflow: 'hidden',
        }}>
          <img src="/product.png" alt="" style={{ height: 140, objectFit: 'contain' }} />
        </div>
        <div onClick={onDismiss} style={{
          height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-primary-500)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), cursor: 'pointer',
          marginBottom: 12,
        }}>뱅카우 앱으로 시작하기</div>
        <div onClick={onDismiss} style={{
          textAlign: 'center',
          ...T.body15('medium'), color: 'var(--color-neutral-500)',
          cursor: 'pointer', padding: '8px 0',
        }}>괜찮아요, 모바일 웹으로 볼게요.</div>
      </div>
    </div>
  )
}

// ============================================================
// Footer
// ============================================================
function Footer({ phase, onLogin }) {
  const isGuest = phase === 'guest'
  return (
    <div style={{ backgroundColor: '#EBEDF2', padding: '32px 16px 40px' }}>
      {/* App download button */}
      <div style={{
        height: 48, borderRadius: 24,
        border: '1px solid var(--color-neutral-300)',
        backgroundColor: 'var(--color-neutral-000)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6,
        ...T.body15('semibold'), color: 'var(--color-neutral-700)',
        marginBottom: 16,
      }}>
        <Download size={18} color="var(--color-neutral-600)" />
        앱 다운로드
      </div>

      {/* Login/Logout link */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {isGuest ? (
          <span onClick={onLogin} style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', cursor: 'pointer' }}>로그인</span>
        ) : (
          <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>로그아웃</span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--color-neutral-200)', marginBottom: 24 }} />

      {/* Two columns */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-700)', marginBottom: 12 }}>고객지원</div>
          {['고객센터', '1:1 문의', '공지사항'].map(item => (
            <div key={item} style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', marginBottom: 8 }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-700)', marginBottom: 12 }}>약관</div>
          {['서비스 이용약관', '개인정보 처리방침', '추심이체 거래약관', '마케팅 수신동의'].map(item => (
            <div key={item} style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', marginBottom: 8 }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'var(--color-neutral-200)', marginBottom: 24 }} />

      {/* Company info */}
      <div style={{ ...T.body15('bold'), color: 'var(--color-neutral-700)', marginBottom: 12 }}>bankcow</div>
      <div style={{ ...T.label13('regular'), color: 'var(--color-neutral-500)', lineHeight: '20px', marginBottom: 16 }}>
        기업: 주식회사 스탁키퍼<br />
        대표이사 안재헌<br />
        주소: 서울특별시 강남구 테헤란로 501, 2층 208-210호<br />
        사업자등록번호: 000-00-00000<br />
        통신판매업: 제0000-서울강남-00000호
      </div>

      {/* Social media icons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: 'var(--color-neutral-300)',
          }} />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Shared UI Components
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
// Home Screen
// ============================================================
function HomeScreen({ phase, nav, goTab, onLogin, showBottomSheet, onDismissSheet, onPhaseTransition }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={S.scrollBody}>
        <AppInstallBanner />
        <WebAppBar phase={phase} onLogin={onLogin} nav={nav} />

        {/* Large placeholder area — white bg to contrast with gray footer */}
        <div style={{
          backgroundColor: 'var(--color-neutral-000)',
          minHeight: 520,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 16px',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div style={{
            ...T.title20('semibold'), color: 'var(--color-neutral-300)',
            textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '32px',
          }}>{'잘 만들어진\n투자 전환을 위한\n상세페이지'}</div>
        </div>

        {/* Divider between content and footer */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-100)' }} />

        {/* Footer */}
        <Footer phase={phase} onLogin={onLogin} />
      </div>

      {/* Phase transition buttons */}
      {phase === 'applying' && (
        <PhaseTransitionButton label="체결 당일로 이동" onClick={() => onPhaseTransition('settled')} />
      )}
      {phase === 'settled' && (
        <PhaseTransitionButton label="정산 완료로 이동" onClick={() => onPhaseTransition('post_settlement')} />
      )}

      {/* Fixed bottom CTA */}
      {(phase === 'guest' || phase === 'member' || phase === 'applying' || phase === 'settled' || phase === 'post_settlement') && (
        <FixedBottomCTA
          label="투자하러 가기"
          onClick={() => {
            if (phase === 'guest') {
              onLogin()
            } else {
              nav('product_detail')
            }
          }}
        />
      )}

      <TabBar activeTab="home" onTabChange={goTab} />

      {/* App install bottom sheet overlay */}
      {showBottomSheet && <AppInstallBottomSheet onDismiss={onDismissSheet} />}
    </div>
  )
}

// ============================================================
// Shopping Screen (쇼핑)
// ============================================================
function ShoppingScreen({ phase, goTab, onLogin, nav }) {
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: '[1++등급] 등심 로스구이 150g',
    price: '20,000원',
    unit: '100g당 1,000원',
    img: '/shopping.jpg',
  }))

  const ShopProductCard = ({ product }) => (
    <div style={{ width: 150, flexShrink: 0 }}>
      <div style={{
        width: '100%', aspectRatio: '1/1', borderRadius: 8,
        overflow: 'hidden', backgroundColor: 'var(--color-neutral-100)',
      }}>
        <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: 'var(--color-neutral-900)', marginTop: 2 }}>
          {product.price}
        </div>
        <div style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>
          {product.unit}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '16px', color: 'var(--color-neutral-700)', border: '1px solid var(--color-neutral-100)', borderRadius: 4, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'var(--color-primary-500)', display: 'inline-block' }} />
            뱅카우한우
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '16px', color: 'var(--color-neutral-700)', border: '1px solid var(--color-neutral-100)', borderRadius: 4, padding: '2px 6px' }}>
            텍스트
          </span>
        </div>
      </div>
    </div>
  )

  const ProductSection = ({ title }) => (
    <div style={{ padding: '28px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)' }}>전체보기</span>
          <ChevronRight size={10} color="var(--color-neutral-700)" />
        </div>
      </div>
      <div className="v6-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {products.slice(0, 3).map(p => <ShopProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )

  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={S.scrollBody}>
        <AppInstallBanner />
        <WebAppBar phase={phase} onLogin={onLogin} nav={nav} />

        {/* Title */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>쇼핑</div>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', cursor: 'pointer' }}>검색</span>
          </div>
        </div>

        {/* Banner placeholder */}
        <div style={{ padding: '16px 16px' }}>
          <div style={{
            height: 120, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body15('semibold'), color: 'var(--color-neutral-500)', opacity: 0.5,
          }}>배너</div>
        </div>

        {/* Quick action bar */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}>
            {['주문내역', '내 포인트', '내 쿠폰'].map((text, i) => [
              i > 0 && <div key={`d${i}`} style={{ width: 1, height: 25, backgroundColor: 'var(--color-neutral-200)' }} />,
              <div key={text} style={{ flex: 1, textAlign: 'center', ...T.body17('medium'), color: 'var(--color-neutral-800)', cursor: 'pointer' }}>
                {text}
              </div>
            ])}
          </div>
        </div>

        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />
        <ProductSection title="전체 상품" />
        <div style={{ height: 0, borderTop: '1px solid var(--color-neutral-050)' }} />
        <ProductSection title="{상품 그룹}" />

        <Footer phase={phase} onLogin={onLogin} />
      </div>
      <TabBar activeTab="shopping" onTabChange={goTab} />
    </div>
  )
}

// ============================================================
// Feed Screen (피드/서비스)
// ============================================================
function FeedScreen({ phase, goTab, onLogin, nav }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={S.scrollBody}>
        <AppInstallBanner />
        <WebAppBar phase={phase} onLogin={onLogin} nav={nav} />

        {/* Title */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>서비스</div>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)', cursor: 'pointer' }}>알림</span>
          </div>
        </div>

        {/* Banner placeholder */}
        <div style={{ padding: '16px 16px' }}>
          <div style={{
            height: 120, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body15('semibold'), color: 'var(--color-neutral-500)', opacity: 0.5,
          }}>배너</div>
        </div>

        {/* 뱅카우 숏츠 */}
        <div style={{ padding: '8px 16px 24px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 12 }}>뱅카우 숏츠</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['/숏츠1.png', '/숏츠2.png'].map((src, i) => (
              <div key={i} style={{
                flex: 1, aspectRatio: '9/14', borderRadius: 12,
                overflow: 'hidden',
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 뱅카우 콘텐츠 */}
        <div style={{ padding: '24px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 12 }}>뱅카우 콘텐츠</div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['전체', '카테고리', '카테고리'].map((t, i) => (
              <div key={i} style={{
                padding: '6px 16px', borderRadius: 20,
                backgroundColor: i === 0 ? 'var(--color-neutral-800)' : 'var(--color-neutral-100)',
                ...T.label13('semibold'),
                color: i === 0 ? '#fff' : 'var(--color-neutral-600)',
              }}>{t}</div>
            ))}
          </div>
          {/* Content grid 2x3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px' }}>
            {[
              { img: '/insight/content-1.png', title: '한우 투자, 이제 시작해도 늦지 않다' },
              { img: '/insight/content-2.png', title: '한우 투자, 이제 시작해도 늦지 않다' },
              { img: '/insight/content-3.png', title: '한우 투자로 얻는 수익과 리스크 분석' },
              { img: '/insight/content-4.png', title: '한우 투자로 얻는 수익과 리스크 분석' },
              { img: '/insight/content-5.png', title: '초보자를 위한 한우 투자 가이드' },
              { img: '/insight/content-6.png', title: '초보자를 위한 한우 투자 가이드' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{
                  aspectRatio: '16/10', borderRadius: 8,
                  overflow: 'hidden', marginBottom: 8,
                }}>
                  <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ ...T.body15('medium'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
          {/* 더보기 button */}
          <div style={{
            height: 44, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body15('semibold'), color: 'var(--color-neutral-700)',
            marginTop: 20, cursor: 'pointer',
          }}>더보기</div>
        </div>

        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 언론 보도 */}
        <div style={{ padding: '24px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>언론 보도</div>
          {[
            { img: '/insight/news-1.png', title: '한우 투자, 새로운 기회', sub: '최근 한우 시장의 변화와...' },
            { img: '/insight/news-2.png', title: '한우 투자, 성공적인 사례', sub: '한우 투자에 성공한 사례를...' },
            { img: '/insight/news-3.png', title: '한우 투자, 전문가의 조언', sub: '전문가들은 한우 투자를 고...' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 0',
              borderBottom: i < 2 ? '1px solid var(--color-neutral-100)' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>{item.sub}</div>
              </div>
              <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>

        <Footer phase={phase} onLogin={onLogin} />
      </div>
      <TabBar activeTab="feed" onTabChange={goTab} />
    </div>
  )
}

// ============================================================
// Product Detail Screen
// ============================================================
function ProductDetailScreen({ onBack, onApply }) {
  return (
    <div className="v6-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <SubAppBar title="A 투자 상품" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          backgroundColor: 'var(--color-neutral-050)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-300)' }}>투자 상품 상세</span>
      </div>
      <CTAButton label="투자하기" onClick={onApply} />
    </div>
  )
}

// ============================================================
// Product Detail After (신청 후)
// ============================================================
function ProductDetailAfterScreen({ onBack }) {
  return (
    <div className="v6-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <SubAppBar title="A 투자 상품" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          backgroundColor: 'var(--color-neutral-050)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-300)' }}>투자 상품 상세</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        backgroundColor: 'var(--color-neutral-000)', zIndex: 15,
        display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-neutral-100)',
          color: 'var(--color-neutral-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'),
        }}>3주 투자중</div>
        <div style={{
          flex: 1, height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-primary-500)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), cursor: 'pointer',
        }}>추가 투자</div>
      </div>
    </div>
  )
}

// ============================================================
// Quantity Input Screen
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
    <div className="v6-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
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
            NH농협은행 김한우 (5672) &gt;
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

// ============================================================
// Apply Complete Screen
// ============================================================
function ApplyCompleteScreen({ onConfirm }) {
  return (
    <div className="v6-screen" style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
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
          투자 신청이 완료됐어요.<br/>6월 12일에 체결 결과를 알려드릴게요.
        </div>
      </div>
      <CTAButton label="확인" onClick={onConfirm} />
    </div>
  )
}

// ============================================================
// Asset Screen (내 계좌)
// ============================================================
function AssetScreen({ onBack, nav, phase }) {
  const data = {
    guest:            { balance: '0원' },
    member:           { balance: '100,000원' },
    applying:         { balance: '40,000원' },
    settled:          { balance: '80,000원' },
    post_settlement:  { balance: '102,000원' },
  }
  const d = data[phase] || data.member

  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="내 계좌" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '16px 0' }}>
            <span style={{ ...T.body17('medium'), color: 'var(--color-neutral-600)' }}>총 계좌 잔액</span>
            <span style={{ ...T.headline28('bold'), color: 'var(--color-neutral-900)' }}>{d.balance}</span>
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
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>{d.balance}</div>
              </div>
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 8,
              backgroundColor: 'var(--color-neutral-100)',
              ...T.label13('semibold'), color: 'var(--color-neutral-700)',
            }}>출금</div>
          </div>
        </div>
        <div style={{ padding: '24px 16px' }}>
          <div style={{
            height: 56, borderRadius: 14,
            backgroundColor: 'var(--color-neutral-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
          }}>계좌 개설하기</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Account Detail Screen (계좌 상세)
// ============================================================
function AccountDetailScreen({ onBack, phase }) {
  const data = {
    member:   { balance: '100,000', count: 1, items: [
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
    post_settlement: { balance: '102,000', count: 4, items: [
      { date: '6월 12일', label: 'A 투자 상품 정산', time: '12:31', type: '입금', amount: '+ 22,000원', color: 'var(--color-primary-500)' },
      { date: '6월 12일', label: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', label: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-900)' },
      { date: '5월 15일', label: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ]},
  }
  const d = data[phase] || data.member

  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
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
// History Screens
// ============================================================
function HistoryEmptyScreen({ onBack }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <SubAppBar title="투자 내역" onBack={onBack} />
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: 'calc(100dvh - 120px)',
      }}>
        <div style={{ ...T.body17('medium'), color: 'var(--color-neutral-500)' }}>투자내역이 없어요</div>
      </div>
    </div>
  )
}

function HistoryApplyingScreen({ onBack, nav }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="" onBack={onBack} />
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>신청 중인 투자</div>
          <div style={{ ...T.label13('medium'), color: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
            내 투자가 신청중인 이유
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--color-primary-400)" strokeWidth="1.5"/><text x="8" y="11.5" textAnchor="middle" fill="var(--color-primary-400)" fontSize="10" fontWeight="600">i</text></svg>
          </div>
          <div onClick={() => nav('history_detail_applying')} style={{
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              backgroundColor: 'var(--color-primary-050)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>60,000원</div>
            </div>
            <div style={{
              padding: '4px 10px', borderRadius: 20,
              border: '1px solid var(--color-primary-400)',
              ...T.label13('semibold'), color: 'var(--color-primary-500)',
            }}>11일남음</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistorySettledScreen({ onBack, nav }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>투자 내역</div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', cursor: 'pointer',
          }}>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', minWidth: 40, flexShrink: 0 }}>06.12</span>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>체결</div>
            </div>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)' }}>1주</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryPostSettlementScreen({ onBack, nav }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <SubAppBar title="" onBack={onBack} />
        <div style={{ padding: '0 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>투자 내역</div>
          <div onClick={() => nav('history_detail_post_settlement')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
            borderBottom: '1px solid var(--color-neutral-100)', cursor: 'pointer',
          }}>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', minWidth: 40, flexShrink: 0 }}>12.01</span>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>정산</div>
            </div>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)' }}>1주</span>
          </div>
          <div onClick={() => nav('history_detail_settled')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', cursor: 'pointer',
          }}>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', minWidth: 40, flexShrink: 0 }}>06.12</span>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
              <div style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>체결</div>
            </div>
            <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)' }}>1주</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// History Detail: 신청 (applying)
// ============================================================
function HistoryDetailApplyingScreen({ onBack }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '0 16px 0' }}>
          <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>A 투자 상품 투자 신청</div>
        </div>
        {/* Progress stepper */}
        <div style={{ padding: '24px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>신청</div>
              <div style={{ ...T.label11('medium'), color: 'var(--color-neutral-500)', marginTop: 2 }}>취소 가능</div>
            </div>
            <div style={{ width: 100, height: 2, backgroundColor: 'var(--color-neutral-200)', margin: '0 8px', marginBottom: 40 }} />
            <div style={{ textAlign: 'center' }}>
              <StepNumber num={2} />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-500)', marginTop: 8 }}>체결</div>
              <div style={{ ...T.label11('medium'), color: 'var(--color-neutral-500)', marginTop: 2 }}>취소 불가능</div>
              <div style={{
                display: 'inline-block', marginTop: 6,
                padding: '2px 8px', borderRadius: 4,
                backgroundColor: 'var(--color-primary-050)',
                ...T.label11('semibold'), color: 'var(--color-primary-500)',
              }}>11일남음</div>
            </div>
          </div>
          <div style={{
            width: '100%', height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            marginTop: 24, marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 4 }}>상세 내역</div>
          <div style={{ ...T.label13('medium'), color: 'var(--color-primary-500)', marginBottom: 20 }}>모집율이 따라, 모두 체결되지 않을 수 있어요</div>
          {[
            ['투자 신청일', '2026.06.01 22:21'],
            ['투자 신청 금액', '60,000원'],
            ['신청 수량', '3주'],
            ['체결 예정일', '2026.06.12'],
            ['플랫폼 이용료', '무료'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '16px 0',
            }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{ ...T.body17('regular'), color: 'var(--color-neutral-700)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 16px 40px' }}>
          <div style={{
            height: 56, borderRadius: 14,
            border: '1px solid var(--color-neutral-200)',
            backgroundColor: 'var(--color-neutral-000)',
            color: 'var(--color-red-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), cursor: 'pointer',
          }}>신청 취소하기</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// History Detail: 체결 (settled)
// ============================================================
function HistoryDetailSettledScreen({ onBack }) {
  const [showApplyDetail, setShowApplyDetail] = useState(false)
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '0 16px 0' }}>
          <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 24 }}>A 투자 상품 체결 완료</div>
        </div>
        {/* Progress stepper */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>신청</div>
              <div style={{ ...T.label11('medium'), color: 'var(--color-neutral-500)', marginTop: 2 }}>취소 가능</div>
            </div>
            <div style={{ width: 100, height: 2, backgroundColor: 'var(--color-primary-500)', margin: '0 8px', marginBottom: 30 }} />
            <div style={{ textAlign: 'center' }}>
              <IconCheck filled />
              <div style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)', marginTop: 8 }}>체결</div>
              <div style={{ ...T.label11('medium'), color: 'var(--color-neutral-500)', marginTop: 2 }}>취소 불가능</div>
            </div>
          </div>
          <div style={{
            width: '100%', height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            marginBottom: 16,
          }}>상품 정보 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>상세 내역</div>
          {[
            ['투자 체결일', '2026.06.12 09:00'],
            ['투자 신청 금액', '60,000원'],
            ['투자 체결 금액', '20,000원'],
            ['체결 수량', '1주'],
            ['환불 금액', '40,000원'],
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
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => setShowApplyDetail(!showApplyDetail)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
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
                  display: 'flex', justifyContent: 'space-between', padding: '16px 0',
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

// ============================================================
// History Detail: 정산 완료 (post_settlement)
// ============================================================
function HistoryDetailPostSettlementScreen({ onBack }) {
  return (
    <div className="v6-screen" style={S.screen}>
      <div className="v6-scroll" style={{ height: '100dvh', overflowY: 'auto' }}>
        <div style={S.appBar}>
          <div style={S.safeTop} />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </div>
            <div style={{ width: 44 }} />
          </div>
        </div>
        <div style={{ padding: '0 16px 0' }}>
          <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>A 투자 상품 정산 완료</div>
          <div style={{
            width: '100%', height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)',
            cursor: 'pointer',
          }}>상품 정보 보기</div>
        </div>

        <div style={S.divider} />

        {/* 상세 내역 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.body17('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>상세 내역</div>
          {[
            ['정산일', '2026.08.14 09:00'],
            ['정산금', '22,000원'],
            ['투자금', '20,000원'],
            ['수익금', '+20,000원'],
            ['수익률', '+20.00%'],
          ].map(([l, v]) => (
            <div key={l} style={{
              display: 'flex', justifyContent: 'space-between', padding: '12px 0',
              borderBottom: '1px solid var(--color-neutral-050)',
            }}>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-900)' }}>{l}</span>
              <span style={{
                ...T.body15('medium'),
                color: v.startsWith('+') ? 'var(--color-red-500)' : 'var(--color-neutral-700)',
              }}>{v}</span>
            </div>
          ))}

          {/* Tax info box */}
          <div style={{
            marginTop: 16, padding: '16px',
            backgroundColor: 'var(--color-neutral-050)', borderRadius: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...T.label13('semibold'), color: 'var(--color-neutral-700)' }}>배당소득세</span>
                <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)', padding: '1px 6px', backgroundColor: 'var(--color-neutral-100)', borderRadius: 4 }}>지세비</span>
              </div>
              <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-700)' }}>(30,800)원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-600)' }}>· 세후 수익금</span>
              <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-700)' }}>+(169,200)원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-600)' }}>· 세후 수익률</span>
              <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-700)' }}>+(16.92)%</span>
            </div>
          </div>
        </div>

        <div style={S.divider} />

        {/* 정산 히스토리 */}
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...T.body17('bold'), color: 'var(--color-neutral-900)', marginBottom: 16 }}>정산 히스토리</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-neutral-200)' }}>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>(50마리) 정산 내역</span>
            <span style={{ ...T.label13('medium'), color: 'var(--color-neutral-500)' }}>금액</span>
          </div>
          {[
            { label: '경매금', value: '{100,000,000}원' },
            { label: '가축 구매비', value: '-{100,000,000}원' },
            { label: '사료 구매비', value: '-{100,000,000}원' },
            { label: '사육 관리비', value: '-{100,000,000}원' },
            { label: '증권 관리비', value: '0원' },
          ].map(({ label, value }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)' }}>{label}</span>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-900)' }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid var(--color-neutral-200)', marginTop: 4 }}>
            <span style={{ ...T.body15('bold'), color: 'var(--color-neutral-900)' }}>경매 결과</span>
            <span style={{ ...T.body15('bold'), color: 'var(--color-neutral-900)' }}>{'{100,000,000}원'}</span>
          </div>
          {[
            { label: '보상금', value: '+{100,000,000}원', tag: '더보기' },
            { label: '농가 장려금', value: '-{100,000,000}원', tag: '자세히' },
            { label: '운영 성과금', value: '-{100,000,000}원', tag: '자세히' },
          ].map(({ label, value, tag }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-700)' }}>{label}</span>
                <span style={{ ...T.label11('medium'), color: 'var(--color-neutral-500)', padding: '1px 6px', backgroundColor: 'var(--color-neutral-050)', borderRadius: 4 }}>{tag}</span>
              </div>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-900)' }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-neutral-200)', marginTop: 4, paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ ...T.body15('bold'), color: 'var(--color-neutral-900)' }}>전체 수익금 (21,876C)</span>
              <span style={{ ...T.body15('bold'), color: 'var(--color-red-500)' }}>+20,000,000원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0' }}>
              <span style={{ ...T.body15('medium'), color: 'var(--color-neutral-600)' }}>└ 내 수익금 (1C)</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...T.body15('bold'), color: 'var(--color-red-500)' }}>+22,000원</div>
                <div style={{ ...T.label13('medium'), color: 'var(--color-red-500)' }}>+20.00%</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

// ============================================================
// MAIN V6 COMPONENT
// ============================================================
export default function V6() {
  const [phase, setPhase] = useState('guest')
  // phases: guest -> member -> applying -> settled -> post_settlement
  const [screen, setScreen] = useState('home')
  const [history, setHistory] = useState([])
  const [showBottomSheet, setShowBottomSheet] = useState(true)

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
    setScreen(tab)
    setHistory([])
  }, [])

  const handleLogin = useCallback(() => {
    setPhase('member')
  }, [])

  const handleDismissSheet = useCallback(() => {
    setShowBottomSheet(false)
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
    setScreen('product_detail_after')
    setHistory(['home'])
  }

  const handlePhaseTransition = (nextPhase) => {
    setPhase(nextPhase)
    setScreen('home')
    setHistory([])
  }

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          phase={phase}
          nav={navigate}
          goTab={goTab}
          onLogin={handleLogin}
          showBottomSheet={showBottomSheet}
          onDismissSheet={handleDismissSheet}
          onPhaseTransition={handlePhaseTransition}
        />
      )

    case 'shopping':
      return <ShoppingScreen phase={phase} goTab={goTab} onLogin={handleLogin} nav={navigate} />

    case 'feed':
      return <FeedScreen phase={phase} goTab={goTab} onLogin={handleLogin} nav={navigate} />

    case 'product_detail':
      return <ProductDetailScreen onBack={goBack} onApply={handleGoToQuantity} />

    case 'product_detail_after':
      return <ProductDetailAfterScreen onBack={goBack} />

    case 'quantity_input':
      return <QuantityInputScreen onBack={goBack} onInvest={handleApply} />

    case 'apply_complete':
      return <ApplyCompleteScreen onConfirm={handleApplyConfirm} />

    case 'asset':
      return <AssetScreen onBack={goBack} nav={navigate} phase={phase} />

    case 'account':
      return <AccountDetailScreen onBack={goBack} phase={phase} />

    case 'history':
      if (phase === 'guest' || phase === 'member') return <HistoryEmptyScreen onBack={goBack} />
      if (phase === 'applying') return <HistoryApplyingScreen onBack={goBack} nav={navigate} />
      if (phase === 'settled') return <HistorySettledScreen onBack={goBack} nav={navigate} />
      if (phase === 'post_settlement') return <HistoryPostSettlementScreen onBack={goBack} nav={navigate} />
      return <HistoryEmptyScreen onBack={goBack} />

    case 'history_detail_applying':
      return <HistoryDetailApplyingScreen onBack={goBack} />

    case 'history_detail_settled':
      return <HistoryDetailSettledScreen onBack={goBack} />

    case 'history_detail_post_settlement':
      return <HistoryDetailPostSettlementScreen onBack={goBack} />

    default:
      return (
        <HomeScreen
          phase={phase}
          nav={navigate}
          goTab={goTab}
          onLogin={handleLogin}
          showBottomSheet={showBottomSheet}
          onDismissSheet={handleDismissSheet}
          onPhaseTransition={handlePhaseTransition}
        />
      )
  }
}
