import createHttp from './BaseServices';

const http = createHttp(true);

export const login = async (data) => {
  const response = await http.post('/auth/user', data);
  return response;
};

export const getCurrentUser = async () => {
  try {
    const response = await http.get('/auth/user/me');
    return response;
  } catch (error) {
    console.log(error);
  }
};
