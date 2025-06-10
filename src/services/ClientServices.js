import createHttp from './BaseServices';
const http = createHttp(true);

export async function getClients() {
  const response = await http.get('/clients');
  return response;
}
export async function getClientById(id) {
  const response = await http.get(`/clients/clientDetail/${id}`);
  return response;
}
export async function createClient(data) {
  const response = await http.post('/clients/createClient', data);
  return response;
}