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

// ============================================================
// Main Router
// ============================================================
export default function V9App() {
  const [screen, setScreen] = useState('home')
  const [history, setHistory] = useState([])

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

  switch (screen) {
    case 'home':
      return <HomeScreen nav={nav} goTab={goTab} />
    case 'asset_detail':
      return <AssetDetailScreen onBack={goBack} nav={nav} />
    case 'investment_history':
      return <InvestmentHistoryScreen onBack={goBack} />
    case 'my_account':
      return <MyAccountScreen onBack={goBack} />
    default:
      return <HomeScreen nav={nav} goTab={goTab} />
  }
}

// ============================================================
// Home Screen
// ============================================================
function HomeScreen({ nav, goTab }) {
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
            <div style={{
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
          <div style={{ padding: '24px 16px 0' }}>
            <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>투자 중인 금액</div>
            <div style={{ ...T.headline24('bold'), color: 'var(--color-neutral-900)' }}>200,000원</div>
          </div>

          <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* 계좌 잔액 */}
            <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '14px 12px 14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>100,000원</span>
                <ChevronRightIcon size={20} color="var(--color-neutral-400)" />
              </div>
            </div>
          </div>

          {/* 투자 중인 상품 */}
          <div style={{ padding: '24px 16px 0' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>투자 중인 상품 2</span>
          </div>

          <div style={{ paddingBottom: 8 }}>
            <ProductListItem name="한약재 먹으며 건강히 키우는 상품" remaining="1년 5개월 남음" amount="100,000원" shares="5주" img="/images/product-herbal.png" bgColor="#fcdede" />
            <ProductListItem name="5성급 축사에서 키우는 상품" remaining="1년 8개월 남음" amount="100,000원" shares="5주" img="/images/product-premium.png" bgColor="#fbe6d0" />

            {/* 자세히 보기 */}
            <div onClick={() => nav('asset_detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-neutral-050)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <span style={{ fontSize: 20, color: 'var(--color-neutral-400)', letterSpacing: 2 }}>···</span>
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

        {/* 지난 모집 상품 */}
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
      </div>

      {/* TabBar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-neutral-000)', borderTop: '1px solid var(--color-neutral-050)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '4px 20px 0' }}>
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
function AssetDetailScreen({ onBack, nav }) {
  const quickButtons = [
    { icon: '/icons/account.svg', label: '내 계좌', target: 'my_account' },
    { icon: '/icons/graphic/calendar.svg', label: '투자내역', target: 'investment_history' },
    { icon: '/icons/amountBag.svg', label: '정산내역', target: null },
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
      animation: 'v9-slide-in 0.3s ease-out',
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
          <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)' }}>200,000원</span>
        </div>

        {/* 계좌 잔액 */}
        <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ backgroundColor: 'var(--color-neutral-050)', borderRadius: 16, height: 56, padding: '14px 12px 14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>100,000원</span>
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

        {/* 투자 중인 상품 2 */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>투자 중인 상품 2</span>
        </div>

        <div style={{ padding: '8px 0 16px' }}>
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
function InvestmentHistoryScreen({ onBack }) {
  const historyData = [
    {
      date: '26년 1월 14일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 체결 완료', img: '/images/product-herbal.png', bgColor: '#fcdede' },
      ],
    },
    {
      date: '26년 1월 12일',
      items: [
        { name: '유전지수 높은 상품', desc: '40,000원 투자 취소', img: '/images/product-herbal.png', bgColor: '#fcdede' },
      ],
    },
    {
      date: '25년 12월 21일',
      items: [
        { name: '유전지수 높은 상품', desc: '20,000원 체결 완료', img: '/images/product-premium.png', bgColor: '#fbe6d0' },
      ],
    },
  ]

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      animation: 'v9-slide-in 0.3s ease-out',
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

        {/* Title */}
        <div style={{ padding: '24px 16px 0' }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>투자 내역</span>
        </div>

        {/* History List */}
        <div style={{ paddingBottom: 50 }}>
          {historyData.map((group, gi) => (
            <div key={gi}>
              {/* Underline indicator for first group */}
              {gi === 0 && (
                <div style={{ padding: '0 16px' }}>
                  <div style={{ width: 123, height: 2, backgroundColor: 'var(--color-neutral-900)' }} />
                </div>
              )}

              {/* Date label */}
              <div style={{ padding: '16px 16px 0' }}>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{group.date}</span>
              </div>

              {/* Items */}
              {group.items.map((item, ii) => (
                <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '0 2px' }}>
                    <img src={item.img} alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}

              {/* Divider between groups */}
              {gi < historyData.length - 1 && (
                <div style={{ height: 1, backgroundColor: 'var(--color-neutral-100)', margin: '0 16px' }} />
              )}
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
function MyAccountScreen({ onBack }) {
  const accounts = [
    {
      name: 'NH농협은행',
      amount: '100,000,000원',
      iconBg: '#0ba744',
      icon: '/icons/finance/nh-bank.svg',
    },
    {
      name: '신한투자증권',
      amount: '100,000,000원',
      iconBg: '#2a64ff',
      icon: null, // inline SVG
    },
  ]

  return (
    <div className="v9-screen" style={{
      width: '100%', minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      animation: 'v9-slide-in 0.3s ease-out',
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
          <span style={{ ...T.headline32(), color: 'var(--color-neutral-900)' }}>1,760,000원</span>
        </div>

        {/* Account cards */}
        <div style={{ paddingTop: 20, paddingBottom: 50 }}>
          {accounts.map((account, idx) => (
            <div key={idx} style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: account.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {account.icon ? (
                    <img src={account.icon} alt="" style={{ width: 28, height: 28 }} />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="10" stroke="#fff" strokeWidth="1.5" />
                      <text x="14" y="18" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="Pretendard">S</text>
                    </svg>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 25 }}>
                    <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>{account.name}</span>
                    {idx === 0 && (
                      <img src="/icons/graphic/help.svg" alt="" style={{ width: 20, height: 20, opacity: 0.5 }} />
                    )}
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
