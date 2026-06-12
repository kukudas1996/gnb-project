import { useState, useCallback } from 'react'

// ============================================================
// Icons
// ============================================================
const IconBell = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="var(--color-neutral-400)"/>
  </svg>
)
const IconBack = ({ color = 'var(--color-neutral-900)' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 5l7 7-7 7" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconHome = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill={active ? 'var(--color-neutral-900)' : 'none'} stroke={active ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)'} strokeWidth="2"/>
  </svg>
)
const IconInvest = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" fill={active ? 'var(--color-neutral-900)' : 'none'} stroke={active ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)'} strokeWidth="2"/>
    <path d="M3 10h18" stroke={active ? '#fff' : 'var(--color-neutral-400)'} strokeWidth="2"/>
  </svg>
)
const IconShopping = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconMy = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconCheck = ({ size = 24, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill={filled ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'} />
    <path d="M7 12l3.5 3.5L17 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ============================================================
// Shared Styles
// ============================================================
const S = {
  screen: {
    width: 375,
    minHeight: 812,
    margin: '0 auto',
    backgroundColor: 'var(--color-neutral-000)',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollBody: {
    height: 812,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 81,
  },
  statusBar: {
    height: 44,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 15,
    fontWeight: 600,
  },
  appBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'var(--color-neutral-000)',
  },
  appBarRow: {
    height: 60,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--color-neutral-900)',
  },
  appBarCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 600,
    color: 'var(--color-neutral-900)',
    pointerEvents: 'none',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-neutral-000)',
    borderTop: '1px solid var(--color-neutral-100)',
    zIndex: 20,
  },
  tabBarInner: {
    display: 'flex',
    height: 47,
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
  },
  tabLabel: (active) => ({
    fontSize: 11,
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)',
  }),
  safeBottom: {
    height: 34,
    backgroundColor: 'var(--color-neutral-000)',
  },
  divider: {
    height: 12,
    backgroundColor: 'var(--color-neutral-050)',
  },
}

// ============================================================
// StatusBar
// ============================================================
function StatusBar({ light = false }) {
  const color = light ? '#fff' : '#000'
  return (
    <div style={{ ...S.statusBar, color }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="8" width="3" height="4" rx="0.5" fill={color}/><rect x="4" y="5" width="3" height="7" rx="0.5" fill={color}/><rect x="8" y="2" width="3" height="10" rx="0.5" fill={color}/><rect x="12" y="0" width="3" height="12" rx="0.5" fill={color}/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 3.5C9.8 3.5 11.4 4.2 12.6 5.4L14 4C12.4 2.4 10.3 1.5 8 1.5S3.6 2.4 2 4l1.4 1.4C4.6 4.2 6.2 3.5 8 3.5zm-3.2 3.2L8 10l3.2-3.3C10.2 5.7 9.2 5.2 8 5.2S5.8 5.7 4.8 6.7z" fill={color}/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0" y="1" width="22" height="11" rx="2" stroke={color} strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="19" height="8" rx="1" fill={color}/><path d="M23 5v3a2 2 0 000-3z" fill={color}/></svg>
      </div>
    </div>
  )
}

// ============================================================
// AppBar Variants
// ============================================================
function HomeAppBar({ title = '홈' }) {
  return (
    <div style={S.appBar}>
      <StatusBar />
      <div style={S.appBarRow}>
        <span style={S.appBarTitle}>{title}</span>
        <IconBell />
      </div>
    </div>
  )
}

function SubAppBar({ title, onBack }) {
  return (
    <div style={S.appBar}>
      <StatusBar />
      <div style={{ ...S.appBarRow, position: 'relative' }}>
        <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1 }}><IconBack /></div>
        <div style={S.appBarCenter}>{title}</div>
        <div style={{ width: 24 }} />
      </div>
    </div>
  )
}

