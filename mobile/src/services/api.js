import { getToken, deleteToken } from './storage';

export const authenticatedFetch = async (url, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    await deleteToken();
    // In a real app we would redirect to login, but since this is 
    // a simple helper we just let the component handle the 401
  }
  
  return response;
};
