// api/verify.js
export default async function handler(req, res) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // 2. Extract the hCaptcha token from the form
  //    The name must match the field name in your HTML ("h-captcha-response")
  const token = req.body['h-captcha-response'];
  if (!token) {
    return res.status(400).send('Missing hCaptcha token. Please complete the captcha.');
  }

  // 3. Your hCaptcha Secret Key
  //    Make sure you've set this in Vercel's environment variables (Settings → Environment Variables).
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('No hCaptcha secret key found in environment variables!');
    return res.status(500).send('Server misconfiguration. Missing secret key.');
  }

  try {
    // 4. Send a POST to hCaptcha's verification endpoint
    const verifyUrl = 'https://hcaptcha.com/siteverify';
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
        // Optionally: 'remoteip': req.headers['x-forwarded-for'] or similar
      })
    });

    // 5. Parse the JSON returned by hCaptcha
    const data = await response.json();

    // 6. Check if "success" is true
    if (data.success) {
      // hCaptcha is valid. Redirect or send a success message.
      return res.redirect('https://wemust.com/');
    } else {
      // hCaptcha failed. Possibly a bot or an error in the token.
      console.log('hCaptcha verification error:', data);
      return res.status(401).send('CAPTCHA verification failed. Please try again.');
    }

  } catch (err) {
    console.error('Error verifying hCaptcha:', err);
    return res.status(500).send('Internal server error during hCaptcha verification.');
  }
}
