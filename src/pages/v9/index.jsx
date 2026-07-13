import { useState, useCallback } from 'react'

const globalStyleId = 'v9-global-styles'
if (typeof document !== 'undefined' && !document.getElementById(globalStyleId)) {
  const style = document.createElement('style')
  style.id = globalStyleId
  style.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #root { margin: 0; min-height: 100%; overscroll-behavior: none; overflow-x: hidden; width: 100%; }
    .v9-screen { user-select: none; -webkit-user-select: none; }
    .v9-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior: none; }
    .v9-scroll::-webkit-scrollbar { display: none; }
    .v9-hide-scrollbar::-webkit-scrollbar { display: none; }
    @keyframes v9-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes v9-slide-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
    @keyframes v9-message-slide-down { from { max-height: 0; opacity: 0; margin-top: 0; } to { max-height: 120px; opacity: 1; margin-top: 0; } }
    .v9-message-enter { animation: v9-message-slide-down 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards; overflow: hidden; }
  `
  document.head.appendChild(style)
}

const T = {
  headline32: (w = 'bold') => ({ fontSize: `var(--font-headline32-${w}-size)`, lineHeight: `var(--font-headline32-${w}-line-height)`, fontWeight: `var(--font-headline32-${w}-weight)` }),
  headline24: (w = 'bold') => ({ fontSize: `var(--font-headline24-${w}-size)`, lineHeight: `var(--font-headline24-${w}-line-height)`, fontWeight: `var(--font-headline24-${w}-weight)` }),
  title20: (w = 'bold') => ({ fontSize: `var(--font-title20-${w}-size)`, lineHeight: `var(--font-title20-${w}-line-height)`, fontWeight: `var(--font-title20-${w}-weight)` }),
  body17: (w = 'medium') => ({ fontSize: `var(--font-body17-${w}-size)`, lineHeight: `var(--font-body17-${w}-line-height)`, fontWeight: `var(--font-body17-${w}-weight)` }),
  body15: (w = 'medium') => ({ fontSize: `var(--font-body15-${w}-size)`, lineHeight: `var(--font-body15-${w}-line-height)`, fontWeight: `var(--font-body15-${w}-weight)` }),
  label13: (w = 'medium') => ({ fontSize: `var(--font-label13-${w}-size)`, lineHeight: `var(--font-label13-${w}-line-height)`, fontWeight: `var(--font-label13-${w}-weight)` }),
  label11: (w = 'medium') => ({ fontSize: `var(--font-label11-${w}-size)`, lineHeight: `var(--font-label11-${w}-line-height)`, fontWeight: `var(--font-label11-${w}-weight)` }),
}

const ChevronLeftIcon = ({ size = 24, color = 'var(--color-neutral-800)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
)
const ChevronRightIcon = ({ size = 20, color = 'var(--color-neutral-400)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
)
const DeleteIcon = ({ size = 24, color = 'var(--color-neutral-700)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
)

// ============================================================
// Shared UI
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
// Main Router
// ============================================================
export default function V9App() {
  const [phase, setPhase] = useState('pre')
  // phases: pre -> applying -> settled -> pre_settlement -> settlement_complete
  const [screen, setScreen] = useState('home')
  const [history, setHistory] = useState([])
  const [messageDismissed, setMessageDismissed] = useState(false)

  const nav = useCallback((target) => {
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
  const handleJumpToSettlementComplete = () => { setScreen('push_settlement_complete'); setHistory([]) }
  const handlePushSettlementCompleteTap = () => { setPhase('settlement_complete'); setScreen('home'); setHistory([]); setMessageDismissed(false) }

  const dismissMessage = useCallback(() => setMessageDismissed(true), [])

  const phaseTransitions = {
    applying: { label: '체결 당일로 이동', onClick: handleJumpToSettled },
    settled: { label: '정산 예정일로 이동', onClick: handleJumpToPreSettlement },
    pre_settlement: { label: '정산 완료로 이동', onClick: handleJumpToSettlementComplete },
  }

  const phaseTransition = phaseTransitions[phase] || null

  switch (screen) {
    case 'home':
      return <HomeScreen phase={phase} nav={nav} goTab={goTab} phaseTransition={phaseTransition} messageDismissed={messageDismissed} onDismissMessage={dismissMessage} />
    case 'asset_detail':
      return <AssetDetailScreen phase={phase} onBack={goBack} nav={nav} phaseTransition={phaseTransition} />
    case 'investment_history':
      return <InvestmentHistoryScreen phase={phase} onBack={goBack} nav={nav} />
    case 'my_account':
      return <MyAccountScreen onBack={goBack} phase={phase} nav={nav} />
    case 'account_detail':
      return <AccountDetailScreen onBack={goBack} phase={phase} />
    case 'product_detail':
      return <InvestProductDetailScreen onBack={goBack} onApply={handleGoToQuantity} />
    case 'product_detail_after':
      return <InvestProductDetailAfterScreen onBack={goBack} />
    case 'product_detail_settled':
      return <InvestProductDetailSettledScreen onBack={goBack} phase={phase} nav={nav} />
    case 'product_detail_pre_settlement':
      return <InvestProductDetailSettledScreen onBack={goBack} phase={phase} nav={nav} />
    case 'product_detail_settlement_complete':
      return <InvestProductDetailSettledScreen onBack={goBack} phase={phase} nav={nav} />
    case 'settlement_complete_detail':
      return <InvestSettlementCompleteDetailScreen onBack={goBack} nav={nav} />
    case 'settlement_history':
      return <SettlementHistoryScreen onBack={goBack} />
    case 'invest_apply_detail':
      return <InvestApplyDetailScreen onBack={goBack} nav={nav} />
    case 'invest_settled_detail':
      return <InvestSettledDetailScreen onBack={goBack} nav={nav} />
    case 'quantity_input':
      return <QuantityInputScreen onBack={goBack} onInvest={handleApply} />
    case 'apply_complete':
      return <ApplyCompleteScreen onConfirm={handleApplyConfirm} onGoHistory={() => { setPhase('applying'); setScreen('invest_apply_detail'); setHistory(['home']); setMessageDismissed(false) }} />
    case 'shopping':
      return <ShoppingScreen goTab={goTab} />
    case 'my':
      return <MyPageScreen nav={nav} goTab={goTab} phase={phase} />
    case 'push_settled':
      return <PushNotificationScreen title="투자 체결" message="'유전지수 높은 상품'에 1주 투자 체결됐어요." onTap={handlePushSettledTap} />
    case 'push_pre_settlement':
      return <PushNotificationScreen title="투자 정산" message="'유전지수 높은 상품'이(가) 12월 28일에 정산 예정입니다." onTap={handlePushPreSettlementTap} />
    case 'push_settlement_complete':
      return <PushNotificationScreen title="투자 정산" message="'유전지수 높은 상품' 정산이 완료되었습니다." onTap={handlePushSettlementCompleteTap} />
    default:
      return <HomeScreen phase={phase} nav={nav} goTab={goTab} phaseTransition={phaseTransition} messageDismissed={messageDismissed} onDismissMessage={dismissMessage} />
  }
}

// ============================================================
// Home Screen
// ============================================================
function HomeScreen({ phase, nav, goTab, phaseTransition, messageDismissed, onDismissMessage }) {
  const [bannerIndex] = useState(0)
  const bannerCount = 5

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{
        height: '100dvh', overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))',
      }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/logo.svg" alt="bankcow" style={{ height: 24, width: 120 }} />
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <img src="/icons/appbar/notification.svg" alt="알림" style={{ width: 24, height: 24 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Message */}
        {(phase === 'settled' || phase === 'pre_settlement' || phase === 'settlement_complete') && !messageDismissed && (() => {
          const messages = {
            settled: { text: '3주 체결 완료됐어요', target: 'invest_settled_detail' },
            pre_settlement: { text: '3월 21일 정산 예정이에요', target: 'product_detail_pre_settlement' },
            settlement_complete: { text: '정산이 완료되었어요!', target: 'settlement_complete_detail' },
          }
          const msg = messages[phase]
          if (!msg) return null
          return (
            <div className="v9-message-enter" style={{ padding: '16px 16px 0' }}>
              <div onClick={() => { onDismissMessage(); if (msg.target) nav(msg.target) }} style={{
                backgroundColor: 'var(--color-neutral-050)', borderRadius: 16,
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                padding: '20px 9px 20px 20px', cursor: msg.target ? 'pointer' : 'default',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <img src="/images/product-a.png" alt="" style={{ width: 48, height: 48, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>유전지수 높은 상품</span>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{msg.text}</span>
                  </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); onDismissMessage() }} style={{
                  width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 999,
                    backgroundColor: 'var(--color-neutral-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="var(--color-neutral-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Banner */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ width: '100%', height: 120, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <img src="/images/banner.png" alt="배너" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 100, padding: '0 8px', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 12, fontWeight: 500 }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '18px' }}>{bannerIndex + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>/</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>{bannerCount}</span>
            </div>
          </div>
        </div>

        {/* 모집 중인 상품 */}
        <div>
          <div style={{ padding: '24px 16px 0' }}>
            <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>모집 중인 상품</span>
          </div>
          <div style={{ padding: '16px 16px 24px' }}>
            <div onClick={() => nav('product_detail')} style={{
              borderRadius: 20, padding: 10, overflow: 'hidden',
              background: 'linear-gradient(90deg, rgba(68,135,255,0.2), rgba(68,135,255,0.2)), linear-gradient(90deg, #fff, #fff)',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--color-neutral-000)', borderRadius: 40, padding: '5px 12px 5px 8px' }}>
                    <img src="/icons/time.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>13일 23:59:59 남음</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  <img src="/images/product-a.png" alt="" style={{ width: 159, height: 120, objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,1)', borderRadius: 16, padding: '5px 12px 5px 8px' }}>
                    <img src="/icons/person.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>600명 투자중</span>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 16, padding: '16px 24px', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>유전지수 높은 상품</span>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-700)', backgroundColor: 'var(--color-neutral-050)', borderRadius: 6, padding: '0 8px', display: 'inline-flex', alignItems: 'center', height: 20 }}>10마리 투자상품</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>1주당 금액</div>
                    <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>20,000원~</div>
                  </div>
                  <div style={{ width: 1, height: 28, backgroundColor: 'var(--color-neutral-200)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>마감 일자</div>
                    <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>2023.12.31</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: 6, backgroundColor: 'var(--color-neutral-200)', borderRadius: 100, overflow: 'hidden' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>
                      <span style={{ color: 'var(--color-neutral-700)' }}>8,475 </span>/ 25,278주
                    </span>
                    <span style={{ ...T.label13(), color: 'var(--color-neutral-700)', backgroundColor: 'var(--color-neutral-050)', borderRadius: 8, padding: '0 8px', height: 24, display: 'inline-flex', alignItems: 'center' }}>모집중</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 투자 중인 금액 */}
        <div>
          <div style={{ padding: '24px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>투자 중인 금액</div>
              <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>{(phase === 'settled' || phase === 'pre_settlement') ? '220,000원' : '200,000원'}</div>
            </div>
            <div onClick={() => nav('asset_detail')} style={{
              backgroundColor: 'var(--color-neutral-050)', borderRadius: 12,
              padding: '2px 20px', minHeight: 40, minWidth: 64,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-700)' }}>더보기</span>
            </div>
          </div>

          <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* 신청 중인 투자 (applying phase only) */}
            {phase === 'applying' && (
              <div onClick={() => nav('invest_apply_detail')} style={{ backgroundColor: '#e8f0ff', borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <img src="/images/product-a.png" alt="" style={{ width: 43, height: 32, objectFit: 'cover', flexShrink: 0 }} />
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>신청 중인 투자</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-500)', whiteSpace: 'nowrap' }}>60,000원</span>
                  <ChevronRightIcon size={20} color="var(--color-primary-500)" />
                </div>
              </div>
            )}

            {/* 계좌 잔액 */}
            <div onClick={() => nav('my_account')} style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '14px 12px 14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{phase === 'applying' ? '40,000원' : phase === 'settlement_complete' ? '102,000원' : (phase === 'settled' || phase === 'pre_settlement') ? '80,000원' : '100,000원'}</span>
                <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
              </div>
            </div>
          </div>

          {/* 투자 중인 상품 */}
          <div style={{ padding: '24px 16px 0' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>투자 중인 상품 {(phase === 'settled' || phase === 'pre_settlement') ? '3' : '2'}</span>
          </div>

          <div style={{ padding: '8px 0' }}>
            {/* 체결 이후 유전지수 높은 상품 추가 */}
            {(phase === 'settled' || phase === 'pre_settlement') && (
              <ProductListItem onClick={() => nav(phase === 'pre_settlement' ? 'product_detail_pre_settlement' : 'product_detail_settled')} name="유전지수 높은 상품" remaining={phase === 'pre_settlement' ? '14일 남음' : '1년 2개월 남음'} amount="20,000원" shares="1주" img="/images/product-a.png" bgColor="#dae7ff" />
            )}
            <ProductListItem name="한약재 먹으며 건강히 키우는 상품" remaining="1년 5개월 남음" amount="100,000원" shares="5주" img="/images/product-herbal.png" bgColor="#fcdede" />
            <ProductListItem name="5성급 축사에서 키우는 상품" remaining="1년 8개월 남음" amount="100,000원" shares="5주" img="/images/product-premium.png" bgColor="#fbe6d0" />

            {/* 자세히 보기 */}
            <div onClick={() => nav('asset_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-neutral-050)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0, overflow: 'hidden' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-neutral-400)' }} />)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>자세히 보기</span>
              </div>
              <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 지난 모집 상품 / 출시 예정 상품 */}
        {(phase === 'settled' || phase === 'pre_settlement' || phase === 'settlement_complete') ? (
          <div>
            <div style={{ padding: '24px 16px 0' }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>출시 예정 상품</span>
            </div>
            <div style={{ padding: '16px 16px 50px' }}>
              <div style={{
                backgroundColor: 'var(--color-neutral-050)', borderRadius: 20,
                padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 88, height: 88, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/images/product-a.png" alt="" style={{ width: 88, height: 66, objectFit: 'cover', opacity: 0.5 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', lineHeight: '26px' }}>
                      새로운 투자 상품이<br />출시될 예정이에요
                    </div>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>134명 알림 신청중</span>
                  </div>
                </div>
                <div style={{
                  height: 40, borderRadius: 12,
                  backgroundColor: 'var(--color-primary-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...T.body15('semibold'), color: '#fff', cursor: 'pointer',
                }}>출시 알림 받기</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ padding: '24px 16px 0' }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>지난 모집 상품</span>
            </div>
            <div style={{ padding: '16px 16px 50px', overflowX: 'auto' }} className="v9-hide-scrollbar">
              <div style={{ display: 'flex', gap: 12 }}>
                {[0, 1].map(i => (
                  <div key={i} style={{
                    width: 300, flexShrink: 0, borderRadius: 20, padding: 10, overflow: 'hidden',
                    background: 'linear-gradient(90deg, rgba(68,135,255,0.2), rgba(68,135,255,0.2)), linear-gradient(90deg, #fff, #fff)',
                  }}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: 16, minHeight: 152 }}>
                      <img src="/images/product-a.png" alt="" style={{ width: 159, height: 120, objectFit: 'cover', position: 'relative', zIndex: 1 }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <span style={{ ...T.title20('semibold'), color: '#fff', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>120% 투자 달성</span>
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>유전지수 높은 상품</span>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-700)', backgroundColor: 'var(--color-neutral-050)', borderRadius: 6, padding: '0 8px', display: 'inline-flex', alignItems: 'center', height: 20 }}>10마리 투자상품</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>1주당 금액</div>
                          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>20,000원~</div>
                        </div>
                        <div style={{ width: 1, height: 28, backgroundColor: 'var(--color-neutral-200)' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>마감 일자</div>
                          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>2023.12.31</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ height: 6, backgroundColor: 'var(--color-neutral-200)', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-neutral-500)', borderRadius: 7 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ ...T.label13(), color: 'var(--color-neutral-500)' }}>
                            <span style={{ color: 'var(--color-neutral-700)' }}>25,278 </span>/ 25,278주
                          </span>
                          <span style={{ ...T.label13(), color: 'var(--color-neutral-700)', backgroundColor: 'var(--color-neutral-050)', borderRadius: 8, padding: '0 8px', height: 24, display: 'inline-flex', alignItems: 'center' }}>마감</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Transition Button - floating 8px above tab bar */}
      {phaseTransition && (
        <div onClick={phaseTransition.onClick} style={{
          position: 'fixed', bottom: 'calc(55px + env(safe-area-inset-bottom, 0px) + 8px)',
          left: '50%', transform: 'translateX(-50%)', zIndex: 21,
          borderRadius: 1000, backgroundColor: 'var(--color-neutral-700)',
          padding: '6px 12px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          ...T.label13('semibold'), color: '#fff', cursor: 'pointer',
        }}>{phaseTransition.label}</div>
      )}

      {/* TabBar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0', width: '100%' }}>
          <TabBarItem icon="home" label="홈" selected />
          <TabBarItem icon="shopping" label="상점" onClick={() => goTab('shopping')} />
          <TabBarItem icon="my" label="마이" onClick={() => goTab('my')} />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

// ============================================================
// Asset Detail Screen (내 투자 상세)
// ============================================================
function AssetDetailScreen({ phase, onBack, nav, phaseTransition }) {
  const quickButtons = [
    { icon: '/icons/account.svg', label: '내 계좌', target: 'my_account' },
    { icon: '/icons/calendar.svg', label: '투자내역', target: 'investment_history' },
    { icon: '/icons/amountBag.svg', label: '정산내역', target: phase === 'settlement_complete' ? 'settlement_history' : null },
  ]

  const bottomMenuItems = [
    { icon: '/icons/shield.svg', label: '자산 보호 내역' },
    { icon: '/icons/paper.svg', label: '세금' },
    { icon: '/icons/flat-paper.svg', label: '중도해지 취소내역' },
  ]

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center' }}>
            <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeftIcon />
            </div>
          </div>
        </div>

        {/* 투자 중인 금액 */}
        <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-700)' }}>투자 중인 금액</span>
          <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)' }}>{(phase === 'settled' || phase === 'pre_settlement') ? '220,000원' : '200,000원'}</span>
        </div>

        {/* 신청 중인 투자 + 계좌 잔액 */}
        <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {phase === 'applying' && (
            <div onClick={() => nav('invest_apply_detail')} style={{ backgroundColor: '#e8f0ff', borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img src="/images/product-a.png" alt="" style={{ width: 43, height: 32, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>신청 중인 투자</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-500)', whiteSpace: 'nowrap' }}>60,000원</span>
                <ChevronRightIcon size={20} color="var(--color-primary-500)" />
              </div>
            </div>
          )}
          <div onClick={() => nav('my_account')} style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '14px 12px 14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{phase === 'applying' ? '40,000원' : phase === 'settlement_complete' ? '102,000원' : (phase === 'settled' || phase === 'pre_settlement') ? '80,000원' : '100,000원'}</span>
              <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
            </div>
          </div>
        </div>

        {/* 퀵 버튼 3개 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 16px' }}>
          {quickButtons.map((btn, idx) => (
            <div key={idx} style={{ display: 'contents' }}>
              <div onClick={() => btn.target && nav(btn.target)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <img src={btn.icon} alt="" style={{ width: 30, height: 30 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>{btn.label}</span>
              </div>
              {idx < quickButtons.length - 1 && (
                <div style={{ width: 1, height: 32, backgroundColor: 'var(--color-neutral-200)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 투자 중인 상품 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>투자 중인 상품 {(phase === 'settled' || phase === 'pre_settlement') ? '3' : '2'}</span>
        </div>

        <div style={{ padding: '8px 0 16px' }}>
          {(phase === 'settled' || phase === 'pre_settlement') && (
            <ProductListItem onClick={() => nav(phase === 'pre_settlement' ? 'product_detail_pre_settlement' : 'product_detail_settled')} name="유전지수 높은 상품" remaining={phase === 'pre_settlement' ? '14일 남음' : '1년 2개월 남음'} amount="20,000원" shares="1주" img="/images/product-a.png" bgColor="#dae7ff" />
          )}
          <ProductListItem name="한약재 먹으며 건강히 키우는 상품" remaining="1년 5개월 남음" amount="100,000원" shares="5주" img="/images/product-herbal.png" bgColor="#fcdede" />
          <ProductListItem name="5성급 축사에서 키우는 상품" remaining="1년 8개월 남음" amount="100,000원" shares="5주" img="/images/product-premium.png" bgColor="#fbe6d0" />
        </div>

        {/* Divider */}
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 하단 메뉴 */}
        <div style={{ padding: '8px 0 50px' }}>
          {bottomMenuItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={item.icon} alt="" style={{ width: 28, height: 28 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
              </div>
              <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Investment History Screen (투자 내역)
// ============================================================
function InvestmentHistoryScreen({ phase, onBack, nav }) {
  const historyData = [
    // 정산 완료 항목
    ...(phase === 'settlement_complete' ? [{
      date: '28년 3월 21일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 정산 완료', img: '/images/product-a.png', bgColor: '#dae7ff', target: 'settlement_complete_detail' },
      ],
    }] : []),
    // 체결 이후 추가 항목
    ...((phase === 'settled' || phase === 'pre_settlement' || phase === 'settlement_complete') ? [{
      date: '26년 6월 1일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 체결 완료', img: '/images/product-a.png', bgColor: '#dae7ff', target: 'invest_settled_detail' },
      ],
    }] : []),
    {
      date: '26년 1월 14일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 체결 완료', img: '/images/product-herbal.png', bgColor: '#fcdede', target: null },
      ],
    },
    {
      date: '26년 1월 12일',
      items: [
        { name: '유전지수 높은 상품', desc: '40,000원 투자 취소', img: '/images/product-herbal.png', bgColor: '#fcdede', target: null },
      ],
    },
    {
      date: '25년 12월 21일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 체결 완료', img: '/images/product-premium.png', bgColor: '#fbe6d0', target: null },
      ],
    },
  ]

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center' }}>
            <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeftIcon />
            </div>
          </div>
        </div>

        {/* 신청 중인 투자 */}
        {phase === 'applying' && (
          <>
            <div style={{ padding: '16px 16px 0' }}>
              <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>신청 중인 투자</span>
            </div>
            <div style={{ paddingBottom: 16 }}>
              <div onClick={() => nav('invest_apply_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#dae7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '0 2px' }}>
                  <img src="/images/product-a.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>유전지수 높은 상품</div>
                  <div style={{ ...T.body15(), color: 'var(--color-primary-500)' }}>60,000원 신청중</div>
                </div>
                <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
              </div>
            </div>
            <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />
          </>
        )}

        {/* Title */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>투자 내역</span>
        </div>

        {/* History List */}
        <div style={{ paddingBottom: 50 }}>
          {historyData.map((group, gi) => (
            <div key={gi} style={{ paddingBottom: 16 }}>
              {/* Date label */}
              <div style={{ padding: '16px 16px 0' }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{group.date}</span>
              </div>

              {/* Items */}
              {group.items.map((item, ii) => (
                <div key={ii} onClick={item.target ? () => nav(item.target) : undefined} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: item.target ? 'pointer' : 'default' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.img} alt="" style={{ width: 44, height: 33, objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.desc}</div>
                  </div>
                  {item.target && <ChevronRightIcon size={20} color="var(--color-neutral-400)" />}
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
// My Account Screen (내 계좌)
// ============================================================
function MyAccountScreen({ onBack, phase, nav }) {
  const accountAmount = phase === 'applying' ? '40,000원' : phase === 'settlement_complete' ? '102,000원' : (phase === 'settled' || phase === 'pre_settlement') ? '80,000원' : '100,000원'
  const accounts = [
    {
      name: 'NH농협은행',
      amount: accountAmount,
      iconBg: '#0ba744',
      icon: '/icons/finance/nh-bank.svg',
    },
  ]

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar with title */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', left: 6 }}>
              <ChevronLeftIcon />
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>내 계좌</span>
            </div>
          </div>
        </div>

        {/* 총 계좌 잔액 */}
        <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>총 계좌 잔액</span>
          <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)' }}>{accountAmount}</span>
        </div>

        {/* Account cards */}
        <div style={{ paddingTop: 20, paddingBottom: 50 }}>
          {accounts.map((account, idx) => (
            <div key={idx} style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div onClick={() => nav('account_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: account.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={account.icon} alt="" style={{ width: 28, height: 28 }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 25 }}>
                    <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>{account.name}</span>
                  </div>
                  <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>{account.amount}</span>
                </div>
                {/* Chevron */}
                <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
              </div>
              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, minHeight: 48, backgroundColor: 'var(--color-neutral-050)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-700)' }}>꺼내기</span>
                </div>
                <div style={{ flex: 1, minHeight: 48, backgroundColor: 'var(--color-neutral-050)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-700)' }}>채우기</span>
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
// Account Detail Screen (계좌 상세)
// ============================================================
function AccountDetailScreen({ onBack, phase }) {
  const balance = phase === 'applying' ? '40,000' : phase === 'settlement_complete' ? '102,000' : (phase === 'settled' || phase === 'pre_settlement') ? '80,000' : '100,000'

  const transactions = []

  if (phase === 'settlement_complete') {
    transactions.push({
      date: '3월 21일',
      items: [
        { title: 'A 투자 상품 정산', time: '12:31', type: '입금', amount: '+ 22,000원', color: 'var(--color-primary-500)' },
      ]
    })
    transactions.push({
      date: '6월 12일',
      items: [
        { title: 'A 투자 상품 체결 환불', time: '12:31', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      ]
    })
    transactions.push({
      date: '6월 1일',
      items: [
        { title: '유전지수 높은 상품 투자 체결', time: '15:00', type: '출금', amount: '- 20,000원', color: 'var(--color-neutral-800)' },
        { title: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-800)' },
      ]
    })
    transactions.push({
      date: '5월 15일',
      items: [
        { title: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
      ]
    })
  } else if (phase === 'settled' || phase === 'pre_settlement') {
    transactions.push({
      date: '6월 1일',
      items: [
        { title: '유전지수 높은 상품 투자 체결', time: '15:00', type: '출금', amount: '- 20,000원', color: 'var(--color-neutral-800)' },
        { title: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-800)' },
      ]
    })
    transactions.push({
      date: '5월 31일',
      items: [
        { title: '환불금 입금', time: '15:01', type: '입금', amount: '+ 40,000원', color: 'var(--color-primary-500)' },
      ]
    })
    transactions.push({
      date: '5월 15일',
      items: [
        { title: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
      ]
    })
  } else if (phase === 'applying') {
    transactions.push({
      date: '6월 1일',
      items: [
        { title: 'A 투자 상품 투자 신청', time: '12:31', type: '출금', amount: '- 60,000원', color: 'var(--color-neutral-800)' },
      ]
    })
    transactions.push({
      date: '5월 15일',
      items: [
        { title: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
      ]
    })
  } else {
    transactions.push({
      date: '5월 15일',
      items: [
        { title: '윤현우', time: '18:00', type: '입금', amount: '+ 100,000원', color: 'var(--color-primary-500)' },
      ]
    })
  }

  const totalCount = transactions.reduce((sum, g) => sum + g.items.length, 0)
  const [activeTab, setActiveTab] = useState('전체')
  const tabs = ['전체', '입금', '출금']

  const filteredTransactions = activeTab === '전체' ? transactions : transactions.map(g => ({
    ...g,
    items: g.items.filter(i => i.type === activeTab)
  })).filter(g => g.items.length > 0)

  const filteredCount = filteredTransactions.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', left: 6 }}>
              <ChevronLeftIcon />
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>NH농협은행</span>
            </div>
          </div>
        </div>

        {/* Blue header */}
        <div style={{
          background: 'linear-gradient(180deg, #2d71ea 0%, #4487ff 100%)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {/* Account number row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/icons/finance/nh-bank.svg" alt="" style={{ width: 32, height: 32 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-050)' }}>2123456-78-9101112</span>
                </div>
                <div style={{
                  backgroundColor: 'var(--color-primary-700)',
                  borderRadius: 20,
                  padding: '2px 10px',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-050)' }}>복사</span>
                </div>
              </div>
              {/* More icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="white" />
                <circle cx="12" cy="12" r="1.5" fill="white" />
                <circle cx="12" cy="19" r="1.5" fill="white" />
              </svg>
            </div>
            {/* Balance */}
            <div style={{ paddingLeft: 4, display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 600, lineHeight: '40px', color: 'white' }}>{balance}</span>
              <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'white' }}>원</span>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <div style={{
              backgroundColor: '#1652b8', borderRadius: 10,
              padding: '12px 16px', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'white' }}>충전 안내</span>
            </div>
            <div style={{
              backgroundColor: '#1652b8', borderRadius: 10,
              padding: '12px 16px', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'white' }}>출금하기</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', alignItems: 'center',
          borderBottom: '1px solid var(--color-neutral-100)',
          padding: '0 24px',
        }}>
          {tabs.map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 12px', cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--color-neutral-900)' : '2px solid transparent',
            }}>
              <span style={{
                fontSize: 16, fontWeight: 600, lineHeight: '24px',
                color: activeTab === tab ? 'var(--color-neutral-900)' : 'var(--color-neutral-500)',
              }}>{tab}</span>
            </div>
          ))}
        </div>

        {/* Filter count */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-600)' }}>총 {filteredCount} 건</span>
        </div>

        {/* Transaction list */}
        <div style={{ padding: '0 24px', paddingBottom: 50 }}>
          {filteredTransactions.map((group, gi) => (
            <div key={gi} style={{
              borderTop: '0.5px solid var(--color-neutral-100)',
              padding: '10px 0',
              display: 'flex', flexDirection: 'column',
            }}>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-600)' }}>{group.date}</span>
              {group.items.map((item, ii) => (
                <div key={ii} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '18px 0 16px',
                }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-900)' }}>{item.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-500)' }}>
                      <span>{item.time}</span>
                      <span>|</span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: item.color, flexShrink: 0 }}>{item.amount}</span>
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
// Invest Product Detail Screen (투자 상품 상세)
// ============================================================
function InvestProductDetailScreen({ onBack, onApply }) {
  return (
    <div className="v9-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <SubAppBar title="" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)', opacity: 0.2 }}>투자 상품 상세</span>
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
    <div className="v9-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <SubAppBar title="A 투자 상품" onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...T.headline24('semibold'), color: 'var(--color-neutral-900)', opacity: 0.2 }}>투자 상품 상세</span>
      </div>
      <div style={{ padding: '8px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, height: 56, borderRadius: 14,
          backgroundColor: 'var(--color-neutral-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), color: 'var(--color-neutral-700)',
        }}>1주 투자중</div>
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
// Invest Product Detail Settled Screen (투자상품상세_체결)
// ============================================================
function InvestProductDetailSettledScreen({ onBack, phase, nav }) {
  const [activeTab, setActiveTab] = useState('내 투자')

  const cowCards = [
    { name: '뱅카우목장 2호', status: '1개월 후 출하 예정' },
    { name: '뱅카우목장 2호', status: '10개월 후 출하 예정' },
    { name: '뱅카우목장 2호', status: '10개월 후 출하 예정' },
    { name: '뱅카우목장 2호', status: '10개월 후 출하 예정' },
    { name: '뱅카우목장 2호', status: '10개월 후 출하 예정' },
    { name: '뱅카우목장 2호', status: '10개월 후 출하 예정' },
  ]

  const cowChips = ['전체', '사육중', '출하중', '경매 완료']
  const [activeCowChip, setActiveCowChip] = useState('사육중')

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* Hero area - blue bg */}
        <div style={{ backgroundColor: 'rgba(68,135,255,0.2)' }}>
          {/* AppBar */}
          <div style={{ height: 60, padding: '0 6px', display: 'flex', alignItems: 'center' }}>
            <div onClick={onBack} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeftIcon />
            </div>
          </div>

          {/* Content area */}
          <div style={{ height: 240, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 16px' }}>
              <span style={{ fontSize: 32, fontWeight: 600, lineHeight: '40px', color: 'var(--color-neutral-900)', letterSpacing: '-0.96px' }}>A 투자 상품</span>
            </div>
            <div style={{ display: 'flex', paddingLeft: 16 }}>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)', opacity: 0.8 }}>보유 수량</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>1</span>
                    <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)' }}>/ 100주</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)', opacity: 0.8 }}>내 투자금</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: '32px', color: 'var(--color-neutral-900)' }}>20,000</span>
                    <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)' }}>원</span>
                  </div>
                </div>
              </div>
              <div style={{ width: 200, height: 200, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/product-a.png" alt="" style={{ width: 186, height: 140, objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', borderBottom: '1px solid var(--color-neutral-100)' }}>
          {['내 투자', '송아지 정보'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              height: 52, minHeight: 52, padding: '0 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  fontSize: 17, fontWeight: activeTab === tab ? 700 : 600,
                  lineHeight: '26px',
                  color: activeTab === tab ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)',
                }}>{tab}</span>
              </div>
              <div style={{
                height: 2, width: '100%', borderRadius: 999,
                backgroundColor: activeTab === tab ? 'var(--color-neutral-800)' : 'transparent',
              }} />
            </div>
          ))}
        </div>

        {/* Tab content - 내 투자 */}
        {activeTab === '내 투자' && (
          <>
            {/* 정산일 */}
            <div style={{ padding: '32px 16px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-700)' }}>정산일</span>
                <span style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>
                  {phase === 'settlement_complete' ? '정산 완료' : phase === 'pre_settlement' ? '14일 남음' : '약 1년 2개월 남음'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 8, backgroundColor: 'var(--color-neutral-100)', borderRadius: 99, overflow: 'hidden' }}>
                  {(phase === 'settled' || phase === 'pre_settlement' || phase === 'settlement_complete') && (
                    <div style={{ width: phase === 'settlement_complete' ? '100%' : phase === 'pre_settlement' ? `${(331/358)*100}%` : '10%', height: '100%', backgroundColor: phase === 'settlement_complete' ? 'var(--color-primary-500)' : 'var(--color-neutral-600)', borderRadius: 99 }} />
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>26.06.01</span>
                  <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>28.03.21</span>
                </div>
              </div>
            </div>

            {/* 내 정산 내역 (settlement_complete only) */}
            {phase === 'settlement_complete' && (
              <>
                <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />
                <div style={{ padding: '24px 16px 0' }}>
                  <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 정산 내역</span>
                </div>
                <div style={{ padding: '8px 16px 16px' }}>
                  <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start' }}>
                      <span style={{ ...T.label13('semibold'), color: 'var(--color-primary-600)', backgroundColor: 'var(--color-primary-050)', borderRadius: 6, padding: '2px 8px' }}>유전지수 높은 상품 정산</span>
                    </div>
                    {[
                      { label: '투자금', value: '20,000원' },
                      { label: '세금 (15.4%)', value: '-1,500원' },
                      { label: '세후 수익금', value: '+2,000원', color: 'var(--color-red-500)' },
                      { label: '세후 수익률', value: '+10%', color: 'var(--color-red-500)' },
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{row.label}</span>
                        <span style={{ ...T.body15('semibold'), color: row.color || 'var(--color-neutral-800)' }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, backgroundColor: 'var(--color-neutral-200)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>정산금</span>
                      <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-900)' }}>22,000원</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

            {/* 내 투자금 */}
            <div>
              <div style={{ padding: '24px 16px 0' }}>
                <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 투자금</span>
              </div>
              <div style={{ padding: '8px 0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                  <span style={{ flex: 1, ...T.body17(), color: 'var(--color-neutral-700)' }}>투자금</span>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>20,000원</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                  <span style={{ flex: 1, ...T.body17(), color: 'var(--color-neutral-700)' }}>보유 수량</span>
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>1주</span>
                </div>
              </div>
            </div>

            <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

            {/* 투자 내역 */}
            <div>
              <div style={{ padding: '24px 16px 0' }}>
                <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>투자 내역</span>
              </div>
              <div style={{ padding: '16px 16px' }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>26년 6월 1일</span>
                <div onClick={() => nav && nav('invest_settled_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', cursor: 'pointer' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 16,
                    backgroundColor: '#dae7ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    <img src="/images/product-a.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', display: 'block' }}>A 투자 상품</span>
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>20,000원 체결 완료</span>
                  </div>
                  <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
                </div>
              </div>
            </div>

            <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

            {/* Bottom menu */}
            <div style={{ paddingBottom: 50, paddingTop: 8 }}>
              {[
                { icon: 'paper', label: '공시', arrow: 'down' },
                { icon: 'paper', label: '투자자 명부', arrow: 'down' },
                { icon: 'shield', label: '자산 보호 처리 방침', arrow: 'right' },
                { icon: 'farm', label: '상품 정보', arrow: 'right' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <img src={`/icons/${item.icon}.svg`} alt="" style={{ width: 28, height: 28, flexShrink: 0 }} />
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
                  </div>
                  {item.arrow === 'down' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  ) : (
                    <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab content - 송아지 정보 */}
        {activeTab === '송아지 정보' && (
          <>
            <div style={{ paddingTop: 32 }}>
              {/* Title */}
              <div style={{ padding: '0 24px' }}>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-900)' }}>내 송아지 </span>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-primary-500)' }}>10</span>
              </div>

              {/* Chips */}
              <div style={{ display: 'flex', gap: 6, padding: '16px 24px 0' }}>
                {cowChips.map(chip => (
                  <div key={chip} onClick={() => setActiveCowChip(chip)} style={{
                    height: 30, borderRadius: activeCowChip === chip ? 50 : 20,
                    padding: '4px 16px',
                    backgroundColor: activeCowChip === chip ? 'var(--color-primary-900)' : 'var(--color-neutral-000)',
                    border: activeCowChip === chip ? 'none' : '0.5px solid var(--color-neutral-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: activeCowChip === chip ? 600 : 500,
                      lineHeight: '20px',
                      color: activeCowChip === chip ? 'var(--color-neutral-000)' : 'var(--color-neutral-700)',
                    }}>{chip}</span>
                  </div>
                ))}
              </div>

              {/* Count */}
              <div style={{ padding: '24px 24px 0', height: 48, display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-600)' }}>총 6 마리</span>
              </div>

              {/* Cards */}
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {cowCards.map((cow, idx) => (
                  <div key={idx} style={{
                    border: '1px solid var(--color-neutral-100)',
                    borderRadius: 16, padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.04), 0px 2px 10px 0px rgba(0,0,0,0.02)',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 999,
                      backgroundColor: '#0a64f0', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <img src="/images/cow-profile.png" alt="" style={{ width: 48, height: 48, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-900)' }}>{cow.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-800)' }}>{cow.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 안내사항 */}
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', color: 'var(--color-neutral-700)' }}>안내사항</span>
              <div style={{ display: 'flex', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)', flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)' }}>각 상품별 생애주기 일자는 예상 일자로 실제 생애주기 일자와 차이가 발생할 수 있습니다.</span>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)', flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)' }}>모든 송아지의 경매가 완료된 후 10영업일 이내 정산이 진행됩니다.</span>
              </div>
            </div>

            <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

            {/* Bottom menu */}
            <div style={{ paddingBottom: 50 }}>
              {[
                { icon: 'paper', label: '공시', arrow: 'down' },
                { icon: 'paper', label: '투자자 명부', arrow: 'down' },
                { icon: 'shield', label: '자산 보호 처리 방침', arrow: 'right' },
                { icon: 'farm', label: '상품 정보', arrow: 'right' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <img src={`/icons/${item.icon}.svg`} alt="" style={{ width: 28, height: 28, flexShrink: 0 }} />
                    <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{item.label}</span>
                  </div>
                  {item.arrow === 'down' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  ) : (
                    <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Invest Apply Detail Screen (투자내역상세_신청 후)
// ============================================================
function InvestApplyDetailScreen({ onBack, nav }) {
  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        {/* Header */}
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/images/product-a.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-700)', flex: 1, minWidth: 0 }}>유전지수 높은 상품</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--color-neutral-900)', textTransform: 'capitalize' }}>
            3주 투자 신청
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 16px 28px' }}>
          {/* Step 1 - 신청 (active) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              {/* Check icon */}
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="var(--color-primary-500)" />
                  <path d="M12 18L16 22L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>신청</div>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>취소 가능</div>
              </div>
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-800)', textAlign: 'center', whiteSpace: 'nowrap' }}>26.06.01</span>
          </div>

          {/* Connector */}
          <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36 }}>
            <div style={{ width: 3, height: 24, borderRadius: 99, backgroundColor: 'var(--color-neutral-100)' }} />
          </div>

          {/* Step 2 - 체결 (inactive) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 100,
                  backgroundColor: 'var(--color-neutral-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...T.body17('semibold'), color: 'var(--color-neutral-500)',
                }}>2</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-600)' }}>체결</div>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-500)' }}>취소 불가능</div>
              </div>
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-600)', textAlign: 'center', whiteSpace: 'nowrap' }}>26.06.12</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '0 16px 24px', display: 'flex', gap: 8 }}>
          <div onClick={() => nav && nav('product_detail_after')} style={{
            flex: 1, minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)', cursor: 'pointer',
          }}>상품 정보</div>
          <div onClick={() => nav && nav('product_detail_after')} style={{
            flex: 1, minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)', cursor: 'pointer',
          }}>추가 투자</div>
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 신청 내역 */}
        <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>신청 내역</span>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>모집율에 따라 일부만 체결될 수 있어요</span>
        </div>

        {/* Detail rows */}
        <div style={{ padding: '12px 0 16px' }}>
          {[
            { label: '최초 신청 시간', value: '2026.06.01 22:21' },
            { label: '신청 금액', value: '60,000원' },
            { label: '신청 수량', value: '3주' },
            { label: '체결 예정일', value: '26.06.12' },
          ].map((row, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 16,
              ...T.body17(), color: 'var(--color-neutral-700)',
            }}>
              <span style={{ flex: 1, minWidth: 0 }}>{row.label}</span>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* 투자 취소하기 */}
        <div style={{ padding: '0 16px 50px' }}>
          <div style={{
            minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-red-500)', cursor: 'pointer',
          }}>투자 취소하기</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest Settled Detail Screen (투자내역상세_체결)
// ============================================================
function InvestSettledDetailScreen({ onBack, nav }) {
  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        {/* Header */}
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/images/product-a.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-700)', flex: 1, minWidth: 0 }}>유전지수 높은 상품</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--color-neutral-900)', textTransform: 'capitalize' }}>
            1주 체결 완료
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 16px 28px' }}>
          {/* Step 1 - 신청 (completed) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="var(--color-primary-500)" />
                  <path d="M12 18L16 22L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>신청</div>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>취소 가능</div>
              </div>
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-800)', textAlign: 'center', whiteSpace: 'nowrap' }}>26.06.01</span>
          </div>

          {/* Connector */}
          <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36 }}>
            <div style={{ width: 3, height: 24, borderRadius: 99, backgroundColor: 'var(--color-neutral-100)' }} />
          </div>

          {/* Step 2 - 체결 (completed) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="var(--color-primary-500)" />
                  <path d="M12 18L16 22L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>체결</div>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>취소 불가능</div>
              </div>
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-800)', textAlign: 'center', whiteSpace: 'nowrap' }}>26.06.12</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ padding: '0 16px 24px' }}>
          <div onClick={() => nav && nav('product_detail_settled')} style={{
            minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)', cursor: 'pointer',
          }}>상품 정보</div>
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 체결 내역 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>체결 내역</span>
        </div>
        <div style={{ padding: '12px 0 16px' }}>
          {[
            { label: '체결 시간', value: '2026.06.01 22:21' },
            { label: '체결 금액', value: '20,000원' },
            { label: '체결 수량', value: '1주' },
            { label: '환불 금액', value: '40,000원' },
          ].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17(), color: 'var(--color-neutral-700)' }}>
              <span style={{ flex: 1, minWidth: 0 }}>{row.label}</span>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 신청 내역 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>신청 내역</span>
        </div>
        <div style={{ padding: '12px 0 50px' }}>
          {[
            { label: '신청 시간', value: '2026.06.01 22:21' },
            { label: '신청 금액', value: '60,000원' },
            { label: '신청 수량', value: '3주' },
            { label: '체결 예정일', value: '26.06.12' },
          ].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17(), color: 'var(--color-neutral-700)' }}>
              <span style={{ flex: 1, minWidth: 0 }}>{row.label}</span>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Invest Settlement Complete Detail Screen (투자내역상세_정산 완료)
// ============================================================
function InvestSettlementCompleteDetailScreen({ onBack, nav }) {
  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        {/* Header */}
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: '#dae7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/images/product-a.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
            </div>
            <span style={{ ...T.body17(), color: 'var(--color-neutral-700)', flex: 1, minWidth: 0 }}>유전지수 높은 상품</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--color-neutral-900)', textTransform: 'capitalize' }}>
            1주 정산 완료
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '0 16px 24px', display: 'flex', gap: 8 }}>
          <div onClick={() => nav('product_detail_settlement_complete')} style={{
            flex: 1, minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)', cursor: 'pointer',
          }}>상품 정보</div>
          <div style={{
            flex: 1, minHeight: 56, borderRadius: 16,
            backgroundColor: 'var(--color-neutral-050)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body17('semibold'), color: 'var(--color-neutral-700)', cursor: 'pointer',
          }}>정산 계좌 보기</div>
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 내 정산 내역 */}
        <div style={{ padding: '24px 16px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ flex: 1, ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>내 정산 내역</span>
          <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>
            <span style={{ ...T.body15('semibold'), color: 'var(--color-neutral-700)' }}>어떻게 계산되나요?</span>
          </div>
        </div>
        <div style={{ padding: '12px 0 16px' }}>
          {[
            { label: '투자금', value: '20,000원' },
            { label: '세금 (15.4%)', value: '-1,500원', hasHelp: true },
            { label: '세후 수익금', value: '+2,000원', color: 'var(--color-red-500)' },
            { label: '세후 수익률', value: '+10%', color: 'var(--color-red-500)' },
          ].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17() }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: 'var(--color-neutral-700)' }}>{row.label}</span>
                {row.hasHelp && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--color-neutral-400)" strokeWidth="1.5"/><path d="M12 8v1m0 3v4" stroke="var(--color-neutral-400)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                )}
              </div>
              <span style={{ ...T.body17('semibold'), color: row.color || 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
          <div style={{ margin: '0 16px', height: 1, backgroundColor: 'var(--color-neutral-200)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17() }}>
            <span style={{ flex: 1, minWidth: 0, color: 'var(--color-neutral-700)' }}>정산금</span>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>22,000원</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 전체 정산 내역 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>전체 정산 내역</span>
        </div>
        <div style={{ padding: '12px 0 50px' }}>
          {[
            { label: '총 경매가', value: '400,000,000원' },
            { label: '총 투자금', value: '350,000,000원' },
            { label: '보상금', value: '+5,000,000원', hasHelp: true },
            { label: '사육비', value: '-30,000,000원', arrow: true },
            { label: '농가 장려금', value: '-5,000,000원', hasHelp: true },
            { label: '운영 성과금', value: '-5,000,000원', hasHelp: true },
          ].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17(), color: 'var(--color-neutral-700)' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{row.label}</span>
                {row.hasHelp && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--color-neutral-400)" strokeWidth="1.5"/><path d="M12 8v1m0 3v4" stroke="var(--color-neutral-400)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
                {row.arrow && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                )}
              </div>
            </div>
          ))}
          <div style={{ margin: '0 16px', height: 1, backgroundColor: 'var(--color-neutral-200)' }} />
          {[
            { label: '전체 수익금 (21,876주)', value: '+10,000,000원' },
            { label: '내 수익금 (1주)', value: '+2,000원' },
          ].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...T.body17(), color: 'var(--color-neutral-700)' }}>
              <span style={{ flex: 1, minWidth: 0 }}>{row.label}</span>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-red-500)', textAlign: 'right', whiteSpace: 'nowrap' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Settlement History Screen (정산 내역)
// ============================================================
function SettlementHistoryScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('전체')

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <SubAppBar title="" onBack={onBack} />
        </div>

        {/* Tab toggle - pill style */}
        <div style={{ padding: '16px 16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            backgroundColor: 'var(--color-neutral-050)', borderRadius: 999, display: 'inline-flex', padding: 4,
          }}>
            {['전체', '년'].map(tab => (
              <div key={tab} onClick={() => setActiveTab(tab)} style={{
                minWidth: 88, padding: 8, borderRadius: 999,
                backgroundColor: activeTab === tab ? 'var(--color-neutral-000)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...T.body17('semibold'),
                color: activeTab === tab ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)',
                cursor: 'pointer',
              }}>{tab}</div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: '32px 16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>26.06 세후 실현손익</span>
          <span style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--color-red-500)' }}>+2,000원</span>
          <span style={{ ...T.body17('bold'), color: 'var(--color-red-500)' }}>(10%)</span>
        </div>

        {/* Stats - row style */}
        <div style={{ padding: '16px 0' }}>
          {[
            { label: '정산 상품 수', value: '1개' },
            { label: '총 투자금', value: '20,000원' },
            { label: '총 세후 정산금', value: '22,000원' },
          ].map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', ...T.body17() }}>
              <span style={{ flex: 1, minWidth: 0, color: 'var(--color-neutral-700)' }}>{stat.label}</span>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', textAlign: 'right', whiteSpace: 'nowrap' }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 10, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* 정산 내역 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>정산 내역</span>
        </div>

        <div style={{ paddingBottom: 50 }}>
          {/* Date */}
          <div style={{ padding: '16px 16px 0' }}>
            <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>28년 3월 21일</span>
          </div>

          {/* Entry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 16,
                backgroundColor: '#dae7ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}>
                <img src="/images/product-a.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>유전지수 높은 상품</div>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>20,000원 정산</div>
              </div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ ...T.body17('bold'), color: 'var(--color-red-500)' }}>+2,000원</span>
              <span style={{ ...T.body15('semibold'), color: 'var(--color-red-500)' }}>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Push Notification Screen (페이즈 전환용)
// ============================================================
function PushNotificationScreen({ title, message, onTap }) {
  return (
    <div className="v9-screen" onClick={onTap} style={{
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
            <img src="/images/product-a.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
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
    <div className="v9-screen" style={{
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
            <img src="/icons/finance/nh-bank.svg" alt="" style={{ width: 24, height: 24 }} />
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
function ApplyCompleteScreen({ onConfirm, onGoHistory }) {
  return (
    <div className="v9-screen" style={{
      width: '100%', height: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 110 }}>
        {/* Check icon */}
        <div style={{
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: 'var(--color-primary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ padding: '20px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>투자 신청 완료</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-neutral-600)', lineHeight: '24px' }}>
            투자 신청이 완료됐어요.<br />6월 12일에 체결 결과를 알려드릴게요.
          </div>
        </div>
      </div>
      {/* CTA Buttons */}
      <div style={{
        padding: '8px 16px',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', gap: 8,
      }}>
        <div onClick={onGoHistory} style={{
          flex: 1, height: 56, borderRadius: 16,
          backgroundColor: 'var(--color-neutral-050)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), color: 'var(--color-neutral-700)',
          cursor: 'pointer',
        }}>투자내역</div>
        <div onClick={onConfirm} style={{
          flex: 1, height: 56, borderRadius: 16,
          backgroundColor: 'var(--color-primary-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...T.body17('semibold'), color: '#fff',
          cursor: 'pointer',
        }}>확인</div>
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
        <img src="/images/shopping.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ ...T.body15(), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ ...T.body17('bold'), color: 'var(--color-neutral-900)', marginTop: 2 }}>{product.price}</div>
        <div style={{ ...T.label13(), color: 'var(--color-neutral-600)' }}>{product.unit}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['뱅카우한우', '텍스트'].map(tag => (
            <span key={tag} style={{ borderRadius: 4, padding: '2px 8px', border: '1px solid var(--color-neutral-200)', ...T.label13(), color: 'var(--color-neutral-600)' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'var(--color-neutral-100)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🐄</div>
          <span style={{ ...T.label13(), color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.farm}</span>
        </div>
      </div>
    </div>
  )

  const ProductSection = ({ title }) => (
    <div style={{ padding: '28px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-700)' }}>전체보기</span>
          <ChevronRightIcon size={10} color="var(--color-neutral-700)" />
        </div>
      </div>
      <div className="v9-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {products.slice(0, 3).map(p => <ShopProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-000)' }}>
          <div style={{ height: 60, padding: '0 6px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>쇼핑</div>
            <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/icons/appbar/notification.svg" alt="알림" style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* 프로모션 배너 */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ width: '100%', height: 120, borderRadius: 16, overflow: 'hidden', backgroundColor: 'var(--color-primary-050)', position: 'relative', display: 'flex', alignItems: 'center', padding: 20 }}>
            <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--color-primary-100)', borderRadius: 6, padding: '2px 8px', marginBottom: 6 }}>
                <span style={{ ...T.label13(), color: 'var(--color-primary-600)' }}>1C 이상 투자 성공 시</span>
              </div>
              <div style={{ ...T.body17('bold'), color: 'var(--color-neutral-900)', lineHeight: '26px' }}>
                1++ 한우 구매 가능한<br />2만 포인트 지급
              </div>
            </div>
            <div style={{ width: 80, height: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>P</span>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 100, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ ...T.label13(), color: 'rgba(255,255,255,0.9)' }}>1</span>
              <span style={{ ...T.label13(), color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span style={{ ...T.label13(), color: 'rgba(255,255,255,0.5)' }}>5</span>
            </div>
          </div>
        </div>

        <ProductSection title="전체 상품" />
        <div style={{ height: 0, borderTop: '1px solid var(--color-neutral-050)' }} />
        <ProductSection title="{상품 그룹}" />
      </div>

      {/* TabBar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
          <TabBarItem icon="home" label="홈" onClick={() => goTab('home')} />
          <TabBarItem icon="shopping" label="상점" selected />
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
function MyPageScreen({ nav, goTab, phase }) {
  const menuItem = (icon, label, target) => (
    <div key={label} style={{ height: 50, padding: '12px', display: 'flex', alignItems: 'center', gap: 8, cursor: target ? 'pointer' : 'default' }}
      onClick={target ? () => nav(target) : undefined}>
      <img src={icon} alt="" style={{ width: 24, height: 24 }} />
      <span style={{ ...T.body17(), color: 'var(--color-neutral-800)' }}>{label}</span>
    </div>
  )

  const cardStyle = {
    backgroundColor: 'var(--color-neutral-000)', borderRadius: 16, overflow: 'hidden',
  }

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-050)', position: 'relative',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
    }}>
      <div className="v9-scroll" style={{ height: '100dvh', overflowY: 'auto', paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ height: 'env(safe-area-inset-top, 0px)', backgroundColor: 'var(--color-neutral-050)' }} />

        {/* AppBar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-neutral-050)' }}>
          <div style={{ height: 60, padding: '0 6px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>마이페이지</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 92, justifyContent: 'flex-end' }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <img src="/icons/Setting.svg" alt="설정" style={{ width: 24, height: 24 }} />
              </div>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <img src="/icons/appbar/notification.svg" alt="알림" style={{ width: 24, height: 24 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Profile + Membership Card */}
        <div style={{ padding: '0 16px' }}>
          {/* Profile */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>김한우님, 반가워요!</div>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '22px', color: 'var(--color-neutral-600)' }}>내 정보</span>
                <ChevronRightIcon size={20} color="var(--color-neutral-600)" />
              </div>
            </div>
            <div style={{ width: 100, height: 100, flexShrink: 0 }}>
              <img src="/myCow.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Membership Card */}
          <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 16, paddingTop: 20, paddingBottom: 24 }}>
            {/* Membership row */}
            <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/images/membership.png" alt="" style={{ width: 50, height: 50, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>멤버십 등급</div>
                <div style={{ ...T.title20('semibold'), color: 'var(--color-neutral-800)' }}>견학생</div>
              </div>
              <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 12, padding: '9px 20px', ...T.body15('semibold'), color: 'var(--color-neutral-700)', flexShrink: 0, cursor: 'pointer', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>혜택보기</div>
            </div>
            {/* Spacer */}
            <div style={{ height: 32 }} />
            {/* Quick buttons */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              {[
                { label: '내 계좌', icon: '/icons/account.svg', target: 'my_account' },
                { label: '투자내역', icon: '/icons/calendar.svg', target: 'investment_history' },
                { label: '주문내역', icon: '/icons/meet.svg', target: null },
              ].map((btn) => (
                <div key={btn.label} onClick={btn.target ? () => nav(btn.target) : undefined} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  cursor: btn.target ? 'pointer' : 'default',
                }}>
                  <img src={btn.icon} alt="" style={{ width: 30, height: 30 }} />
                  <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{btn.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 투자 */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>투자</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/farm.svg', '내 투자', 'asset_detail')}
              {menuItem('/icons/amountBag.svg', '정산내역', phase === 'settlement_complete' ? 'settlement_history' : null)}
              {menuItem('/icons/shield.svg', '자산 보호 내역', null)}
              {menuItem('/icons/money-bag.svg', '세금', null)}
            </div>
          </div>
          {/* 쇼핑 */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>쇼핑</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/point-bag.svg', '뱅카우캐시', null)}
              {menuItem('/icons/coupon.svg', '내 쿠폰', null)}
            </div>
          </div>
          {/* 고객지원 */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 500, lineHeight: '24px', color: 'var(--color-neutral-600)', padding: '20px 20px 4px' }}>고객지원</div>
            <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItem('/icons/help.svg', '고객센터', null)}
              {menuItem('/icons/review.svg', '1:1 문의', null)}
              {menuItem('/icons/loud-speaker.svg', '공지사항', null)}
              {menuItem('/icons/paper.svg', '이용약관', null)}
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* TabBar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
          <TabBarItem icon="home" label="홈" onClick={() => goTab('home')} />
          <TabBarItem icon="shopping" label="상점" onClick={() => goTab('shopping')} />
          <TabBarItem icon="my" label="마이" selected />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

// ============================================================
// Shared Components
// ============================================================
function ProductListItem({ name, remaining, amount, shares, img, bgColor, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '0 2px' }}>
        <img src={img} alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 25 }}>{name}</div>
          <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{remaining}</div>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
          <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>{amount}</div>
          <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{shares}</div>
        </div>
      </div>
    </div>
  )
}

function TabBarItem({ icon, label, selected = false, onClick }) {
  const color = selected ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)'
  const iconMap = {
    home: '/icons/tab/home.svg',
    shopping: '/icons/tab/shopping.svg',
    my: '/icons/tab/my.svg',
  }
  const iconFilter = selected
    ? 'brightness(0)'
    : 'brightness(0) saturate(100%) invert(72%) sepia(5%) saturate(600%) hue-rotate(190deg) brightness(90%) contrast(90%)'
  return (
    <div onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 43, padding: '2px 4px 0', cursor: 'pointer' }}>
      <img src={iconMap[icon]} alt={label} style={{ width: 24, height: 24, filter: iconFilter }} />
      <span style={{ ...T.label11(), color, textAlign: 'center' }}>{label}</span>
    </div>
  )
}
