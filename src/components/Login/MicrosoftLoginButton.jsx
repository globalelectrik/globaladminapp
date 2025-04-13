// MicrosoftLoginButton.jsx
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../services/MSAuthService';
import { ShieldCheckIcon } from 'lucide-react';

export function MicrosoftLoginButton() {
  const { instance } = useMsal();

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  return <button className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' onClick={login}> <ShieldCheckIcon className='mr-2'/> Login with Microsoft</button>;
}