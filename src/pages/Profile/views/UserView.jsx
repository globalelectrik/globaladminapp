import { useContext, useEffect, useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';


export default function UserView() {

  const { user, logoutUser } = useAuthContext();
  console.log(user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold">Perfil de Usuario</h1>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-gray-600">{user?.name}</p>
        <p className="text-gray-600">{user?.userType}</p>
        <button
          onClick={logoutUser}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
