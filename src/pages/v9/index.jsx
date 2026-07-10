import { useState } from 'react'

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
  `
  document.head.appendChild(style)
}

const T = {
  headline24: (w = 'bold') => ({ fontSize: `var(--font-headline24-${w}-size)`, lineHeight: `var(--font-headline24-${w}-line-height)`, fontWeight: `var(--font-headline24-${w}-weight)` }),
  title20: (w = 'bold') => ({ fontSize: `var(--font-title20-${w}-size)`, lineHeight: `var(--font-title20-${w}-line-height)`, fontWeight: `var(--font-title20-${w}-weight)` }),
  body17: (w = 'medium') => ({ fontSize: `var(--font-body17-${w}-size)`, lineHeight: `var(--font-body17-${w}-line-height)`, fontWeight: `var(--font-body17-${w}-weight)` }),
  body15: (w = 'medium') => ({ fontSize: `var(--font-body15-${w}-size)`, lineHeight: `var(--font-body15-${w}-line-height)`, fontWeight: `var(--font-body15-${w}-weight)` }),
  label13: (w = 'medium') => ({ fontSize: `var(--font-label13-${w}-size)`, lineHeight: `var(--font-label13-${w}-line-height)`, fontWeight: `var(--font-label13-${w}-weight)` }),
  label11: (w = 'medium') => ({ fontSize: `var(--font-label11-${w}-size)`, lineHeight: `var(--font-label11-${w}-line-height)`, fontWeight: `var(--font-label11-${w}-weight)` }),
}

const ChevronRightIcon = ({ size = 20, color = 'var(--color-neutral-400)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
)

export default function V9App() {
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
          <div style={{ height: 60, padding: '0 16px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              {/* 타이머 + 이미지 + 투자자수 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* 타이머 뱃지 */}
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--color-neutral-000)', borderRadius: 40, padding: '5px 12px 5px 8px' }}>
                    <img src="/icons/time.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>13일 23:59:59 남음</span>
                  </div>
                </div>
                {/* 상품 이미지 */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  <img src="/images/product-a.png" alt="" style={{ width: 159, height: 120, objectFit: 'cover' }} />
                </div>
                {/* 투자자수 뱃지 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,1)', borderRadius: 16, padding: '5px 12px 5px 8px' }}>
                    <img src="/icons/person.svg" alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ ...T.body15(), color: 'var(--color-neutral-800)', whiteSpace: 'nowrap' }}>600명 투자중</span>
                  </div>
                </div>
              </div>

              {/* 상품 정보 카드 */}
              <div style={{ backgroundColor: 'var(--color-neutral-000)', borderRadius: 16, padding: '16px 24px', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* 타이틀 + 태그 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ ...T.title20('semibold'), color: 'var(--color-neutral-900)' }}>유전지수 높은 상품</span>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 500, lineHeight: '18px', color: 'var(--color-neutral-700)', backgroundColor: 'var(--color-neutral-050)', borderRadius: 6, padding: '0 8px', display: 'inline-flex', alignItems: 'center', height: 20 }}>10마리 투자상품</span>
                  </div>
                </div>
                {/* 1주당 금액 | 마감 일자 */}
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
                {/* 프로그레스 바 */}
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
            {/* 신청 중인 투자 */}
            <div style={{ backgroundColor: '#e8f0ff', borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <img src="/images/product-a.png" alt="" style={{ width: 43, height: 32, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>신청 중인 투자</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <span style={{ ...T.body17('semibold'), color: 'var(--color-primary-500)', whiteSpace: 'nowrap' }}>60,000원</span>
                <ChevronRightIcon size={20} color="var(--color-primary-500)" />
              </div>
            </div>

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
            {/* 한약재 먹으며 건강히 키우는 상품 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#fcdede', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '0 2px' }}>
                <img src="/images/product-herbal.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 25 }}>한약재 먹으며 건강히 키우는 상품</div>
                  <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1년 5개월 남음</div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
                  <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>100,000원</div>
                  <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>5주</div>
                </div>
              </div>
            </div>

            {/* 5성급 축사에서 키우는 상품 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#fbe6d0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '0 2px' }}>
                <img src="/images/product-premium.png" alt="" style={{ width: '100%', aspectRatio: '40/30', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flex: 1, minWidth: 0, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 25 }}>5성급 축사에서 키우는 상품</div>
                  <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>1년 8개월 남음</div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', textAlign: 'right' }}>
                  <div style={{ ...T.body17('semibold'), color: 'var(--color-neutral-800)' }}>100,000원</div>
                  <div style={{ ...T.body15(), color: 'var(--color-neutral-600)' }}>5주</div>
                </div>
              </div>
            </div>

            {/* 자세히 보기 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
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
                  {/* 이미지 영역 + 오버레이 텍스트 */}
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12, height: 152 }}>
                    <img src="/images/product-a.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ ...T.title20('semibold'), color: '#fff', textAlign: 'center' }}>120% 투자 달성</span>
                    </div>
                  </div>
                  {/* 정보 카드 */}
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
          <TabBarItem icon="shopping" label="상점" />
          <TabBarItem icon="my" label="마이" />
        </div>
        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }} />
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
