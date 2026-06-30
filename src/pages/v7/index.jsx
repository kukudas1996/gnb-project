import { useState, useCallback, useRef } from 'react'

// ============================================================
// Global Styles
// ============================================================
const globalStyleId = 'v7-global-styles'
if (typeof document !== 'undefined' && !document.getElementById(globalStyleId)) {
  const style = document.createElement('style')
  style.id = globalStyleId
  style.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #root { margin: 0; min-height: 100%; overscroll-behavior: none; overflow-x: hidden; width: 100%; }
    .v7-screen { user-select: none; -webkit-user-select: none; }
    .v7-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: none; }
    .v7-scroll::-webkit-scrollbar { display: none; }
    .v7-hide-scrollbar::-webkit-scrollbar { display: none; }
    @keyframes v7-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes v7-slide-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
    @keyframes v7-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes v7-message-slide-down { from { max-height: 0; opacity: 0; margin-top: 0; } to { max-height: 120px; opacity: 1; margin-top: 8px; } }
    .v7-message-enter { animation: v7-message-slide-down 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards; overflow: hidden; }
  `
  document.head.appendChild(style)
}

// ============================================================
// Typography Helpers
// ============================================================
const T = {
  headline32: (w = 'bold') => ({ fontSize: `var(--font-headline32-${w}-size)`, lineHeight: `var(--font-headline32-${w}-line-height)`, fontWeight: `var(--font-headline32-${w}-weight)` }),
  headline28: (w = 'bold') => ({ fontSize: `var(--font-headline28-${w}-size)`, lineHeight: `var(--font-headline28-${w}-line-height)`, fontWeight: `var(--font-headline28-${w}-weight)` }),
  headline24: (w = 'bold') => ({ fontSize: `var(--font-headline24-${w}-size)`, lineHeight: `var(--font-headline24-${w}-line-height)`, fontWeight: `var(--font-headline24-${w}-weight)` }),
  title20: (w = 'bold') => ({ fontSize: `var(--font-title20-${w}-size)`, lineHeight: `var(--font-title20-${w}-line-height)`, fontWeight: `var(--font-title20-${w}-weight)` }),
  body17: (w = 'medium') => ({ fontSize: `var(--font-body17-${w}-size)`, lineHeight: `var(--font-body17-${w}-line-height)`, fontWeight: `var(--font-body17-${w}-weight)` }),
  body15: (w = 'medium') => ({ fontSize: `var(--font-body15-${w}-size)`, lineHeight: `var(--font-body15-${w}-line-height)`, fontWeight: `var(--font-body15-${w}-weight)` }),
  label13: (w = 'medium') => ({ fontSize: `var(--font-label13-${w}-size)`, lineHeight: `var(--font-label13-${w}-line-height)`, fontWeight: `var(--font-label13-${w}-weight)` }),
  label11: (w = 'medium') => ({ fontSize: `var(--font-label11-${w}-size)`, lineHeight: `var(--font-label11-${w}-line-height)`, fontWeight: `var(--font-label11-${w}-weight)` }),
}

// ============================================================
// SVG Icons
// ============================================================
const ChevronLeftIcon = ({ size = 24, color = 'var(--color-neutral-800)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
)
const ChevronRightIcon = ({ size = 20, color = 'var(--color-neutral-400)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
)
const DeleteIcon = ({ size = 24, color = 'var(--color-neutral-700)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
)
const BellIcon = ({ size = 24, color = 'var(--color-neutral-800)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)
const SettingsIcon = ({ size = 24, color = 'var(--color-neutral-800)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
)

// ============================================================
// Main Router
// ============================================================
export default function V7App() {
  const [phase, setPhase] = useState('pre')
  // phases: pre -> applying -> settled -> pre_settlement -> settlement_day -> post_settlement
  const [screen, setScreen] = useState('home')
  const [history, setHistory] = useState([])
  const [messageDismissed, setMessageDismissed] = useState(false)

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
    setMessageDismissed(false)
  }

  // Phase transitions via push notifications
  const handleJumpToSettled = () => { setScreen('push_settled'); setHistory([]) }
  const handlePushSettledTap = () => { setPhase('settled'); setScreen('home'); setHistory([]); setMessageDismissed(false) }
  const handleJumpToPreSettlement = () => { setScreen('push_pre_settlement'); setHistory([]) }
  const handlePushPreSettlementTap = () => { setPhase('pre_settlement'); setScreen('home'); setHistory([]); setMessageDismissed(false) }
  const handleJumpToSettlementDay = () => { setScreen('push_settlement_day'); setHistory([]) }
  const handlePushSettlementDayTap = () => { setPhase('settlement_day'); setScreen('home'); setHistory([]); setMessageDismissed(false) }
  const handleJumpToPostSettlement = () => { setScreen('push_post_settlement'); setHistory([]) }
  const handlePushPostSettlementTap = () => { setPhase('post_settlement'); setScreen('home'); setHistory([]); setMessageDismissed(false) }

  const dismissMessage = useCallback(() => setMessageDismissed(true), [])

  const phaseTransitions = {
    applying: { label: '체결 당일로 이동하기', onClick: handleJumpToSettled },
    settled: { label: '정산 7일 전으로 이동하기', onClick: handleJumpToPreSettlement },
    pre_settlement: { label: '정산 당일로 이동하기', onClick: handleJumpToSettlementDay },
    settlement_day: { label: '정산 완료로 이동하기', onClick: handleJumpToPostSettlement },
  }

  switch (screen) {
    case 'home':
      return <HomeScreen phase={phase} nav={navigate} goTab={goTab} phaseTransition={phaseTransitions[phase]} messageDismissed={messageDismissed} onDismissMessage={dismissMessage} />
    case 'shopping':
      return <ShoppingScreen goTab={goTab} />
    case 'my':
      return <MyPageScreen nav={navigate} goTab={goTab} />
    case 'product_detail':
      return <InvestProductDetailScreen onBack={goBack} onApply={handleGoToQuantity} />
    case 'product_detail_after':
      return <InvestProductDetailAfterScreen onBack={goBack} />
    case 'quantity_input':
      return <QuantityInputScreen onBack={goBack} onInvest={handleApply} />
    case 'apply_complete':
      return <ApplyCompleteScreen onConfirm={handleApplyConfirm} />
    case 'asset':
      return <AssetScreen onBack={goBack} nav={navigate} phase={phase} />
    case 'account':
      return <AccountDetailScreen onBack={goBack} phase={phase} />
    case 'history':
      return <InvestHistoryScreen onBack={goBack} nav={navigate} phase={phase} />
    case 'history_detail':
      return <InvestHistoryDetailScreen onBack={goBack} nav={navigate} phase={phase} />
    case 'settlement_history':
      return <SettlementHistoryScreen onBack={goBack} />
    case 'my_invest_detail':
      return <MyInvestDetailScreen onBack={goBack} nav={navigate} />
    case 'push_settled':
      return <PushNotificationScreen title="투자 체결" message="'A 투자 상품'에 1주 투자 체결됐어요." onTap={handlePushSettledTap} />
    case 'push_pre_settlement':
      return <PushNotificationScreen title="투자 정산" message="'A투자상품'이(가) 12월 1일에 정산 예정입니다." onTap={handlePushPreSettlementTap} />
    case 'push_settlement_day':
      return <PushNotificationScreen title="투자 정산" message="'A투자상품'의 정산금이 오늘 순차적으로 지급될 예정입니다." onTap={handlePushSettlementDayTap} />
    case 'push_post_settlement':
      return <PushNotificationScreen title="투자 정산" message="'A투자상품' 정산이 완료됐어요. 정산금 22,000원이 입금됐어요." onTap={handlePushPostSettlementTap} />
    default:
      return <HomeScreen phase={phase} nav={navigate} goTab={goTab} phaseTransition={phaseTransitions[phase]} messageDismissed={messageDismissed} onDismissMessage={dismissMessage} />
  }
}

// ============================================================
// Phase Transition Button
// ============================================================
function PhaseTransitionButton({ label, onClick }) {
  return (
    <div style={{ padding: '8px 16px' }}>
      <div onClick={onClick} style={{
        height: 44, borderRadius: 12, border: '1.5px dashed var(--color-primary-400)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', backgroundColor: 'rgba(68,135,255,0.05)',
      }}>
        <span style={{ ...T.body15('semibold'), color: 'var(--color-primary-500)' }}>{label}</span>
      </div>
    </div>
  )
}

// ============================================================
// Dynamic Message
// ============================================================
function DynamicMessage({ phase, dismissed, onDismiss }) {
  if (dismissed) return null
  const messages = {
    applying: { text: '3주 투자 신청 완료됐어요', sub: '유전지수 높은 상품' },
    settled: { text: '1주 투자 체결됐어요', sub: '유전지수 높은 상품' },
    pre_settlement: { text: '12월 1일 정산 예정이에요', sub: '유전지수 높은 상품' },
    settlement_day: { text: '정산금이 지급될 예정이에요', sub: '유전지수 높은 상품' },
    post_settlement: { text: '정산 완료! 22,000원이 입금됐어요', sub: '유전지수 높은 상품' },
  }
  const msg = messages[phase]
  if (!msg) return null

  return (
    <div className="v7-message-enter" style={{ padding: '0 16px' }}>
      <div style={{
        backgroundColor: 'var(--color-neutral-050)',
        borderRadius: 20, padding: '20px 12px 20px 20px',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="/product.png" alt="" style={{ width: 48, height: 48, objectFit: 'cover', flexShrink: 0, borderRadius: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
            <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{msg.sub}</span>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{msg.text}</span>
          </div>
        </div>
        <div onClick={onDismiss} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <img src="/icons/Close Button.svg" alt="닫기" style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Home Screen (Phase-Aware)
// ============================================================
function HomeScreen({ phase, nav, goTab, phaseTransition, messageDismissed, onDismissMessage }) {
  const [bannerIndex] = useState(0)
  const bannerCount = 5

  const phaseConfig = {
    pre: { account: '100,000원', investAmount: '0원', showInvestItem: false, showApplying: false },
    applying: { account: '100,000원', investAmount: '0원', showInvestItem: false, showApplying: true },
    settled: { account: '80,000원', investAmount: '20,000원', showInvestItem: true, showApplying: false, remainingText: '1년 8개월 남음' },
    pre_settlement: { account: '80,000원', investAmount: '20,000원', showInvestItem: true, showApplying: false, remainingText: '4개월 남음' },
    settlement_day: { account: '80,000원', investAmount: '20,000원', showInvestItem: true, showApplying: false, remainingText: '4개월 남음' },
    post_settlement: { account: '100,000원', investAmount: '0원', showInvestItem: false, showApplying: false },
  }
  const config = phaseConfig[phase] || phaseConfig.pre
  const hasInvest = config.investAmount !== '0원'

  return (
    <div className="v7-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{
        height: '100dvh', overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))',
      }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/logo.svg" alt="bankcow" style={{ height: 24, width: 120 }} />
            <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <img src="/icons/AppBarItem/Notification Icon.svg" alt="알림" style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Dynamic Message */}
        {phase !== 'pre' && (
          <DynamicMessage phase={phase} dismissed={messageDismissed} onDismiss={onDismissMessage} />
        )}

        {/* Phase Transition Button */}
        {phaseTransition && (
          <PhaseTransitionButton label={phaseTransition.label} onClick={phaseTransition.onClick} />
        )}

        {/* Banner (pre only) or spacer */}
        {phase === 'pre' && (
          <div style={{ padding: '12px 16px 0' }}>
            <div style={{ width: '100%', height: 120, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <img src="/banner.png" alt="배너" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 100, padding: '0 8px', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 12, fontWeight: 500 }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '18px' }}>{bannerIndex + 1}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>/</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>{bannerCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* 투자중 금액 */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>투자중 금액</span>
          <div onClick={() => nav('asset')} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)', whiteSpace: 'nowrap' }}>{config.investAmount}</span>
            <ChevronRightIcon size={28} color="var(--color-neutral-400)" />
          </div>
        </div>

        {/* 투자 아이템 (settled phases only) */}
        {config.showInvestItem && (
          <>
            <div onClick={() => nav('my_invest_detail')} style={{ padding: '0 20px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  <img src="/product.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>A 투자 상품</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{config.remainingText}</span>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>20,000원</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1주</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12, gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-neutral-800)' }} />
              <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-neutral-200)' }} />
            </div>
          </>
        )}

        {/* 투자 신청중 + 계좌 잔액 */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 0 }}>
          {config.showApplying && (
            <div style={{ backgroundColor: '#e8f0ff', borderRadius: 16, height: 56, padding: '0 20px 0 12px', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>투자 신청중</span>
              </div>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-500)', whiteSpace: 'nowrap', flexShrink: 0 }}>20,000원</span>
            </div>
          )}
          <div onClick={() => nav('asset')} style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{config.account}</span>
          </div>
        </div>

        {/* 자세히 보기 */}
        <div onClick={() => nav('asset')} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--color-neutral-050)', cursor: 'pointer' }}>
          <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>자세히 보기</span>
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 모집중인 상품 */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>모집중인 상품</span>
          <div onClick={() => nav('product_detail')} style={{ borderRadius: 16, overflow: 'hidden', padding: 8, background: 'linear-gradient(90deg, rgba(68,135,255,0.2), rgba(68,135,255,0.2)), linear-gradient(90deg, #fff, #fff)', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
            <div style={{ padding: '8px 8px 0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--color-neutral-000)', borderRadius: 40, padding: '5px 12px 5px 8px', alignSelf: 'flex-start' }}>
                <img src="/icons/icon.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)', whiteSpace: 'nowrap' }}>13일 23:59:59 남음</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <img src="/product.png" alt="상품" style={{ width: 186, height: 140, objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.64)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: 16, padding: '5px 12px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>9,999명 투자중</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 12, padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>유전지수 높은 상품</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>모집 현황</span>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)' }}>5 / 100C</span>
                </div>
                <div style={{ height: 6, backgroundColor: 'var(--color-neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '5%', height: '100%', backgroundColor: 'var(--color-primary-500)', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{ l: '1C 당 금액', v: '20,000원' }, { l: '예상 수익률', v: '10.0% ~ 15.0%' }, { l: '예상 정산 기간', v: '2025.11 ~ 2026.01' }].map(item => (
                  <div key={item.l} style={{ display: 'flex', gap: 6 }}>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.l}</span>
                    <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)' }}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 마감된 상품 */}
        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>마감된 상품</span>
          <div style={{ borderRadius: 16, overflow: 'hidden', padding: 8, backgroundColor: 'var(--color-neutral-050)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '8px 8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', filter: 'grayscale(100%)', opacity: 0.5 }}>
              <img src="/product.png" alt="상품" style={{ width: 186, height: 140, objectFit: 'cover' }} />
            </div>
            <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 12, padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>유전지수 높은 상품</span>
                <span style={{ ...T.label13('semibold'), color: 'var(--color-neutral-500)', backgroundColor: 'var(--color-neutral-050)', padding: '4px 10px', borderRadius: 8 }}>마감</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>모집 현황</span>
                  <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-800)' }}>100 / 100C</span>
                </div>
                <div style={{ height: 6, backgroundColor: 'var(--color-neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-neutral-400)', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TabBar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
          <TabBarItem icon="home" label="홈" selected />
          <TabBarItem icon="shopping" label="쇼핑" onClick={() => goTab('shopping')} />
          <TabBarItem icon="my" label="마이" onClick={() => goTab('my')} />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

// ============================================================
// Invest Product Detail Screen (투자 상품 상세 - placeholder)
// ============================================================
function InvestProductDetailScreen({ onBack, onApply }) {
  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <SubAppBar title="" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...T.headline28('semibold'), color: 'var(--color-neutral-900)', opacity: 0.2 }}>투자 상품 상세</span>
      </div>
      <CTAButton label="투자하기" onClick={onApply} />
    </div>
  )
}

// ============================================================
// Invest Product Detail After Screen (투자 상품 상세_신청 후)
// ============================================================
function InvestProductDetailAfterScreen({ onBack }) {
  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <SubAppBar title="A 투자 상품" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...T.headline28('semibold'), color: 'var(--color-neutral-900)', opacity: 0.2 }}>투자 상품 상세</span>
      </div>
      <div style={{ padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-neutral-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), color: 'var(--color-neutral-700)',
        }}>3주 투자중</div>
        <div style={{
          flex: 1, height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-primary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), color: '#fff', cursor: 'pointer',
        }}>추가 투자</div>
      </div>
    </div>
  )
}

// ============================================================
// SubAppBar
// ============================================================
function SubAppBar({ title, onBack }) {
  return (
    <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-neutral-000)' }}>
      <div style={{ width: 92, display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeftIcon />
        </div>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{title}</span>}
      </div>
      <div style={{ width: 92 }} />
    </div>
  )
}

// ============================================================
// CTA Button
// ============================================================
function CTAButton({ label, onClick, disabled = false }) {
  return (
    <div style={{ padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
      <div onClick={disabled ? undefined : onClick} style={{
        height: 56, borderRadius: 14,
        backgroundColor: disabled ? 'var(--color-neutral-200)' : 'var(--color-primary-500)',
        color: disabled ? 'var(--color-neutral-400)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...T.body17('semibold'), cursor: disabled ? 'default' : 'pointer',
      }}>{label}</div>
    </div>
  )
}

// ============================================================
// Quantity Input Screen (수량 입력)
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
    if (val === 'max') setQuantity(maxC)
    else setQuantity(Math.min(quantity + val, maxC))
  }

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <SubAppBar title="A 투자 상품" onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Bank info pill */}
        <div style={{ padding: '8px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 12px', borderRadius: 999,
            border: '1px solid var(--color-neutral-100)',
          }}>
            <img src="/icons/Finance/nhBank.svg" alt="" style={{ width: 24, height: 24 }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-800)' }}>NH농협은행 김한우</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-500)' }}>(5672)</span>
            <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
          </div>
        </div>

        {/* Price display */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -0.4, color: quantity > 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-300)', lineHeight: '48px' }}>
              {quantity > 0 ? quantity : '0'}
            </span>
            <span style={{ fontSize: 24, fontWeight: 600, color: quantity > 0 ? 'var(--color-neutral-900)' : 'var(--color-neutral-300)', lineHeight: '32px' }}>C</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 500, color: quantity > 0 ? 'var(--color-primary-500)' : 'var(--color-neutral-400)', lineHeight: '26px', marginTop: 4 }}>
            {quantity > 0 ? formattedPrice : '0원'}
          </span>
        </div>

        {/* Info rows */}
        <div style={{ padding: '0 24px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 38, paddingBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)' }}>구매가능금액</span>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-neutral-900)' }}>{maxAmount.toLocaleString()}원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 38, paddingBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)' }}>이용료</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ padding: '4px 8px', borderRadius: 20, backgroundColor: 'var(--color-primary-400)', fontSize: 10, fontWeight: 500, color: 'var(--color-neutral-050)' }}>수수료 뱅카우 지원</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-neutral-900)' }}>0원</span>
            </div>
          </div>
        </div>

        {/* Quick buttons */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 24px' }}>
          {[{ label: '1C', val: 1 }, { label: '10C', val: 10 }, { label: '100C', val: 100 }, { label: '최대', val: 'max' }].map(({ label, val }) => (
            <div key={label} onClick={() => handleQuick(val)} style={{
              flex: 1, height: 36, borderRadius: 8,
              backgroundColor: 'var(--color-neutral-050)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-800)',
              cursor: 'pointer',
            }}>{label}</div>
          ))}
        </div>

        {/* Number pad */}
        <div style={{ padding: '10px 24px' }}>
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9], ['', 0, 'del']].map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((key, ci) => (
                <div key={ci} onClick={() => {
                  if (key === 'del') handleDelete()
                  else if (key !== '') handleNumber(key)
                }} style={{
                  flex: 1, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: key !== '' ? 'pointer' : 'default',
                  fontSize: 24, fontWeight: 500, color: 'var(--color-neutral-600)',
                }}>
                  {key === 'del' ? <DeleteIcon /> : key}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom button */}
        <div style={{ padding: '10px 24px', paddingBottom: 'calc(50px + env(safe-area-inset-bottom, 0px))' }}>
          <div onClick={quantity > 0 ? onInvest : undefined} style={{
            height: 56, borderRadius: 10,
            backgroundColor: quantity > 0 ? 'var(--color-primary-500)' : 'var(--color-neutral-200)',
            color: quantity > 0 ? '#fff' : 'var(--color-neutral-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 600, cursor: quantity > 0 ? 'pointer' : 'default',
          }}>투자하기</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Apply Complete Screen (투자 신청 완료)
// ============================================================
function ApplyCompleteScreen({ onConfirm }) {
  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', marginTop: -60 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: 'var(--color-primary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)', marginBottom: 20 }}>투자 신청 완료</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-neutral-600)', textAlign: 'center', lineHeight: '24px' }}>
          투자 신청이 완료됐어요.<br />6월 12일에 체결 결과를 알려드릴게요.
        </div>
      </div>
      <CTAButton label="확인" onClick={onConfirm} />
    </div>
  )
}

// ============================================================
// Push Notification Screen (iOS Lock Screen)
// ============================================================
function PushNotificationScreen({ title, message, onTap }) {
  return (
    <div className="v7-screen" onClick={onTap} style={{
      width: '100%', height: '100dvh',
      backgroundColor: '#000', display: 'flex', flexDirection: 'column',
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10,100,240,0.15) 0%, rgba(10,100,240,0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <div style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: '#4487FF', marginBottom: 4 }}>6월 20일 (토)</div>
        <div style={{ fontSize: 80, fontWeight: 700, color: '#4487FF', lineHeight: 1, letterSpacing: -2 }}>15:47</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          borderRadius: 20, padding: '14px 16px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            backgroundColor: 'var(--color-primary-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <img src="/product.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ ...T.body15('semibold'), color: '#fff' }}>{title}</span>
              <span style={{ ...T.label13(), color: 'rgba(255,255,255,0.5)' }}>9:41 AM</span>
            </div>
            <div style={{ ...T.body15(), color: 'rgba(255,255,255,0.8)', lineHeight: '20px' }}>{message}</div>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
      }}>
        <div style={{ width: 130, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  )
}

// ============================================================
// Asset Screen (투자 상세)
// ============================================================
function AssetScreen({ onBack, nav, phase }) {
  const phaseConfig = {
    pre: { account: '100,000원', investAmount: '0원', showApplying: false, showItems: false },
    applying: { account: '40,000원', investAmount: '0원', showApplying: true, showItems: false },
    settled: { account: '40,000원', investAmount: '20,000원', showApplying: false, showItems: true },
    pre_settlement: { account: '40,000원', investAmount: '20,000원', showApplying: false, showItems: true },
    settlement_day: { account: '40,000원', investAmount: '20,000원', showApplying: false, showItems: true },
    post_settlement: { account: '102,000원', investAmount: '0원', showApplying: false, showItems: false },
  }
  const config = phaseConfig[phase] || phaseConfig.pre

  const menuItems = [
    { icon: '/icons/Graphic/calendar.svg', label: '투자내역', action: () => nav('history') },
    { icon: '/icons/Graphic/moneyBag.svg', label: '정산내역', action: () => nav('settlement_history') },
  ]

  const bottomMenuItems = [
    { icon: '/icons/Graphic/shield.svg', label: '자산 보호 내역' },
    { icon: '/icons/Graphic/paper.svg', label: '세금' },
    { icon: '/icons/Graphic/flatPaper.svg', label: '중도해지 취소내역' },
  ]

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>투자중 금액</span>
          <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)' }}>{config.investAmount}</span>
        </div>

        <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {config.showApplying && (
            <div style={{ backgroundColor: '#e8f0ff', borderRadius: 16, height: 56, padding: '0 20px 0 12px', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-400)' }}>투자 신청중</span>
              </div>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-500)' }}>60,000원</span>
            </div>
          )}
          <div onClick={() => nav('account')} style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{config.account}</span>
          </div>
        </div>

        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item, idx) => (
            <div key={idx} onClick={item.action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={item.icon} alt="" style={{ width: 28, height: 28 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
              </div>
              <ChevronRightIcon />
            </div>
          ))}
        </div>

        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {config.showItems ? (
          <>
            <div style={{ padding: '24px 16px 0' }}>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-600)' }}>내 투자 상품</span>
            </div>
            <div style={{ paddingBottom: 24 }}>
              {Array(3).fill(null).map((_, idx) => (
                <div key={idx} onClick={() => nav('my_invest_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src="/product.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>유전지수 높은 상품</span>
                      <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1년 8개월 남음</span>
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>20,000원</span>
                      <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1주</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: '24px 16px 0' }}>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-600)' }}>내 투자 상품</span>
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>투자 상품이 없어요</span>
            </div>
          </div>
        )}

        <div style={{ padding: '8px 0 50px', display: 'flex', flexDirection: 'column' }}>
          {bottomMenuItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={item.icon} alt="" style={{ width: 28, height: 28 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
              </div>
              <ChevronRightIcon />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Account Detail Screen (계좌 상세)
// ============================================================
function AccountDetailScreen({ onBack, phase }) {
  const [selectedTab, setSelectedTab] = useState('전체')
  const tabs = ['전체', '입금', '출금']

  const balanceMap = {
    pre: '100,000', applying: '40,000', settled: '40,000',
    pre_settlement: '40,000', settlement_day: '40,000', post_settlement: '102,000',
  }
  const balance = balanceMap[phase] || '100,000'

  const allTransactions = {
    pre: [
      { date: '5월 15일', name: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ],
    applying: [
      { date: '6월 1일', name: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-800)' },
      { date: '5월 15일', name: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ],
    settled: [
      { date: '6월 12일', name: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      { date: '6월 1일', name: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-800)' },
      { date: '5월 15일', name: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
    ],
  }
  const transactions = allTransactions[phase] || allTransactions[phase === 'pre_settlement' || phase === 'settlement_day' ? 'settled' : phase] || allTransactions.pre

  const filtered = selectedTab === '전체' ? transactions :
    transactions.filter(t => t.type === (selectedTab === '입금' ? '입금' : '출금'))

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="NH농협은행" onBack={onBack} />
        </div>

        {/* Blue gradient header */}
        <div style={{
          background: 'linear-gradient(180deg, #2d71ea 0%, #4487ff 100%)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/icons/Finance/nhBank.svg" alt="" style={{ width: 32, height: 32 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-050)' }}>2123456-78-9101112</span>
                </div>
                <div style={{ backgroundColor: '#1652b8', borderRadius: 20, padding: '2px 10px' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-050)' }}>복사</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, paddingLeft: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 600, color: '#fff', lineHeight: '40px' }}>{balance}</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#fff', lineHeight: '24px' }}>원</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: '#1652b8', borderRadius: 10, padding: '12px 16px', cursor: 'pointer' }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>충전 안내</span>
            </div>
            <div style={{ backgroundColor: '#1652b8', borderRadius: 10, padding: '12px 16px', cursor: 'pointer' }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>출금하기</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-neutral-100)', padding: '0 24px' }}>
          {tabs.map(tab => (
            <div key={tab} onClick={() => setSelectedTab(tab)} style={{
              height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 12px', cursor: 'pointer',
              borderBottom: selectedTab === tab ? '2px solid var(--color-neutral-900)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: selectedTab === tab ? 'var(--color-neutral-900)' : 'var(--color-neutral-500)' }}>{tab}</span>
            </div>
          ))}
        </div>

        {/* Transaction list */}
        <div style={{ paddingBottom: 50 }}>
          <div style={{ padding: '20px 24px' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)' }}>총 {filtered.length} 건</span>
          </div>
          <div style={{ padding: '0 24px' }}>
            {filtered.map((t, idx) => (
              <div key={idx} style={{ borderTop: '0.5px solid var(--color-neutral-100)', padding: '10px 0' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)', lineHeight: '20px' }}>{t.date}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 18, paddingBottom: 16 }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-neutral-900)', lineHeight: '24px' }}>{t.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-500)', lineHeight: '18px' }}>{t.time} | {t.type}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 500, color: t.color, lineHeight: '24px' }}>{t.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest History Screen (투자내역 - Phase Aware)
// ============================================================
function InvestHistoryScreen({ onBack, nav, phase }) {
  if (phase === 'pre') {
    return (
      <div className="v7-screen" style={{
        width: '100%', height: '100dvh',
        backgroundColor: 'var(--color-neutral-000)', position: 'relative',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <SubAppBar title="" onBack={onBack} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <img src="/product.png" alt="" style={{ width: 80, height: 60, objectFit: 'cover' }} />
          </div>
          <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>투자내역이 없어요</span>
        </div>
      </div>
    )
  }

  const historyByPhase = {
    applying: [
      { date: '26년 6월 1일', items: [{ name: '유전지수 높은 상품', desc: '3주 신청 완료', clickable: true }] },
    ],
    settled: [
      { date: '26년 6월 12일', items: [{ name: '유전지수 높은 상품', desc: '1주 체결 완료', clickable: true }] },
      { date: '26년 6월 1일', items: [{ name: '유전지수 높은 상품', desc: '3주 신청 완료', clickable: true }] },
    ],
    post_settlement: [
      { date: '28년 12월 1일', items: [{ name: '유전지수 높은 상품', desc: '1주 정산 완료', clickable: true }] },
      { date: '26년 6월 12일', items: [{ name: '유전지수 높은 상품', desc: '1주 체결 완료', clickable: true }] },
      { date: '26년 6월 1일', items: [{ name: '유전지수 높은 상품', desc: '3주 신청 완료', clickable: true }] },
    ],
  }

  const data = historyByPhase[phase] || historyByPhase.settled || []

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        <div style={{ padding: '12px 16px 0' }}>
          <span style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>투자내역</span>
        </div>

        <div style={{ paddingBottom: 50 }}>
          {data.map((group, gIdx) => (
            <div key={gIdx} style={{ padding: '16px 0' }}>
              <div style={{ padding: '0 16px', height: 21 }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{group.date}</span>
              </div>
              {group.items.map((item, iIdx) => (
                <div key={iIdx} onClick={item.clickable ? () => nav('history_detail') : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', cursor: item.clickable ? 'pointer' : 'default' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 16,
                    backgroundColor: '#dae7ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.name}</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest History Detail Screen (투자내역 상세 - 체결)
// ============================================================
function InvestHistoryDetailScreen({ onBack }) {
  const timelineSteps = [
    { label: '신청', sub: '취소 가능', date: '26.06.01', done: true },
    { label: '체결', sub: '취소 불가능', date: '26.06.12', done: true },
  ]

  const detailSections = [
    {
      title: '체결 내역',
      rows: [
        { label: '체결 시간', value: '2026.06.01 22:21' },
        { label: '체결 금액', value: '20,000원' },
        { label: '체결 수량', value: '1주' },
        { label: '환불 금액', value: '40,000원' },
      ],
    },
    {
      title: '신청 내역',
      rows: [
        { label: '신청 시간', value: '2026.06.01 22:21' },
        { label: '신청 금액', value: '60,000원' },
        { label: '신청 수량', value: '3주' },
        { label: '체결 예정일', value: '26.06.12' },
      ],
    },
  ]

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        <div style={{ padding: '12px 16px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/product.png" alt="" style={{ width: 36, height: 27, objectFit: 'cover' }} />
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-700)' }}>유전지수 높은 상품</span>
          </div>
          <span style={{ ...T.headline28(), color: 'var(--color-neutral-900)' }}>체결 완료</span>
        </div>

        <div style={{ padding: '0 16px 28px' }}>
          {timelineSteps.map((step, idx) => (
            <div key={idx}>
              {idx > 0 && (
                <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 3, height: 32, backgroundColor: 'var(--color-primary-500)', borderRadius: 1.5 }} />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: step.done ? 'var(--color-primary-500)' : 'var(--color-neutral-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10l3.5 3.5L15 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>{step.label}</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>{step.sub}</span>
                  </div>
                </div>
                <span style={{ ...T.body17(), color: 'var(--color-neutral-800)', flexShrink: 0 }}>{step.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-700)' }}>상품 정보</span>
          </div>
        </div>

        {detailSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
            <div style={{ padding: '24px 16px 0' }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>{section.title}</span>
            </div>
            <div style={{ paddingTop: 12, paddingBottom: sIdx === detailSections.length - 1 ? 50 : 20 }}>
              {section.rows.map((row, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 12 }}>
                  <span style={{ ...T.body17(), color: 'var(--color-neutral-700)' }}>{row.label}</span>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Settlement History Screen (정산내역)
// ============================================================
function SettlementHistoryScreen({ onBack }) {
  const [selectedTab, setSelectedTab] = useState('전체')
  const tabs = ['전체', '년']

  const settlementData = [
    { date: '28년 12월 1일', name: '유전지수 높은 상품', shares: '1주 정산', amount: '22,000원', diff: '2,000', rate: '20.00%', type: 'profit' },
    { date: '28년 12월 1일', name: '유전지수 높은 상품', shares: '1주 정산', amount: '22,000원', diff: '1,000', rate: '4.00%', type: 'loss' },
    { date: '28년 12월 1일', name: '유전지수 높은 상품', shares: '1주 정산', amount: '22,000원', diff: '2,000', rate: '20.00%', type: 'profit' },
    { date: '28년 12월 1일', name: '유전지수 높은 상품', shares: '1주 정산', amount: '22,000원', diff: '2,000', rate: '20.00%', type: 'profit' },
  ]

  const ArrowUp = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4.5L12 9.5H4L8 4.5Z" fill="#f76868" /></svg>
  const ArrowDown = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11.5L4 6.5H12L8 11.5Z" fill="#4487ff" /></svg>

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, padding: 4, width: 200 }}>
            {tabs.map(tab => (
              <div key={tab} onClick={() => setSelectedTab(tab)} style={{
                flex: 1, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 12, backgroundColor: selectedTab === tab ? '#fff' : 'transparent', cursor: 'pointer',
              }}>
                <span style={{ ...T.body17('semibold'), color: selectedTab === tab ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)' }}>{tab}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '32px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>24.01 ~ 26.06 실현손익</span>
          <span style={{ ...T.headline32(), color: '#f76868' }}>+2,000원</span>
        </div>

        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
          {[{ l: '총 투자금', v: '20,000원' }, { l: '수익 합계', v: '+2,000원', c: '#f76868' }, { l: '수익률', v: '+20.00%', c: '#f76868' }].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, height: 57 }}>
              <span style={{ ...T.body17(), color: 'var(--color-neutral-700)' }}>{row.l}</span>
              <span style={{ ...T.body17('semibold'), color: row.c || 'var(--color-neutral-800)' }}>{row.v}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>정산 상품</span>
        </div>

        <div style={{ paddingBottom: 50 }}>
          {settlementData.map((item, idx) => (
            <div key={idx} style={{ padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0 16px', height: 21 }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.name}</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.shares}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                  <span style={{ ...T.body17('bold'), color: 'var(--color-neutral-800)' }}>{item.amount}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {item.type === 'profit' ? <ArrowUp /> : <ArrowDown />}
                      <span style={{ ...T.body15('semibold'), color: item.type === 'profit' ? '#f76868' : '#4487ff' }}>{item.diff}</span>
                    </div>
                    <div style={{ width: 1, height: 10, backgroundColor: 'var(--color-neutral-300)' }} />
                    <span style={{ ...T.body15('semibold'), color: item.type === 'profit' ? '#f76868' : '#4487ff' }}>{item.rate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// My Invest Detail Screen (내투자상세)
// ============================================================
function MyInvestDetailScreen({ onBack, nav }) {
  const [activeTab, setActiveTab] = useState('송아지 정보')
  const [settlementState, setSettlementState] = useState('체결')
  const [calfFilter, setCalfFilter] = useState('전체')
  const tabs = ['송아지 정보', '내 투자']
  const calfFilters = ['전체', '사육중', '출하중', '경매 완료']

  const calfData = [
    { name: '뱅카우목장 2호', status: '사육중', remaining: '3개월 후 출하 예정' },
    { name: '뱅카우목장 5호', status: '사육중', remaining: '5개월 후 출하 예정' },
    { name: '뱅카우목장 8호', status: '사육중', remaining: '2개월 후 출하 예정' },
    { name: '뱅카우목장 12호', status: '출하중', remaining: '경매 대기중' },
    { name: '뱅카우목장 3호', status: '경매 완료', remaining: '정산 완료' },
    { name: '뱅카우목장 7호', status: '사육중', remaining: '6개월 후 출하 예정' },
  ]
  const filteredCalves = calfFilter === '전체' ? calfData : calfData.filter(c => c.status === calfFilter)

  const investHistoryItems = settlementState === '정산' ? [
    { date: '28년 12월 1일', items: [{ name: '유전지수 높은 상품', desc: '1주 정산 완료' }] },
    { date: '26년 6월 12일', items: [{ name: '유전지수 높은 상품', desc: '1주 체결 완료' }] },
  ] : [
    { date: '26년 6월 12일', items: [{ name: '유전지수 높은 상품', desc: '1주 체결 완료' }] },
  ]

  const bottomMenuItems = [
    { icon: '/icons/Graphic/paper.svg', label: '공시', type: 'download' },
    { icon: '/icons/Graphic/paper.svg', label: '투자자 명부', type: 'download' },
    { icon: '/icons/Graphic/shield.svg', label: '자산 보호 처리 방침', type: 'link' },
    { icon: '/icons/Graphic/farm.svg', label: '상품 정보', type: 'link' },
  ]

  const downloadIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )

  const timelineSteps = settlementState === '정산' ? [
    { label: '신청', sub: '취소 가능', date: '26.06.01', done: true },
    { label: '체결', sub: '취소 불가능', date: '26.06.12', done: true },
    { label: '정산', sub: '', date: '28.12.01', done: true },
  ] : [
    { label: '신청', sub: '취소 가능', date: '26.06.01', done: true },
    { label: '체결', sub: '취소 불가능', date: '26.06.12', done: true },
    { label: '정산', sub: '예상 정산 기간', date: '', done: false, expected: '2025.11 ~ 2026.01' },
  ]

  return (
    <div className="v7-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Blue gradient header */}
        <div style={{ background: 'linear-gradient(180deg, rgba(68,135,255,0.2) 0%, rgba(68,135,255,0) 100%)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <SubAppBar title="" onBack={onBack} />
          <div style={{ padding: '0 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
              <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.96, color: 'var(--color-neutral-900)', lineHeight: '40px' }}>유전지수 높은 상품</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>보유 수량</span>
                  <span style={{ marginLeft: 8, fontSize: 20, fontWeight: 600, color: 'var(--color-neutral-800)' }}>1</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)' }}>/ 100주</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>내 투자금</span>
                  <span style={{ marginLeft: 8, fontSize: 24, fontWeight: 600, color: 'var(--color-neutral-800)' }}>20,000</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)' }}>원</span>
                </div>
              </div>
            </div>
            <div style={{ width: 160, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/product.png" alt="" style={{ width: 160, height: 120, objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-neutral-100)' }}>
          {tabs.map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--color-neutral-800)' : '2px solid transparent',
            }}>
              <span style={{ ...(activeTab === tab ? T.body17('bold') : T.body17('semibold')), color: activeTab === tab ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)' }}>{tab}</span>
            </div>
          ))}
        </div>

        {activeTab === '송아지 정보' ? (
          <div>
            <div style={{ padding: '24px 16px 0', display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 송아지</span>
              <span style={{ ...T.title20('bold'), color: 'var(--color-primary-500)' }}>10</span>
            </div>
            <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8 }}>
              {calfFilters.map(filter => (
                <div key={filter} onClick={() => setCalfFilter(filter)} style={{
                  padding: '6px 14px', borderRadius: 20,
                  backgroundColor: calfFilter === filter ? 'var(--color-neutral-800)' : 'var(--color-neutral-050)', cursor: 'pointer',
                }}>
                  <span style={{ ...T.body15('semibold'), color: calfFilter === filter ? '#fff' : 'var(--color-neutral-600)' }}>{filter}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 16px 0' }}>
              <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>총 {filteredCalves.length} 마리</span>
            </div>
            <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredCalves.map((calf, idx) => (
                <div key={idx} style={{ border: '1px solid var(--color-neutral-100)', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      <img src="/product.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{calf.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'var(--color-neutral-400)' }} />
                        <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{calf.remaining}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px 16px 0' }}>
              <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['소의 성장 현황은 매주 월요일에 업데이트됩니다.', '출하 및 경매 일정은 시장 상황에 따라 변동될 수 있습니다.'].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-500)', flexShrink: 0 }}>•</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <BottomMenu items={bottomMenuItems} downloadIcon={downloadIcon} />
          </div>
        ) : (
          <div>
            {/* State toggle */}
            <div style={{ padding: '12px 16px 0', display: 'flex', gap: 8 }}>
              {['체결', '정산'].map(s => (
                <div key={s} onClick={() => setSettlementState(s)} style={{
                  padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                  backgroundColor: settlementState === s ? 'var(--color-primary-500)' : 'var(--color-neutral-050)',
                }}>
                  <span style={{ ...T.body15('semibold'), color: settlementState === s ? '#fff' : 'var(--color-neutral-600)' }}>{s} 상태</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ padding: '24px 16px 28px' }}>
              {timelineSteps.map((step, idx) => (
                <div key={idx}>
                  {idx > 0 && (
                    <div style={{ height: 44, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 3, height: 24, backgroundColor: step.done ? 'var(--color-primary-500)' : 'var(--color-neutral-100)', borderRadius: 99 }} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 18,
                        backgroundColor: step.done ? 'var(--color-primary-500)' : 'var(--color-neutral-200)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {step.done ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10l3.5 3.5L15 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-neutral-500)' }}>{idx + 1}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>{step.label}</span>
                        {step.sub && !step.expected && <span style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>{step.sub}</span>}
                        {step.expected && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>{step.sub}</span>
                            <img src="/icons/Graphic/help2.svg" alt="" style={{ width: 16, height: 16 }} />
                          </div>
                        )}
                      </div>
                    </div>
                    {step.date ? <span style={{ ...T.body17(), color: 'var(--color-neutral-800)', flexShrink: 0 }}>{step.date}</span>
                      : step.expected ? <span style={{ ...T.body15(), color: 'var(--color-neutral-500)', flexShrink: 0 }}>{step.expected}</span> : null}
                  </div>
                </div>
              ))}
            </div>

            {settlementState === '체결' ? (
              <>
                <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
                <div style={{ padding: '24px 16px 0' }}>
                  <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 투자금</span>
                </div>
                <div style={{ padding: '12px 0 20px' }}>
                  {[{ l: '투자금', v: '20,000원' }, { l: '보유 수량', v: '1주' }].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                      <span style={{ ...T.body17(), color: 'var(--color-neutral-700)' }}>{r.l}</span>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
                <div style={{ padding: '24px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 정산 내역</span>
                  <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 8, padding: '4px 8px' }}>
                    <span style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>어떻게 계산되나요?</span>
                  </div>
                </div>
                <div style={{ padding: '12px 0 0' }}>
                  {[
                    { l: '투자금', v: '20,000원' }, { l: '보유 수량', v: '1주' }, { l: '세금', v: '-0원' },
                    { l: '세후 수익금', v: '+2,000원', c: '#f76868' }, { l: '세후 수익률', v: '+20.00%', c: '#f76868' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                      <span style={{ ...T.body17(), color: 'var(--color-neutral-700)' }}>{r.l}</span>
                      <span style={{ ...T.body17('semibold'), color: r.c || 'var(--color-neutral-800)' }}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{ margin: '0 16px', height: 1, backgroundColor: 'var(--color-neutral-100)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>정산금</span>
                    <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>22,000원</span>
                  </div>
                </div>
                <div style={{ padding: '0 16px 24px' }}>
                  <div onClick={() => nav('history_detail')} style={{
                    backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, minHeight: 56,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-700)' }}>자세히 보기</span>
                  </div>
                </div>
              </>
            )}

            <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
            <div style={{ padding: '24px 16px 0' }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>투자 내역</span>
            </div>
            <div>
              {investHistoryItems.map((group, gIdx) => (
                <div key={gIdx} style={{ padding: '16px 0' }}>
                  <div style={{ padding: '0 16px', height: 21 }}>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{group.date}</span>
                  </div>
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.name}</span>
                        <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <BottomMenu items={bottomMenuItems} downloadIcon={downloadIcon} />
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Bottom Menu (shared)
// ============================================================
function BottomMenu({ items, downloadIcon }) {
  return (
    <div style={{ paddingBottom: 50 }}>
      <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
      <div style={{ padding: '8px 0' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={item.icon} alt="" style={{ width: 28, height: 28 }} />
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
            </div>
            {item.type === 'download' ? downloadIcon : <ChevronRightIcon />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Shopping Screen
// ============================================================
function ShoppingScreen({ goTab }) {
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1, name: '[1++등급] 등심 로스구이 150g',
    price: '20,000원', unit: '100g당 1,000원', farm: '뱅카우목장 1호',
  }))

  const ShopProductCard = ({ product }) => (
    <div style={{ width: 150, flexShrink: 0 }}>
      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--color-neutral-100)' }}>
        <img src="/shopping.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: 'var(--color-neutral-900)', marginTop: 2 }}>{product.price}</div>
        <div style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>{product.unit}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'var(--color-primary-600)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.farm}</span>
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
          <ChevronRightIcon size={10} color="var(--color-neutral-700)" />
        </div>
      </div>
      <div className="v7-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {products.slice(0, 3).map(p => <ShopProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )

  return (
    <div className="v7-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>쇼핑</div>
            <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellIcon />
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {['주문내역', '내 포인트', '내 쿠폰'].map((text, i) => [
              i > 0 && <div key={`d${i}`} style={{ width: 1, height: 25, backgroundColor: 'var(--color-neutral-200)' }} />,
              <div key={text} style={{ flex: 1, textAlign: 'center', ...T.body17(), color: 'var(--color-neutral-800)', cursor: 'pointer' }}>{text}</div>,
            ])}
          </div>
        </div>
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />
        <ProductSection title="전체 상품" />
        <div style={{ height: 0, borderTop: '1px solid var(--color-neutral-050)' }} />
        <ProductSection title="추천 상품" />
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
          <TabBarItem icon="home" label="홈" onClick={() => goTab('home')} />
          <TabBarItem icon="shopping" label="쇼핑" selected />
          <TabBarItem icon="my" label="마이" onClick={() => goTab('my')} />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

// ============================================================
// MyPage Screen
// ============================================================
function MyPageScreen({ nav, goTab }) {
  const menuItem = (icon, label, target) => (
    <div key={label} style={{ height: 44, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 10, cursor: target ? 'pointer' : 'default' }}
      onClick={target ? () => nav(target) : undefined}>
      <img src={icon} alt="" style={{ width: 24, height: 24 }} />
      <span style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: 'var(--color-neutral-800)' }}>{label}</span>
    </div>
  )

  const cardStyle = {
    backgroundColor: 'var(--color-neutral-000)', borderRadius: 16,
    boxShadow: '0px 0px 2px rgba(19,21,26,0.06), 0px 0px 7px rgba(19,21,26,0.04)',
  }

  return (
    <div className="v7-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-050)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v7-scroll" style={{ height: '100dvh', overflowY: 'auto', paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)', backgroundColor: 'var(--color-neutral-050)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-050)' }}>
          <div style={{ height: 60, padding: '0 6px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>마이페이지</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SettingsIcon /></div>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BellIcon /></div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>김한우님, 반가워요!</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)', marginTop: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              내 정보 <ChevronRightIcon size={20} color="var(--color-neutral-600)" />
            </div>
          </div>
          <div style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', flexShrink: 0 }}>
            <img src="/Cow.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div style={{ backgroundColor: 'var(--color-neutral-000)', border: '1px solid var(--color-neutral-100)', borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/Visitor.png" alt="" style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-800)' }}>견학생</div>
              <div style={{ fontSize: 14, lineHeight: '20px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontWeight: 500, color: 'var(--color-neutral-600)' }}>투자중</span>
                <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>0C</span>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-neutral-000)', border: '1px solid var(--color-neutral-100)', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-800)', flexShrink: 0, cursor: 'pointer' }}>혜택 보기</div>
          </div>
        </div>

        <div style={{ padding: '0 16px', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>뱅킹</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/account.svg', '내 계좌', 'asset')}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>투자</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/icon.svg', '내 투자', 'asset')}
              {menuItem('/icons/farm.svg', '투자 내역', 'history')}
              {menuItem('/icons/amount-bag.svg', '정산 내역', 'settlement_history')}
              {menuItem('/icons/shield.svg', '자산 보호 내역')}
              {menuItem('/icons/money-bag.svg', '세금')}
              {menuItem('/icons/flat-paper.svg', '중도해지 신청 내역')}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>쇼핑</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/meet.svg', '주문내역')}
              {menuItem('/icons/point-bag.svg', '내 포인트')}
              {menuItem('/icons/coupon.svg', '내 쿠폰')}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>고객지원</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/help.svg', '1:1 문의')}
              {menuItem('/icons/review.svg', '고객센터')}
              {menuItem('/icons/loud-speaker.svg', '공지사항')}
              {menuItem('/icons/paper.svg', '이용약관')}
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
          <TabBarItem icon="home" label="홈" onClick={() => goTab('home')} />
          <TabBarItem icon="shopping" label="쇼핑" onClick={() => goTab('shopping')} />
          <TabBarItem icon="my" label="마이" selected />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

// ============================================================
// TabBar Item
// ============================================================
function TabBarItem({ icon, label, selected = false, onClick }) {
  const color = selected ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)'
  const iconMap = {
    home: '/icons/TabBarItem/TabBarIcon/Home.svg',
    shopping: '/icons/TabBarItem/TabBarIcon/Shopping.svg',
    my: '/icons/TabBarItem/TabBarIcon/My.svg',
  }
  return (
    <div onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 43, padding: '2px 4px 0', cursor: 'pointer' }}>
      <img src={iconMap[icon]} alt={label} style={{ width: 24, height: 24 }} />
      <span style={{ ...T.label11(), color, textAlign: 'center' }}>{label}</span>
    </div>
  )
}
