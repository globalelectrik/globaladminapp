import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { login as userLogin } from '../../services/AuthServices';
import { useContext, useState } from 'react';
import logo from '../../assets/logo.png';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validators/loginValidator';

export default function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [loginStatus, setLoginStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoginStatus(null);
    console.log(data);
    try {
      
      const { accessToken } = await userLogin(data);
      login(accessToken);
      navigate('/dashboard');
    } catch (error) {
        setLoginStatus(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
          <div className='px-8 py-8 sm:p-6'>
            <div className='mb-4 flex flex-col items-center justify-center'>
              <h2 className='my-12 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
                Inicio de Sesión
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4'>
              <div className=''>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Usuario
                </label>
                <div className='mt-2'>
                  <input
                    type='email'
                    {...register('email')}
                    name='email'
                    id='email'
                    className='block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Introduce tu usuario'
                  />
                </div>
                <p className='mt-2 text-sm text-red-600' id='email-error'>
                  {errors.email?.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'>
                  Contraseña
                </label>
                <div className='mt-2'>
                  <input
                    type='password'
                    {...register('password')}
                    name='password'
                    id='password'
                    className='block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Introduce tu contraseña'
                  />
                </div>
                <p className='mt-2 text-sm text-red-600' id='email-error'>
                  {errors.password?.message}
                </p>
                <p className='mt-2 text-sm text-red-600' id='email-error'>
                  {loginStatus ? loginStatus : null}
                </p>
              </div>
              <div>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
