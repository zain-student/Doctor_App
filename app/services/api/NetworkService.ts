import Config from 'app/config';
import {mmkvStorage} from 'app/utils/UserContext';

export const getRequest = async (endpoint: string) => {
  let response = await fetch(Config.API_URL + 'api/' + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mmkvStorage.getString('authToken')}`,
    },
  });
  let jsonResp = await response.json();
  return jsonResp;
};

export const postRequest = async (endpoint: string, data: {}) => {
  let response = await fetch(Config.API_URL + 'api/' + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mmkvStorage.getString('authToken')}`,
    },
    body: JSON.stringify(data),
  });
  let jsonResp = await response.json();
  return jsonResp;
};
