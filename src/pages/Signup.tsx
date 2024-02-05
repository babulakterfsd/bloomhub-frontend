import { useLoginMutation, useSignupMutation } from '@/redux/api/authApi';
import {
  setShopkeeperInLocalState,
  useCurrentToken,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Styles from '../styles/home.module.css';

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSignup = async (signupData: FieldValues) => {
    const { name, email, password } = signupData;
    if (!name || !email || !password) {
      toast.error('All fields are required', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
    } else if (password.length < 6 || !/\d/.test(password)) {
      toast.error(
        'Password should be at least 6 characters long and contain a number',
        {
          position: 'top-right',
          icon: '😢',
          duration: 2500,
        }
      );
    } else {
      const response = await signup(signupData).unwrap();
      if (response?.data?.email === email) {
        toast.success('Signup Successful', {
          position: 'top-right',
          icon: '👏',
          duration: 1500,
        });

        const response = await login({ email, password }).unwrap();

        const shopkeeperFromDB = response?.data?.shopkeeper;
        const accessToken = response?.data?.token;

        if (shopkeeperFromDB && accessToken) {
          dispatch(
            setShopkeeperInLocalState({
              shopkeeper: shopkeeperFromDB,
              token: accessToken,
            })
          );
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        }
      } else {
        toast.error('Signup Failed, try again please.', {
          position: 'top-right',
          icon: '😢',
          duration: 1500,
        });
      }
    }
  };

  return (
    <div className="grid h-screen grid-cols-12">
      <div
        className={`${Styles.bannerbg} col-span-12 lg:col-span-6 hidden lg:block`}
      ></div>
      <div className="flex justify-center items-center col-span-12 lg:col-span-6">
        <div className="h-screen flex justify-center items-center w-full">
          <div
            className="border border-slate-100 w-5/6 md:w-4/6 px-8 py-10"
            data-aos="fade-down"
            data-aos-duration="1500"
          >
            <h3 className="text-xl text-center font-semibold capitalize mb-6">
              Get Registered!
            </h3>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleSignup)}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  focus:outline-none"
                  placeholder="Babul Akter"
                  {...register('name')}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  focus:outline-none"
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  focus:outline-none"
                  {...register('password')}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign Up
              </button>
              <div className="flex items-center justify-between">
                <p className="text-sm">Already Registered?</p>
                <Link to="/login">
                  <span className="text-sm hover:text-red-300  hover:transition-all duration-300 underline">
                    Go to Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
