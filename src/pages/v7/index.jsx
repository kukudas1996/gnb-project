import { useState, useRef, useEffect } from 'react'

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
  `
  document.head.appendChild(style)
}

// ============================================================
// Typography Helpers
// ============================================================
const T = {
  headline32: (w = 'bold') => ({ fontSize: `var(--font-headline32-${w}-size)`, lineHeight: `var(--font-headline32-${w}-line-height)`, fontWeight: `var(--font-headline32-${w}-weight)` }),
  headline24: (w = 'bold') => ({ fontSize: `var(--font-headline24-${w}-size)`, lineHeight: `var(--font-headline24-${w}-line-height)`, fontWeight: `var(--font-headline24-${w}-weight)` }),
  title20: (w = 'bold') => ({ fontSize: `var(--font-title20-${w}-size)`, lineHeight: `var(--font-title20-${w}-line-height)`, fontWeight: `var(--font-title20-${w}-weight)` }),
  body17: (w = 'medium') => ({ fontSize: `var(--font-body17-${w}-size)`, lineHeight: `var(--font-body17-${w}-line-height)`, fontWeight: `var(--font-body17-${w}-weight)` }),
  body15: (w = 'medium') => ({ fontSize: `var(--font-body15-${w}-size)`, lineHeight: `var(--font-body15-${w}-line-height)`, fontWeight: `var(--font-body15-${w}-weight)` }),
  label13: (w = 'medium') => ({ fontSize: `var(--font-label13-${w}-size)`, lineHeight: `var(--font-label13-${w}-line-height)`, fontWeight: `var(--font-label13-${w}-weight)` }),
  label11: (w = 'medium') => ({ fontSize: `var(--font-label11-${w}-size)`, lineHeight: `var(--font-label11-${w}-line-height)`, fontWeight: `var(--font-label11-${w}-weight)` }),
}

// ============================================================
// Home Screen
// ============================================================
export default function V7Home() {
  const [bannerIndex, setBannerIndex] = useState(0)
  const bannerCount = 5
  const closedScrollRef = useRef(null)

  return (
    <div className="v7-screen" style={{
      width: '100%',
      minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      position: 'relative',
    }}>
      {/* Scroll Body */}
      <div className="v7-scroll" style={{
        height: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: 'calc(77px + env(safe-area-inset-bottom, 0px))',
      }}>
        {/* Safe Area Top */}
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />

        {/* ====== AppBar ====== */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'var(--color-neutral-000)',
        }}>
          <div style={{
            height: 60,
            padding: '0 16px 0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <img src="/logo.svg" alt="bankcow" style={{ height: 24, width: 120 }} />
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <img src="/icons/AppBarItem/Notification Icon.svg" alt="알림" style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* ====== Banner ====== */}
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{
            width: '100%',
            height: 120,
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src="/banner.png"
              alt="배너"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Indicator */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 100,
              padding: '0 8px',
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'Pretendard',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '18px' }}>{bannerIndex + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>/</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '18px' }}>{bannerCount}</span>
            </div>
          </div>
        </div>

        {/* ====== 투자 신청중 + 계좌 잔액 ====== */}
        <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* 투자 신청중 */}
          <div style={{
            backgroundColor: '#e8f0ff',
            borderRadius: 16,
            height: 56,
            padding: '0 20px 0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <img src="/product.png" alt="" style={{ width: 44, height: 33, objectFit: 'cover', flexShrink: 0 }} />
              <span style={{
                ...T.body17('semibold'),
                color: 'var(--color-primary-400)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}>투자 신청중</span>
            </div>
            <span style={{
              ...T.body17('semibold'),
              color: 'var(--color-primary-500)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>20,000원</span>
          </div>

          {/* 계좌 잔액 */}
          <div style={{
            backgroundColor: 'var(--color-neutral-050)',
            borderRadius: 16,
            height: 56,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-600)' }}>계좌 잔액</span>
            <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>200,000원</span>
          </div>
        </div>

        {/* ====== 투자중 금액 ====== */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>투자중 금액</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <span style={{
              ...T.headline32(),
              color: 'var(--color-neutral-900)',
              whiteSpace: 'nowrap',
            }}>1,760,000원</span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {/* ====== 투자 아이템 ====== */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 아이콘 */}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: '#dae7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img src="/product.png" alt="" style={{ width: 40, height: 30, objectFit: 'cover' }} />
            </div>
            {/* 텍스트 */}
            <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>유전지수 높은 상품</span>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>4개월 남음</span>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>20,000원</span>
                <span style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1주</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page indicator dots */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20, gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-neutral-800)' }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-neutral-200)' }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-neutral-200)' }} />
        </div>

        {/* ====== 자세히 보기 ====== */}
        <div style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '1px solid var(--color-neutral-050)',
          cursor: 'pointer',
        }}>
          <span style={{ ...T.body17(), color: 'var(--color-neutral-600)' }}>자세히 보기</span>
        </div>

        {/* ====== Divider ====== */}
        <div style={{ height: 12, backgroundColor: 'var(--color-neutral-050)' }} />

        {/* ====== 모집중인 상품 ====== */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>모집중인 상품</span>

          {/* Product Card */}
          <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            padding: 8,
            background: 'linear-gradient(90deg, rgba(68,135,255,0.2), rgba(68,135,255,0.2)), linear-gradient(90deg, #fff, #fff)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {/* Image area */}
            <div style={{
              padding: '8px 8px 0',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              {/* Timer badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'var(--color-neutral-000)',
                borderRadius: 40,
                padding: '5px 12px 5px 8px',
                alignSelf: 'flex-start',
              }}>
                <img src="/icons/icon.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-900)', whiteSpace: 'nowrap' }}>13일 23:59:59 남음</span>
              </div>

              {/* Product image */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
                <img src="/product.png" alt="상품" style={{ width: 186, height: 140, objectFit: 'cover' }} />
              </div>

              {/* User count badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(255,255,255,0.64)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  borderRadius: 16,
                  padding: '5px 12px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-800)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>9,999명 투자중</span>
                </div>
              </div>
            </div>

            {/* Info card */}
            <div style={{
              backgroundColor: 'var(--color-neutral-000)',
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: '0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)',
            }}>
              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>A 투자 상품</span>
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: 'var(--color-neutral-050)',
                  borderRadius: 6,
                  padding: '0 8px',
                  height: 20,
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-700)' }}>10마리 투자상품</span>
                </div>
              </div>

              {/* Price + Deadline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>1C 금액</span>
                  <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-900)' }}>20,000원~</span>
                </div>
                <div style={{ width: 1, height: 36, backgroundColor: 'var(--color-neutral-100)' }} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>마감 일자</span>
                  <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-900)' }}>2023.12.31</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: 6,
                  backgroundColor: 'var(--color-neutral-200)',
                  borderRadius: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '33%',
                    height: 6,
                    backgroundColor: 'var(--color-neutral-700)',
                    borderRadius: 7,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
                    <span style={{ color: 'var(--color-neutral-700)' }}>8,475 </span>
                    <span style={{ color: 'var(--color-neutral-500)' }}>/ 25,278C</span>
                  </span>
                  <div style={{
                    backgroundColor: 'var(--color-neutral-050)',
                    borderRadius: 8,
                    padding: '0 8px',
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-700)' }}>모집중</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== 마감 상품 ====== */}
        <div style={{ paddingTop: 20, paddingBottom: 120 }}>
          <div style={{ padding: '0 16px 16px' }}>
            <span style={{ ...T.title20('bold'), color: 'var(--color-neutral-900)' }}>마감 상품</span>
          </div>

          {/* Horizontal scroll */}
          <div
            ref={closedScrollRef}
            className="v7-hide-scrollbar"
            style={{
              display: 'flex',
              gap: 16,
              overflowX: 'auto',
              padding: '0 16px',
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 16px',
            }}
          >
            {[0, 1].map((i) => (
              <div key={i} style={{
                width: 320,
                minWidth: 320,
                borderRadius: 20,
                overflow: 'hidden',
                padding: 8,
                background: 'linear-gradient(90deg, rgba(68,135,255,0.2), rgba(68,135,255,0.2)), linear-gradient(90deg, #fff, #fff)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                scrollSnapAlign: 'start',
                position: 'relative',
              }}>
                {/* Image area */}
                <div style={{
                  height: 178,
                  padding: '8px 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img src="/product.png" alt="상품" style={{ width: 186, height: 140, objectFit: 'cover' }} />
                </div>

                {/* Dark overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(7,23,51,0.5)',
                  borderRadius: 20,
                  pointerEvents: 'none',
                }} />

                {/* Achievement text */}
                <div style={{
                  position: 'absolute',
                  top: 81,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  ...T.headline24('semibold'),
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}>120% 투자 달성</div>

                {/* Info card */}
                <div style={{
                  backgroundColor: 'var(--color-neutral-000)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  {/* Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{
                      ...T.title20('semibold'),
                      color: 'var(--color-neutral-900)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>유전지수 높은 상품 유전지수 높은 상품</span>
                    <div style={{
                      display: 'inline-flex',
                      backgroundColor: 'var(--color-neutral-050)',
                      borderRadius: 6,
                      padding: '0 8px',
                      height: 20,
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-700)' }}>10마리 투자상품</span>
                    </div>
                  </div>

                  {/* Price + Deadline */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>1C 금액</span>
                      <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-900)' }}>50,000원~</span>
                    </div>
                    <div style={{ width: 1, height: 36, backgroundColor: 'var(--color-neutral-100)' }} />
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-600)' }}>마감 일자</span>
                      <span style={{ fontSize: 18, fontWeight: 600, lineHeight: '26px', color: 'var(--color-neutral-900)' }}>2023.12.31</span>
                    </div>
                  </div>

                  {/* Progress bar - deadline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: 'var(--color-neutral-200)',
                      borderRadius: 100,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: '100%',
                        height: 6,
                        backgroundColor: 'var(--color-neutral-800)',
                        borderRadius: 7,
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
                        <span style={{ color: 'var(--color-neutral-800)' }}>8,475 </span>
                        <span style={{ color: 'var(--color-neutral-500)' }}>/ 25,278C</span>
                      </span>
                      <div style={{
                        backgroundColor: 'var(--color-neutral-800)',
                        borderRadius: 8,
                        padding: '0 8px',
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 500, lineHeight: '20px', color: 'var(--color-neutral-000)' }}>마감</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== TabBar ====== */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-neutral-000)',
        borderTop: '1px solid var(--color-neutral-050)',
        zIndex: 20,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: 4,
          padding: '4px 20px 0',
        }}>
          {/* 홈 (selected) */}
          <TabBarItem icon="home" label="홈" selected />
          {/* 쇼핑 */}
          <TabBarItem icon="shopping" label="쇼핑" />
          {/* 마이 */}
          <TabBarItem icon="my" label="마이" />
        </div>
        {/* Safe area bottom */}
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
      </div>
    </div>
  )
}

function TabBarItem({ icon, label, selected = false }) {
  const color = selected ? 'var(--color-neutral-800)' : 'var(--color-neutral-600)'
  const iconMap = {
    home: '/icons/TabBarItem/TabBarIcon/Home.svg',
    shopping: '/icons/TabBarItem/TabBarIcon/Shopping.svg',
    my: '/icons/TabBarItem/TabBarIcon/My.svg',
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 43,
      padding: '2px 4px 0',
      cursor: 'pointer',
    }}>
      <img src={iconMap[icon]} alt={label} style={{ width: 24, height: 24 }} />
      <span style={{
        ...T.label11(),
        color,
        textAlign: 'center',
      }}>{label}</span>
    </div>
  )
}
