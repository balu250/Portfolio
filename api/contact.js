/**
 * Vercel Serverless Function: POST /api/contact
 * Handles contact message submission and emails it directly to balajisheety08@gmail.com via Web3Forms.
 */

module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle browser pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body || {};

    // 1. Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required and must be at least 2 characters.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message of at least 5 characters.'
      });
    }

    // 2. Check for Web3Forms Access Key
    // You can set WEB3FORMS_ACCESS_KEY in Vercel Project Settings -> Environment Variables
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    // Log received submission into Vercel runtime logs for audit
    console.log('📬 Contact message received on Vercel:', {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : 'N/A',
      message: message.trim(),
      receivedAt: new Date().toISOString()
    });

    if (!accessKey) {
      console.warn('⚠️ WEB3FORMS_ACCESS_KEY is not set in Vercel environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Email service is not yet configured. Please set WEB3FORMS_ACCESS_KEY in your Vercel project environment variables.'
      });
    }

    // 3. Dispatch to Web3Forms API to send email to balajisheety08@gmail.com
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : 'Not provided',
          message: message.trim(),
          from_name: 'Balaji Portfolio Website',
          subject: `New Portfolio Message from ${name.trim()}`
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return res.status(200).json({
          success: true,
          message: 'Thank you! Your message has been sent to Balaji. He will get back to you soon!'
        });
      } else {
        console.error('Web3Forms returned an error:', result);
        return res.status(400).json({
          success: false,
          message: result.message || 'Unable to send message via email provider.'
        });
      }
    } catch (err) {
      console.error('Error forwarding message to Web3Forms:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while transmitting your message to the email server. Please try again.'
      });
    }
  }

  // Fallback GET
  return res.status(200).json({
    status: 'online',
    portfolio: 'Balaji M',
    service: 'Vercel Serverless Contact API'
  });
};
