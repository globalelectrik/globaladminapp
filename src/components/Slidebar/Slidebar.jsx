import { Fragment, useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuthContext } from '../../context/AuthContext';
import { logout } from '../../utils/store/AccessTokenStore';
import { Link } from 'react-router-dom';


const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon, current: true },
  { name: 'Clientes', to: '#', icon: UsersIcon, current: false },
  { name: 'Pedidos', to: '/orders', icon: FolderIcon, current: false },
  { name: 'Envíos', to: '#', icon: CalendarIcon, current: false },
  { name: 'Configuraciones', to: '/configurations', icon: CalendarIcon, current: false },
];
const teams = [
  { id: 1, name: 'Heroicons', to: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', to: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', to: '#', initial: 'W', current: false },
];

const navigationLogout = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
];

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthContext();

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className='relative z-50 lg:hidden'>
          <Dialog.Backdrop
            transition
            className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
          />

          <div className='fixed inset-0 flex'>
            <Dialog.Panel
              transition
              className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'>
              <Transition show={sidebarOpen}>
                <div className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
                  <button
                    type='button'
                    onClick={() => setSidebarOpen(false)}
                    className='-m-2.5 p-2.5'>
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon aria-hidden='true' className='size-6 text-white' />
                  </button>
                </div>
              </Transition>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10'>
                <div className='flex h-16 shrink-0 items-center'>
                  <img
                    alt='Your Company'
                    src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500'
                    className='h-8 w-auto'
                  />
                </div>
                {user ? (
                  <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                      <li>
                        <ul role='list' className='-mx-2 space-y-1'>
                          {navigation.map((item) => (
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
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className='text-xs/6 font-semibold text-gray-400'>Your teams</div>
                        <ul role='list' className='-mx-2 mt-2 space-y-1'>
                          {teams.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                )}>
                                <span className='flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white'>
                                  {team.initial}
                                </span>
                                <span className='truncate'>{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                ) : (
                  <></>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6'>
            <div className='flex h-16 shrink-0 items-center'>
              <img
                alt='Your Company'
                src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500'
                className='h-8 w-auto'
              />
            </div>

            <nav className='flex flex-1 flex-col'>
              <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                  <ul role='list' className='-mx-2 space-y-1'>
                    {user?.name
                      ? navigation.map((item) => (
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
                        ))
                      : navigationLogout.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                              )}>
                              <item.icon aria-hidden='true' className='size-6 shrink-0' />
                              {item.name}
                            </a>
                          </li>
                        ))}
                  </ul>
                </li>
                {/* <li>
                  <div className='text-xs/6 font-semibold text-gray-400'>Your teams</div>
                  <ul role='list' className='-mx-2 mt-2 space-y-1'>
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                          )}>
                          <span className='flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white'>
                            {team.initial}
                          </span>
                          <span className='truncate'>{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li> */}
                <li className='mt-auto p-5'>
                  <Menu as='div' className='relative'>
                    <Menu.Button className='-m-1.5 flex items-center p-1.5'>
                      <span className='sr-only'>Open user menu</span>
                      <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500'>
                        {user ? (
                          <span className='text-xs font-medium leading-none text-white'>
                            {user.name?.slice(0, 1).toUpperCase()}
                          </span>
                        ) : (
                          <UserCircleIcon className='h-5 w-5 text-white' aria-hidden='true' />
                        )}
                      </span>
                      <span className='hidden lg:flex lg:items-center'>
                        <span
                          className='ml-4 text-sm font-semibold leading-6 text-white'
                          aria-hidden='true'>
                          {user ? user.name : 'Iniciar sesión'}
                        </span>
                        <ChevronDownIcon
                          className='ml-2 h-5 w-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'>
                      <Menu.Items className='absolute bottom-full right-0 z-10 -mb-2.5 w-32 origin-bottom-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                        {user ? (
                          <Menu.Item>
                            <Link
                              onClick={() => logout()}
                              className='block cursor-pointer px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100'>
                              Logout
                            </Link>
                          </Menu.Item>
                        ) : (
                          <Menu.Item>
                            <Link
                              to='/'
                              className='block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100'>
                              Login
                            </Link>
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className='py-10 lg:pl-72'>
          <div className='px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </>
  );
}
