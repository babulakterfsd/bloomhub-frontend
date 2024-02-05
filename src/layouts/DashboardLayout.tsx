import {
  setShopkeeperInLocalState,
  useCurrentShopkeeper,
} from '@/redux/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentShopkeeper } from '@/types/commonTypes';
import { useState } from 'react';
import { FaSellsy, FaUserTie } from 'react-icons/fa';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { LiaSitemapSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { TbHistory } from 'react-icons/tb';
import { Link, Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import logo from '../../public/flowers.png';
import Styles from '../styles/home.module.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDashboardRoute, setActiveDashboardRoute] = useState('');
  const dispatch = useAppDispatch();
  const shopkeeperInfo = useAppSelector(useCurrentShopkeeper);
  const { name } = shopkeeperInfo as TCurrentShopkeeper;

  const handleLogout = () => {
    toast.success('Logout Successful', {
      position: 'top-right',
      icon: '👏',
      duration: 1500,
    });
    dispatch(setShopkeeperInLocalState({ shopkeeper: null, token: null }));
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const profileClickHandler = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActiveDashboardRoute('profile');
  };

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open</span>
        <svg
          className="w-6 h-6 text-xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Link
            to="/dashboard"
            onClick={() => setActiveDashboardRoute('productmanagement')}
          >
            <div
              className="flex justify-center items-center space-x-0 hover:cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <img
                src={logo}
                alt="logo"
                className="h-12 w-12 lg:mt-6 object-contain"
              />

              <h3
                className={`${Styles.gradientTitle} text-xl font-bold text-center lg:text-left lg:ml-5 lg:mt-6`}
              >
                BloomHub
              </h3>
            </div>
          </Link>
          <div className="flex justify-end items-center mb-5 sm:hidden">
            <button
              className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <RxCross2 />
            </button>
          </div>
          <ul className="font-medium lg:mt-12">
            <Link
              to="/dashboard/profile"
              className={` lg:hidden flex ml-1 lg:ml-0 items-center space-x-2 mb-4 hover:text-red-400 transition-all duration-300 ease-in-out rounded-md py-2.5 px-3 ${
                activeDashboardRoute === 'profile'
                  ? 'bg-red-300 text-white'
                  : 'bg-none'
              }`}
              onClick={profileClickHandler}
            >
              <FaUserTie />
              <li className="">{` ${name}`}</li>
            </Link>
            <hr className="mt-2 lg:hidden" />
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-300 group ${
                  activeDashboardRoute === 'productmanagement'
                    ? 'bg-red-300 text-white'
                    : 'bg-none'
                }`}
                onClick={() => setActiveDashboardRoute('productmanagement')}
              >
                <div
                  className="flex items-center space-x-2"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <LiaSitemapSolid />
                  <span>Product Management</span>
                </div>
              </Link>
            </li>
            <li className="lg:my-1">
              <Link
                to="/dashboard/salesmanagement"
                className={`flex items-center p-2  rounded-lg dark:text-white hover:bg-red-300 group ${
                  activeDashboardRoute === 'sellsmanagement'
                    ? 'bg-red-300 text-white'
                    : 'bg-none'
                }`}
                onClick={() => setActiveDashboardRoute('sellsmanagement')}
              >
                <div
                  className="flex items-center space-x-2"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <FaSellsy />
                  <span>Sales Management</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/saleshistory"
                className={`flex items-center p-2  rounded-lg dark:text-white hover:bg-red-300 group ${
                  activeDashboardRoute === 'sellshistory'
                    ? 'bg-red-300 text-white'
                    : 'bg-none'
                }`}
                onClick={() => setActiveDashboardRoute('sellshistory')}
              >
                <div
                  className="flex items-center space-x-2"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <TbHistory />
                  <span>Sales History</span>
                </div>
              </Link>
            </li>
            <div className="absolute bottom-20 sm:bottom-10">
              <li>
                <Link to="/" className="cursor-pointer ms-5">
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <IoMdHome />
                    <span>Back To Home</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="cursor-pointer ms-5"
                  onClick={handleLogout}
                >
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <IoMdLogOut />
                    <span>Logout</span>
                  </div>
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </aside>

      <div className={`p-4 lg:p-0 ${isSidebarOpen ? 'sm:ml-64' : ''} sm:ml-64`}>
        {/* dashboard content */}
        <div className="py-10 hidden lg:flex justify-end items-center bg-[#f9fafb]">
          <Link
            to="/dashboard/profile"
            className={`flex justify-center items-center space-x-2 hover:text-red-400 transition-all duration-300 ease-in-out mr-10 ${
              activeDashboardRoute === 'profile' ? 'text-red-300' : ''
            }`}
            onClick={profileClickHandler}
          >
            <FaUserTie />
            <li className="list-none text-md font-semibold">{` ${name}`}</li>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
