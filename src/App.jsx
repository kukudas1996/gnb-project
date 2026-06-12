const pages = import.meta.glob('./pages/*/index.jsx', { eager: true })

function App() {
  const match = window.location.pathname.match(/^\/(v\d+)/)
  const version = match ? match[1] : 'v1'
  const key = `./pages/${version}/index.jsx`
  const Page = pages[key]?.default

  if (!Page) return <div style={{ padding: 24 }}>페이지 없음: /{version}</div>
  return <Page />
}

export default App
