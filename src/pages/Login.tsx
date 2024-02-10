import { useLoginMutation } from '@/redux/api/authApi';
import {
  setShopkeeperInLocalState,
  useCurrentToken,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { FieldValues, useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import Styles from '../styles/home.module.css';

import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(useCurrentToken);
  const { state } = useLocation();

  useEffect(() => {
    fetch('https://bloomhub-backend.vercel.app/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data: any) => {
        if (data?.data !== true) {
          dispatch(
            setShopkeeperInLocalState({ shopkeeper: null, token: null })
          );
        } else {
          navigate(state ? state : '/dashboard');
        }
      });
  }, [token, navigate, dispatch]);

  const handleLogin = async (loginData: FieldValues) => {
    if (!loginData?.email || !loginData?.password) {
      toast.error('Email or Password is missing', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
    } else {
      const response = await login(loginData).unwrap();

      const shopkeeperFromDB = response?.data?.shopkeeper;
      const accessToken = response?.data?.token;

      if (shopkeeperFromDB && accessToken) {
        toast.success('Login Successful', {
          position: 'top-right',
          icon: '👏',
          duration: 1500,
        });
        dispatch(
          setShopkeeperInLocalState({
            shopkeeper: shopkeeperFromDB,
            token: accessToken,
          })
        );
        setTimeout(() => {
          navigate(state ? state : '/dashboard');
        }, 500);
      }
    }
  };

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (!forgetPasswordEmail) {
      toast.error('Email is required', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
      return;
    } else if (forgetPasswordEmail === 'xpawal@gmail.com') {
      toast.error('You can not reset demo accounts password', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
      return;
    } else {
      const response = await fetch(
        'https://bloomhub-backend.vercel.app/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shopkeeperEmail: forgetPasswordEmail }),
        }
      );
      const data = await response.json();
      if (data?.statusCode === 200 && data?.success === true) {
        toast.success(data.message, {
          position: 'top-right',
          icon: '👏',
          duration: 1500,
        });
        setShowForgotPasswordModal(false);
      } else {
        toast.error(data?.message, {
          position: 'top-right',
          icon: '😢',
          duration: 1500,
        });
      }
    }
  };

  const toggleShowingPassword = () => {
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsPasswordVisible(false);
    }
  };

  return (
    <div className="grid h-screen grid-cols-12">
      <div
        className={`${Styles.bannerbg} col-span-12 lg:col-span-6 hidden lg:block`}
      ></div>
      <div className="flex justify-center items-center col-span-12 lg:col-span-6">
        <div
          className="border border-slate-100 w-5/6 md:w-4/6 px-4 lg:px-8 py-4 lg:py-10"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          <h3 className="text-xl text-center font-semibold capitalize mb-6">
            Please login to continue !
          </h3>

          <div className="shadow bg-gray-50 p-4 my-6 mx-auto rounded-md flex justify-center flex-col items-center">
            <h5 className="text-red-300 underline">Demo Account</h5>
            <p className="text-sm">
              Email: <span className="font-semibold">xpawal@gmail.com</span>
            </p>
            <p className="text-sm">
              Password: <span className="font-semibold">awal123</span>
            </p>
          </div>

          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(handleLogin)}
          >
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
            <div className="relative">
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
              <span
                className="absolute cursor-pointer top-10 right-3"
                onClick={toggleShowingPassword}
              >
                {isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>
            <div className="flex justify-end">
              <p
                className="text-sm cursor-pointer"
                onClick={() =>
                  setShowForgotPasswordModal(!showForgotPasswordModal)
                }
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
            <div className="flex items-center justify-between">
              <p className="text-sm">Not Registered Yet?</p>
              <Link to="/signup">
                <span className="text-sm hover:text-red-300  hover:transition-all duration-300 underline">
                  Go to Signup
                </span>
              </Link>
            </div>
          </form>
          {/* forgot password modal */}
          <div>
            {showForgotPasswordModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none "
                  data-aos="zoom-in"
                  data-aos-duration="500"
                >
                  <div className="relative w-[370px] lg:w-[640px] my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-md font-semibold text-center">
                          Reset Password
                        </h3>
                        <button
                          className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                          onClick={() => setShowForgotPasswordModal(false)}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                      {/*body*/}
                      <form className="py-6 px-10">
                        <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                          {/*  email */}
                          <div className="w-full">
                            <label
                              htmlFor="email"
                              className="block mb-2 text-sm font-medium "
                            >
                              Email Address
                            </label>

                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                              placeholder="e.g. xpawal@gmail.com"
                              required
                              onChange={(e) =>
                                setForgetPasswordEmail(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                          onClick={(e) => handleForgotPassword(e)}
                        >
                          Send Reset Link
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
