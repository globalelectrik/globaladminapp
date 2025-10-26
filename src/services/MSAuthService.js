
const CLIENTID = import.meta.env.VITE_AZURE_CLIENT_ID
const TENATNTID = import.meta.env.VITE_AZURE_TENANT_ID


export const msalConfig = {
  auth: {
    clientId: CLIENTID,
    authority: `https://login.microsoftonline.com/${TENATNTID}`,
    //TESTING PURPOSES ONLY
    //redirectUri: "http://localhost:3000",
    //PRODUCTION PURPOSES ONLY
    redirectUri: "http://globaladminapp.vercel.app",
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};