// ============================================================
// TabBar
// ============================================================
function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'home', label: '홈', Icon: IconHome },
    { key: 'invest', label: '투자', Icon: IconInvest },
    { key: 'shopping', label: '쇼핑', Icon: IconShopping },
    { key: 'my', label: '마이', Icon: IconMy },
  ]
  return (
    <div style={S.tabBar}>
      <div style={S.tabBarInner}>
        {tabs.map(({ key, label, Icon }) => (
          <div key={key} style={S.tabItem} onClick={() => onTabChange(key)}>
            <Icon active={activeTab === key} />
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
      border: '1px solid var(--color-neutral-200)',
      borderRadius: 16,
      overflow: 'hidden',
      cursor: 'pointer',
    }}>
      <div style={{
        height: 200,
        background: 'linear-gradient(135deg, var(--color-primary-050) 0%, var(--color-primary-100) 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'var(--color-neutral-000)',
          borderRadius: 20,
          padding: '6px 12px',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-neutral-700)',
          alignSelf: 'flex-start',
        }}>
          <span>&#9200;</span> 13일 23:59:59 남음
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 48 }}>&#128197;&#9889;</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          fontSize: 13,
          color: 'var(--color-neutral-600)',
        }}>
          &#129412; {'{9,999}'}명 투자중
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 4 }}>A 투자 상품</div>
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          backgroundColor: 'var(--color-neutral-050)',
          borderRadius: 4,
          fontSize: 13,
          color: 'var(--color-neutral-600)',
          marginBottom: 12,
        }}>10마리 투자상품</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginBottom: 2 }}>1C 금액</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-900)' }}>20,000원~</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginBottom: 2 }}>마감 일자</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-900)' }}>2023.12.31</div>
          </div>
        </div>
        <div style={{ height: 4, backgroundColor: 'var(--color-neutral-100)', borderRadius: 2, marginBottom: 8 }}>
          <div style={{ width: '33%', height: 4, backgroundColor: 'var(--color-primary-500)', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-neutral-500)' }}>
          <span>8,475 / 25,278C</span>
          <span style={{
            padding: '1px 8px',
            backgroundColor: 'var(--color-primary-050)',
            color: 'var(--color-primary-600)',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 12,
          }}>{'{모집중}'}</span>
        </div>
      </div>
    </div>
  )
}

function ClosedProductCard() {
  return (
    <div style={{
      minWidth: 280,
      border: '1px solid var(--color-neutral-200)',
      borderRadius: 16,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        height: 160,
        background: 'linear-gradient(135deg, var(--color-neutral-300) 0%, var(--color-neutral-400) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ fontSize: 36 }}>&#128197;&#9889;</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>120% 투자 달성</div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 4 }}>유전지수 높은 상품</div>
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          backgroundColor: 'var(--color-neutral-050)',
          borderRadius: 4,
          fontSize: 12,
          color: 'var(--color-neutral-600)',
          marginBottom: 12,
        }}>10마리 투자상품</div>
        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginBottom: 2 }}>1C 금액</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>50,000원~</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginBottom: 2 }}>마감 일자</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>2023.12.31</div>
          </div>
        </div>
        <div style={{ height: 4, backgroundColor: 'var(--color-primary-500)', borderRadius: 2, marginBottom: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-neutral-500)' }}>
          <span>8,475 / 25,278C</span>
          <span style={{
            padding: '1px 8px',
            backgroundColor: 'var(--color-neutral-800)',
            color: '#fff',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 11,
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
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '12px 16px',
      paddingBottom: 46,
      backgroundColor: 'var(--color-neutral-000)',
      zIndex: 15,
    }}>
      <div
        onClick={onClick}
        style={{
          height: 56,
          borderRadius: 12,
          backgroundColor: isPrimary ? 'var(--color-primary-500)' : 'var(--color-neutral-100)',
          color: isPrimary ? '#fff' : 'var(--color-neutral-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
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
      backgroundColor: 'var(--color-neutral-050)',
      borderRadius: 12,
      padding: '20px 16px',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-primary-500)' }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>신청중인 주문 1건</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          backgroundColor: 'var(--color-primary-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>&#128197;</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>60,000원</span>
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-neutral-500)' }}>3주</div>
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
        fontSize: 24,
      }}>&#128197;</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>20,000원</span>
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-neutral-500)' }}>1주</div>
      </div>
    </div>
  )
}

