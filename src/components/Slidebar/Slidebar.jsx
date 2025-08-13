import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { logout } from '../../utils/store/AccessTokenStore';
import logo from '../../assets/logo.png';

import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BuildingOffice2Icon, 
  PaperAirplaneIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';


import { useMsal } from '@azure/msal-react';
import { CpuChipIcon } from '@heroicons/react/20/solid';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Slidebar({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuthContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userMicrosoft, setUserMicrosoft] = useState();

  const { accounts } = useMsal();

   useEffect(() => {
    if (accounts.length > 0) {
      setUserMicrosoft(accounts[0]);
    }
  }, [accounts]);
  
  const navigationLogout = [
    { name: 'Login', to: '/', icon: HomeIcon, current: true },
  ];

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Clientes', to: '/clients', icon: BuildingOffice2Icon, current: false },
    { name: 'Contactos', to: '/contacts', icon: UsersIcon, current: false },
    { name: 'Materiales', to: '/materials', icon: CpuChipIcon, current: false },
    { name: 'Pedidos', to: '/orders', icon: FolderIcon, current: false },
    { name: 'Compras', to: '/purchases/purchasesList', icon: CurrencyDollarIcon, current: false },
    { name: 'Envíos', to: '#', icon: PaperAirplaneIcon, current: false },
    { name: 'Configuraciones', to: '/configurations', icon: CalendarIcon, current: false },
  ];

  const [navigationToShow, setNavigationToShow] = useState(navigationLogout)

  
  const handleLogout = () => {
    logoutUser(); // ✅ This clears token and context state

    if (user?.source === 'microsoft') {
      instance.logoutRedirect({
        postLogoutRedirectUri: '/',
      });
    } else {
      setNavigationToShow(navigationLogout);
    }
};

  useEffect(() => {
      if(user){
        setNavigationToShow(navigation)
      }
    }, [user]); // Adjust the delay as needed




  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}

 {/* Para Móvil */}      
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className='relative z-50 lg:hidden'>
          <DialogBackdrop
            transition
            className='data-closed:opacity-0 fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear'
          />

          <div className='fixed inset-0 flex'>
            <DialogPanel
              transition
              className='data-closed:-translate-x-full relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out'>
              <TransitionChild>
                <div className='data-closed:opacity-0 absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out'>
                  <button
                    type='button'
                    onClick={() => setSidebarOpen(false)}
                    className='-m-2.5 p-2.5'>
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon aria-hidden='true' className='size-6 text-white' />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10'>
                <div className='flex h-16 shrink-0 items-center'>
                  <img alt='Your Company' src={logo} className='h-8 w-auto' />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                    
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigationToShow.map((item) => (
                            <li key={item.name}>
                              <Link 
                                key={item.name}
                                to={item.to}
                                onClick={()=> setSidebarOpen(false)}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                )}>
                                <item.icon aria-hidden='true' className='size-6 shrink-0' />
                                {item.name}
                            </Link>
                            </li>
                          ))}
                        </ul>

                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

      


{/* Static Slidebar Desktop */}

        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6'>
            <div className='flex h-16 shrink-0 items-center'>
             <img alt='Your Company' src={logo} className='h-8 w-auto' />
            </div>

          <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
 
                    <ul role="list" className="-mx-2 space-y-1">
                          {navigationToShow.map((item) => (
                            <li key={item.name}>
                              <Link 
                                key={item.name}
                                to={item.to}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                )}>
                                <item.icon aria-hidden='true' className='size-6 shrink-0' />
                                {item.name}
                            </Link>
                            </li>
                          ))}
                        </ul>
    
                </li>
              </ul>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-x-4 px-6 p-5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <span className='text-xs font-medium leading-none text-white'>
                      {user ? user?.name?.slice(0, 1).toUpperCase() : "X"}
                  </span>
                  <span className='text-md font-medium leading-none text-white'>
                      {user ? user.name : "Bienvenido"}
                  </span>
                </button>

                {user && isDropdownOpen ? (
                  <div className="absolute top-0 left-0 transform -translate-y-full bg-white shadow-lg rounded-md py-2">
                    <Link
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tu Perfil
                    </Link>
                    <Link
                     onClick={() => {
                        handleLogout();
                        setDropdownOpen((prev) => !prev);
                      }}
                      to={"/"}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                ) : (<></>)
                
                }
              </div>
            </nav>
          </div>
        </div>


 {/* Para Móvil */}

       <div className='shadow-xs sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 sm:px-6 lg:hidden'>
          <button
            type='button'
            onClick={() => setSidebarOpen(true)}
            className='-m-2.5 p-2.5 text-gray-400 lg:hidden'
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon aria-hidden='true' className='size-6' />
          </button>

          <div className='flex-1 text-sm/6 font-semibold text-white'>Dashboard</div>

          {/* Dropdown Trigger and Parent */}
          <div className='relative'>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className='flex items-center gap-x-4 px-6 p-5 text-sm font-semibold text-white hover:bg-gray-800'
            >
              <span className='text-xs font-medium leading-none text-white'>
                {user ? user?.name?.slice(0, 1).toUpperCase() : 'X'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {user && isDropdownOpen && (
              <div
                className='absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md py-2'
                style={{ transform: 'translateX(-50%)' }} // Adjust for perfect alignment
              >
                <Link
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  to='/profile'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                >
                  Perfil
                </Link>
                <Link
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen((prev) => !prev);
                  }}
                  to="/"
                  className='block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100'
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        <main className='py-3 lg:pl-72'>
          <div className='px-4 sm:px-3 lg:px-8'>{ children }</div>
        </main>
      </div>
    </>
  );
}