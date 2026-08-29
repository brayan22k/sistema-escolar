const BASE = process.env.API_BASE || 'http://localhost:3000';

function stamp() {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE}${path}`, options);
  } catch (error) {
    const err = new Error(`Falha de rede ao chamar ${method} ${path}: ${error.message}`);
    err.network = true;
    throw err;
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { status: response.status, data, ok: response.ok, url: `${method} ${path}` };
}

export { BASE, request, stamp };
