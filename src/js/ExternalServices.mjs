const baseURL = "https://wdd330-backend.onrender.com/";
//const baseURL = "http://server-nodejs.cit.byui.edu:3000/";

async function convertToJson(res) {
  const data = await res.json()
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data};
  }
}

export default class ExternalServices {
  constructor() {
    
  }
  
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
}

  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };
    return await fetch (baseURL + "checkout/", options).then(convertToJson);
  }

  async loginRequest(creds) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    };
    const response = await fetch (baseURL + "login", options).then(convertToJson);
    return response.accessToken;
  }

  async getOrders(token) {
    const options = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      },      
    };
    const response = await fetch (baseURL + "orders", options).then(convertToJson);
    return response;
  }
  
}

