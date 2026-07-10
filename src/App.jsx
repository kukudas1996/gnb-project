const pages = import.meta.glob('./pages/*/index.jsx', { eager: true })

const versions = [
  { key: 'v1', label: 'V1', desc: '고정 투자 메시지 및 뎁스형' },
  { key: 'v2', label: 'V2', desc: '다이나믹 메시지 및 뎁스형' },
  { key: 'v3', label: 'V3', desc: '다이나믹 메시지 및 탭바형' },
  { key: 'v4', label: 'V4', desc: '홈 개편 및 잠금화면 푸시' },
  { key: 'v5', label: 'V5', desc: '주문형 투자 신청 및 내역' },
  { key: 'v6', label: 'V6', desc: '모바일 웹 버전 투자 플로우' },
  { key: 'v7', label: 'V7', desc: 'UI 고도화 버전' },
  { key: 'v8', label: 'V8', desc: '홈 리스트형 + 퀵버튼' },
  { key: 'v9', label: 'V9', desc: '자산 탭 분리 (5탭)' },
]

function HomePage() {
  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--color-neutral-000)',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        padding: '60px 24px 24px',
      }}>
        <div style={{
          fontSize: 'var(--font-headline28-bold-size)',
          lineHeight: 'var(--font-headline28-bold-line-height)',
          fontWeight: 'var(--font-headline28-bold-weight)',
          color: 'var(--color-neutral-900)',
          marginBottom: 6,
        }}>
          GNB 프로토타입
        </div>
        <div style={{
          fontSize: 'var(--font-body15-medium-size)',
          lineHeight: 'var(--font-body15-medium-line-height)',
          fontWeight: 'var(--font-body15-medium-weight)',
          color: 'var(--color-neutral-600)',
        }}>
          버전을 선택해 테스트해보세요
        </div>
      </div>

      <div style={{ padding: '0 16px 60px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {versions.map(({ key, label, desc }) => (
          <a
            key={key}
            href={`/${key}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 20px',
              backgroundColor: 'var(--color-neutral-050)',
              borderRadius: 16,
              textDecoration: 'none',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'var(--color-primary-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontSize: 'var(--font-body17-bold-size)',
                fontWeight: 'var(--font-body17-bold-weight)',
                color: '#fff',
              }}>{label}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--font-body17-semibold-size)',
                lineHeight: 'var(--font-body17-semibold-line-height)',
                fontWeight: 'var(--font-body17-semibold-weight)',
                color: 'var(--color-neutral-900)',
                marginBottom: 2,
              }}>
                {desc}
              </div>
              <div style={{
                fontSize: 'var(--font-label13-medium-size)',
                lineHeight: 'var(--font-label13-medium-line-height)',
                fontWeight: 'var(--font-label13-medium-weight)',
                color: 'var(--color-neutral-500)',
              }}>
                /{key}
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}

function App() {
  const path = window.location.pathname
  const match = path.match(/^\/(v\d+)/)

  if (!match) return <HomePage />

  const version = match[1]
  const key = `./pages/${version}/index.jsx`
  const Page = pages[key]?.default

  if (!Page) return <div style={{ padding: 24 }}>페이지 없음: /{version}</div>
  return <Page />
}

export default App
