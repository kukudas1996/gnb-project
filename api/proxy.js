export default async function handler(req, res) {
  const url = req.query.url
  if (!url || !url.includes('blog.naver.com')) {
    return res.status(400).send('Invalid URL')
  }

  // Ensure mobile URL, avoid double m. prefix
  let targetUrl = url
  if (!targetUrl.includes('m.blog.naver.com')) {
    targetUrl = targetUrl.replace('blog.naver.com', 'm.blog.naver.com')
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    let html = await response.text()

    // Remove frame-busting scripts
    html = html.replace(/top\.location/gi, 'self.location_disabled')
    html = html.replace(/parent\.location/gi, 'self.location_disabled')
    html = html.replace(/window\.top/gi, 'window.self')

    // Inject base tag so relative URLs resolve correctly
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head><base href="https://m.blog.naver.com/" target="_self">')
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).send(html)
  } catch (e) {
    return res.status(500).send('Fetch failed: ' + e.message)
  }
}