function MenuItem({ label, onClick }) {
  return (
    <div onClick={onClick} style={{
      height: 65,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-neutral-900)' }}>{label}</span>
      <IconRight />
    </div>
  )
}

// ============================================================
// Home Screens
// ============================================================
function HomeMyInvestSection({ amount, nav, goTab, children }) {
  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ fontSize: 15, color: 'var(--color-neutral-500)', marginBottom: 4 }}>내 투자</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-neutral-900)' }}>{amount}</span>
        <div onClick={() => goTab('invest')} style={{
          padding: '8px 16px', borderRadius: 20,
          border: '1px solid var(--color-neutral-200)',
          fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-700)',
          cursor: 'pointer',
        }}>더보기</div>
      </div>
      <div style={{
        display: 'flex',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: children ? 16 : 0,
      }}>
        <div onClick={() => nav('account')} style={{
          flex: 1, padding: '16px 0', textAlign: 'center',
          fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-700)',
          cursor: 'pointer',
        }}>내 계좌</div>
        <div style={{ width: 1, backgroundColor: 'var(--color-neutral-200)' }} />
        <div onClick={() => nav('history')} style={{
          flex: 1, padding: '16px 0', textAlign: 'center',
          fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-700)',
          cursor: 'pointer',
        }}>투자내역</div>
      </div>
      {children}
    </div>
  )
}

function HomeProductSections({ nav }) {
  return (
    <>
      <div style={{ padding: '24px 16px 32px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 16 }}>투자 상품</div>
        <ProductCard onClick={() => nav('product_detail')} />
      </div>
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 16 }}>마감 상품</div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 8 }}>
          <ClosedProductCard />
          <ClosedProductCard />
        </div>
      </div>
    </>
  )
}

function Banner() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{
        height: 120, borderRadius: 16,
        backgroundColor: 'var(--color-neutral-050)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, color: 'var(--color-neutral-500)',
      }}>배너</div>
    </div>
  )
}

function HomePreScreen({ nav, goTab }) {
  return (
    <div style={S.screen}>
      <div style={S.scrollBody}>
        <HomeAppBar />
        <Banner />
        <HomeMyInvestSection amount="0원" nav={nav} goTab={goTab} />
        <div style={{ height: 12 }} />
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeApplyingScreen({ nav, goTab, onJumpToSettled }) {
  return (
    <div style={S.screen}>
      <div style={S.scrollBody}>
        <HomeAppBar />
        <div style={{
          display: 'flex', justifyContent: 'center',
          position: 'sticky', top: 104, zIndex: 15,
          marginTop: -10, marginBottom: -46,
          pointerEvents: 'none',
        }}>
          <div onClick={onJumpToSettled} style={{
            padding: '12px 24px',
            backgroundColor: 'var(--color-neutral-800)',
            color: '#fff',
            borderRadius: 24,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>체결 당일로 이동하기</div>
        </div>
        <Banner />
        <HomeMyInvestSection amount="60,000원" nav={nav} goTab={goTab}>
          <PendingOrderCard />
        </HomeMyInvestSection>
        <HomeProductSections nav={nav} />
      </div>
      <TabBar activeTab="home" onTabChange={goTab} />
    </div>
  )
}

function HomeSettledScreen({ nav, goTab }) {
  return (
    <div style={S.screen}>
      <div style={S.scrollBody}>
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
    <div style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 17, color: 'var(--color-neutral-400)' }}>투자 상품 상세</span>
      </div>
      {phase === 'pre' ? (
        <CTAButton label="투자하기" onClick={onApply} />
      ) : (
        <CTAButton label="확인" onClick={onBack} />
      )}
    </div>
  )
}

function ApplyCompleteScreen({ onConfirm }) {
  return (
    <div style={{ ...S.screen, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        marginTop: -80,
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
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 16 }}>투자 신청 완료</div>
        <div style={{ fontSize: 15, color: 'var(--color-neutral-500)', textAlign: 'center', lineHeight: '24px' }}>
          투자 신청이 완료됐어요.<br/>6월 12일에 배정 결과를 알려드릴게요.
        </div>
      </div>
      <CTAButton label="확인" onClick={onConfirm} />
    </div>
  )
}

function PushNotificationScreen({ onTap }) {
  return (
    <div style={{
      ...S.screen,
      backgroundColor: 'var(--color-dark-900)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StatusBar light />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={onTap} style={{
          width: 343,
          padding: '14px 16px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            backgroundColor: 'var(--color-primary-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 20 }}>&#128004;</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>투자 체결</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>9:41 AM</span>
            </div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '20px' }}>
              'A투자상품'에 1주 투자 체결됐어요.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest Tab Screens
// ============================================================
function InvestScreen({ nav, goTab, phase }) {
  const config = {
    pre:      { amount: '0원', account: '100,000원' },
    applying: { amount: '60,000원', account: '40,000원' },
    settled:  { amount: '20,000원', account: '80,000원' },
  }
  const c = config[phase]

  return (
    <div style={S.screen}>
      <div style={S.scrollBody}>
        <HomeAppBar title="투자" />
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 15, color: 'var(--color-neutral-500)', marginBottom: 4 }}>내 투자</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 20 }}>{c.amount}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>계좌</span>
            <span onClick={() => nav('account')} style={{ fontSize: 15, color: 'var(--color-neutral-500)', cursor: 'pointer' }}>계좌 보기</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <div onClick={() => nav('account')} style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-050)',
              borderRadius: 12,
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginBottom: 4 }}>뱅카우 계좌</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-900)' }}>{c.account}</div>
            </div>
            <div style={{
              flex: 1, padding: 16,
              backgroundColor: 'var(--color-neutral-050)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 15, color: 'var(--color-neutral-500)' }}>계좌 개설하기</span>
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: 16 }}>투자중 상품</div>
          {phase === 'pre' && (
            <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
              <div style={{ fontSize: 64, marginBottom: 8 }}>&#128004;</div>
              <div style={{ fontSize: 17, color: 'var(--color-neutral-500)' }}>투자중인 상품이 없어요</div>
            </div>
          )}
          {phase === 'applying' && <PendingOrderCard />}
          {phase === 'settled' && <SettledProductItem />}
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
// History Screens
// ============================================================
function HistoryEmptyScreen({ onBack }) {
  return (
    <div style={S.screen}>
      <SubAppBar title="투자내역" onBack={onBack} />
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: 500,
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>&#128004;</div>
        <div style={{ fontSize: 17, color: 'var(--color-neutral-500)' }}>투자내역이 없어요</div>
      </div>
    </div>
  )
}

