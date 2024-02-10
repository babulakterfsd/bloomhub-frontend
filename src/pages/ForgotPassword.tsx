import { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  const navigate = useNavigate();
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const toggleShowingNewPassword = () => {
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsNewPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsNewPasswordVisible(false);
    }
  };

  const handleSetNewPassword = async (e: any) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error('Password is required', {
        position: 'top-right',
        icon: '😢',
        duration: 2500,
      });
    } else if (newPassword.length < 6 || !/\d/.test(newPassword)) {
      toast.error(
        'Password should be at least 6 characters long and contain a number',
        {
          position: 'top-right',
          icon: '😢',
          duration: 2500,
        }
      );
    } else {
      const response = await fetch(
        'https://bloomhub-backend.vercel.app/api/auth/reset-forgotten-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shopkeeperEmail: email,
            newPassword,
          }),
        }
      );
      const data = await response.json();
      if (data?.statusCode === 200 && data?.success === true) {
        toast.success(data.message, {
          position: 'top-right',
          icon: '👏',
          duration: 1500,
        });
        setNewPassword('');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(data?.message, {
          position: 'top-right',
          icon: '😢',
          duration: 1500,
        });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <form className="py-6 px-10 shadow-md w-3/4 lg:w-1/3">
        <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
          {/*  email */}
          <div className="w-full relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium "
            >
              New Password
            </label>

            <input
              type="password"
              name="password"
              id="password"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
              placeholder="e.g. awal123"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="absolute cursor-pointer top-10 right-3"
              onClick={toggleShowingNewPassword}
            >
              {isNewPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={(e) => handleSetNewPassword(e)}
        >
          Set New Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
