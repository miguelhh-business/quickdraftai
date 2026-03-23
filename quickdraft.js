exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://quickdraftai.org',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Only allow requests from quickdraftai.org
  const origin = event.headers.origin || event.headers.Origin || '';
  const allowedOrigins = [
    'https://quickdraftai.org',
    'https://www.quickdraftai.org',
    'https://miguelhh-business.github.io'
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.QUICKDRAFT_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