function HistoryApplyingScreen({ onBack, nav }) {
  return (
    <div style={S.screen}>
      <SubAppBar title="투자내역" onBack={onBack} />
      <div style={{ padding: '0 16px' }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 4 }}>신청 중인 주문</div>
          <div style={{ fontSize: 15, color: 'var(--color-neutral-500)', marginBottom: 16 }}>내 투자가 신청중인 이유</div>
        </div>
        <PendingOrderCard onClick={() => nav('history_detail_applying')} />
      </div>
      <div style={{ ...S.divider, marginTop: 24 }} />
      <div style={{ padding: '20px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 20 }}>완료된 주문</div>
        <div onClick={() => nav('history_detail_applying')} style={{
          display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
          borderBottom: '1px solid var(--color-neutral-100)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-600)', width: 44 }}>6.1</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>3주 투자 신청 완료</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistorySettledScreen({ onBack, nav }) {
  return (
    <div style={S.screen}>
      <SubAppBar title="투자내역" onBack={onBack} />
      <div style={{ padding: '20px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 20 }}>완료된 주문</div>
        <div onClick={() => nav('history_detail_applying')} style={{
          display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
          borderBottom: '1px solid var(--color-neutral-100)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-600)', width: 44 }}>6.1</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>3주 투자 신청 완료</div>
          </div>
        </div>
        <div onClick={() => nav('history_detail_settled')} style={{
          display: 'flex', alignItems: 'flex-start', gap: 24, padding: '16px 0',
          borderBottom: '1px solid var(--color-neutral-100)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-600)', width: 44 }}>6.12</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>A 투자 상품</div>
            <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>1주 투자 체결 완료 / 2주 환불 처리</div>
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
    <div style={{ ...S.screen, position: 'relative' }}>
      <div style={{ height: 812, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
        <div style={S.appBar}>
          <StatusBar />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1 }}><IconBack /></div>
            <div style={{ width: 24 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>&#128197;</div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)' }}>A 투자 상품 신청</span>
          </div>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck size={34} filled />
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-neutral-900)', marginTop: 8 }}>신청</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>취소 가능</div>
            </div>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-neutral-200)', margin: '0 8px', marginBottom: 36 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: 'var(--color-neutral-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-600)',
                margin: '0 auto',
              }}>2</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-neutral-600)', marginTop: 8 }}>체결</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>취소 불가능</div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-700)',
            cursor: 'pointer',
            marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 4 }}>신청 내역</div>
          <div style={{ fontSize: 13, color: 'var(--color-primary-500)', marginBottom: 20 }}>모집율이 따라, 모두 체결되지 않을 수 있어요</div>
          {[
            ['투자 신청 금액', '60,000원'],
            ['신청 수량', '3주'],
            ['투자 신청 시간', '2026.06.01 22:21'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--color-neutral-050)' }}>
              <span style={{ fontSize: 15, color: 'var(--color-neutral-600)' }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={S.divider} />
        <div style={{ padding: '0 16px' }}>
          {[
            ['체결 예정일', '2026.06.02'],
            ['취소 시 수수료', '1,000원'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--color-neutral-050)' }}>
              <span style={{ fontSize: 15, color: 'var(--color-neutral-600)' }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <CTAButton label="신청 취소하기" variant="secondary" onClick={() => {}} />
    </div>
  )
}

function HistoryDetailSettledScreen({ onBack, nav }) {
  return (
    <div style={S.screen}>
      <div style={{ height: 812, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={S.appBar}>
          <StatusBar />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1 }}><IconBack /></div>
            <div style={{ width: 24 }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>&#128197;</div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)' }}>A 투자 상품 체결</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <IconCheck size={34} filled />
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-neutral-900)', marginTop: 8 }}>신청</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>취소 가능</div>
            </div>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-neutral-200)', margin: '0 8px', marginBottom: 36 }} />
            <div style={{ textAlign: 'center' }}>
              <IconCheck size={34} filled />
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-neutral-900)', marginTop: 8 }}>체결</div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>취소 불가능</div>
            </div>
          </div>
          <div onClick={() => nav('product_detail')} style={{
            height: 48, borderRadius: 12,
            border: '1px solid var(--color-neutral-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-700)',
            cursor: 'pointer',
            marginBottom: 16,
          }}>상품 상세 보기</div>
        </div>
        <div style={S.divider} />
        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 4 }}>체결 완료</div>
          <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginBottom: 20 }}>2026.06.12 09:30</div>
          {[
            ['투자 체결 금액', '20,000원'],
            ['체결 수량', '1주'],
            ['투자 신청 시간', '2026.06.01 22:21'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--color-neutral-050)' }}>
              <span style={{ fontSize: 15, color: 'var(--color-neutral-600)' }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-900)' }}>{v}</span>
            </div>
          ))}
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
  }
  const d = data[phase]

  return (
    <div style={S.screen}>
      <div style={{ height: 812, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ backgroundColor: 'var(--color-primary-500)' }}>
          <StatusBar light />
          <div style={{ ...S.appBarRow, position: 'relative' }}>
            <div onClick={onBack} style={{ cursor: 'pointer', zIndex: 1 }}><IconBack color="#fff" /></div>
            <div style={{ ...S.appBarCenter, color: '#fff' }}>NH농협은행</div>
            <div style={{ width: 24 }} />
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-primary-500)', padding: '8px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>&#127942;</span>
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>2123456-78-9101112</span>
            <span style={{
              padding: '2px 8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 4,
              fontSize: 13,
              color: '#fff',
            }}>복사</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>&#8942;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{d.balance}</span>
            <span style={{ fontSize: 20, fontWeight: 500, color: '#fff', marginLeft: 2 }}>원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {['충전 안내', '출금하기'].map(label => (
              <div key={label} style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
              }}>{label}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--color-neutral-100)' }}>
          {['전체', '입금', '출금'].map((t, i) => (
            <div key={t} style={{
              padding: '16px 0',
              fontSize: 15,
              fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-400)',
              borderBottom: i === 0 ? '2px solid var(--color-neutral-900)' : 'none',
              marginRight: 24,
            }}>{t}</div>
          ))}
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 15, color: 'var(--color-neutral-600)', marginBottom: 20 }}>총 {d.count} 건</div>
          {d.items.map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginBottom: 8, marginTop: i > 0 ? 16 : 0 }}>{item.date}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--color-neutral-050)' }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-neutral-900)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>{item.time} | {item.type}</div>
                </div>
                <span style={{ fontSize: 17, fontWeight: 600, color: item.color }}>{item.amount}</span>
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

    case 'product_detail':
      return <ProductDetailScreen onBack={goBack} onApply={handleApply} phase={phase} />

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
