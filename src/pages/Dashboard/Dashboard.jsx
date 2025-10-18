import { useContext, useEffect, useState } from 'react';
import useGet from '../../hooks/useGet/useGet';
import logo from '../../assets/logo.png';


export default function Dashboard() {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="text-center space-y-8 p-8">
        {/* Logo Container with Animation */}
        <div className="flex justify-center items-center">
          <div className="relative group">
            {/* Animated Background Circle */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
            
            {/* Logo */}
            <div className="relative bg-white rounded-full p-8 shadow-2xl transform transition-all duration-500 group-hover:scale-105">
              <img 
                src={logo} 
                alt="Logo de la empresa" 
                className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Bienvenido
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto">
            Sistema de Administración GlobalAdmin
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full animate-pulse"></div>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full animate-pulse delay-75"></div>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
