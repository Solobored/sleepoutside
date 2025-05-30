const baseURL = import.meta.env.VITE_SERVER_URL || "http://wdd330-backend.onrender.com/";

// Add this helper function at the top of your file
function buildUrl(baseUrl, path) {
  // Remove trailing slash from base URL if it exists
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Remove leading slash from path if it exists
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  return `${base}${endpoint}`;
}

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // constructor
  }
  
  async getData(category = null) {
  const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';
  const path = category ? `products/search/${category}` : 'products';
  const url = buildUrl(baseURL, path);
  
  return fetch(url)
    .then(convertToJson)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}
  
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    return await fetch(baseURL + "checkout", options).then(convertToJson);
  }
}
