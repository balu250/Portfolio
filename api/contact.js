/**
 * Vercel Serverless Function: POST /api/contact
 * Handles contact message submission in cloud deployment on Vercel.
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

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all the details above.'
      });
    }

    console.log('New message received on Vercel:', {
      name,
      email,
      phone,
      message,
      receivedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent. Balaji will get back to you soon!'
    });
  }

  // Fallback GET
  return res.status(200).json({
    status: 'online',
    portfolio: 'Balaji M'
  });
};
