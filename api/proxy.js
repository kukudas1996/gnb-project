export default async function handler(req, res) {
  const url = req.query.url
  if (!url || !url.startsWith('https://blog.naver.com/')) {
    return res.status(400).send('Invalid URL')
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    })
    const html = await response.text()

    // Remove X-Frame-Options by serving from our own domain
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).send(html)
  } catch (e) {
    res.status(500).send('Fetch failed')
  }
}
