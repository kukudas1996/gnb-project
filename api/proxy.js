export default async function handler(req, res) {
  const url = req.query.url
  if (!url || !url.includes('blog.naver.com/')) {
    return res.status(400).send('Invalid URL')
  }

  // Always use mobile blog URL
  const mobileUrl = url.replace('blog.naver.com/', 'm.blog.naver.com/')

  try {
    const response = await fetch(mobileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow',
    })
    let html = await response.text()

    // Remove frame-busting scripts (top.location, parent.location)
    html = html.replace(/top\.location\s*[\.\=]/gi, 'void(0)//')
    html = html.replace(/parent\.location\s*[\.\=]/gi, 'void(0)//')
    html = html.replace(/window\.top/gi, 'window.self')

    // Inject base tag so relative URLs resolve correctly
    html = html.replace('<head>', `<head><base href="https://m.blog.naver.com/" target="_self">`)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).send(html)
  } catch (e) {
    res.status(500).send('Fetch failed: ' + e.message)
  }
}
