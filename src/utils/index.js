import axios from 'axios';
import { ACCOUNT_ID, REQUEST_TOKEN, SESSION_ID, TMDB_API_BASE_URL } from '../constants';

export const moviesApi = axios.create({
  baseURL: TMDB_API_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
  },
});

export const fetchToken = async () => {
  try {
    const { data } = await moviesApi.get('/authentication/token/new');
    const token = data.request_token;
    if (data.success) {
      localStorage.setItem(REQUEST_TOKEN, token);
      window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/approved`;
    }
  } catch (error) {
    console.log('Sorry, your token could not be created.');
  }
};

export const createSeesionId = async () => {
  const token = localStorage.getItem(REQUEST_TOKEN);
  if (token) {
    try {
      const { data: { session_id } } = await moviesApi.post('/authentication/session/new', { request_token: token });
      if (session_id) {
        localStorage.setItem(SESSION_ID, session_id);
      }
      return session_id;
    } catch (error) {
      console.log(error);
    }
  }
  return undefined;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_ID);
  localStorage.removeItem(ACCOUNT_ID);
  localStorage.removeItem(REQUEST_TOKEN);
  window.location.href = '/';
};
