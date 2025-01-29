
// api/verify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Only allow POST
    return res.status(405).send('Method Not Allowed');
  }

  // 1. Extract hCaptcha token from form
  const token = req.body['h-captcha-response'];
  if (!token) {
    return res.status(400).send('hCaptcha token not found. Please complete the captcha.');
  }

  // 2. Your hCaptcha Secret Key
  const secretKey = process.env.ES_89aec60e04a34b69963632f56421ebfb; 
  // Make sure you've set this in your Vercel project environment variables
  // e.g. Vercel Dashboard > Settings > Environment Variables

  // 3. Verify with hCaptcha
  try {
    const verifyUrl = 'https://hcaptcha.com/siteverify';

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
        // You can optionally pass 'remoteip': req.headers['x-forwarded-for'] or similar
      })
    });

    const data = await response.json();

    if (data.success) {
      // hCaptcha passed!
      // You can redirect or return a success message
      return res.redirect('https://wemust.com/'); 
      // Make sure you actually have a "protected.html" in your "public" folder
    } else {
      // hCaptcha failed. Possibly a bot, or an error
      return res.status(401).send('CAPTCHA verification failed. Please try again.');
    }

  } catch (err) {
    console.error('Error verifying hCaptcha:', err);
    return res.status(500).send('Server error verifying hCaptcha.');
  }
}
