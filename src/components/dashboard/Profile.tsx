import { useGetAllSoldProductsQuery } from '@/redux/api/sellApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TShopkeeper, TTimeframe } from '@/types/commonTypes';
import { useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import babul from '../../assets/images/babul.png';
import Styles from '../../styles/home.module.css';

const Profile = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shopkeeperName, setShopkeeperName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { email: shopkeepersEmail, name } = shopkeeper as TShopkeeper;

  let page = '1';
  let limit = '10000';
  let timeframe: TTimeframe = 'alltime';

  let allFilters = {
    page,
    limit,
    shopkeepersEmail,
    timeframe,
  };

  const { data, isLoading } = useGetAllSoldProductsQuery(allFilters, {
    refetchOnMountOrArgChange: true,
  });

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleUpdateProfile = (e: any) => {
    e.preventDefault();
    if (!profileImage || !shopkeeperName) {
      toast.error('Please fill all the fields', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      console.log({
        shopkeeperName,
        profileImage,
      });
      setShowModal(!showModal);
      setShopkeeperName('');
      setProfileImage('');
    }
  };

  return (
    <div>
      <h3 className="text-center lg:mt-8 text-2xl font-semibold">
        Shopkeeper's Profile Management
      </h3>
      <p className="text-center lg:mt-2 text-md lg:w-2/3 lg:mx-auto">
        In this section, you can manage your profile, update your information,
        can see how many products you have added and how many sales you have
        made.
      </p>
      <div className="lg:w-11/12 lg:mx-auto">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-12 mt-6 md:mt-8 lg:mt-14">
          <div className="h-44 col-span-12 md:col-span-6 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center relative">
            <img
              src={babul}
              alt="babul"
              className="h-20 w-20 rounded-full object-cover"
            />
            <h3 className="text-xl font-semibold mt-4">{name}</h3>
            <h3 className="text-sm">{shopkeepersEmail}</h3>
            <div
              className="absolute top-2 right-10 text-md text-red-300 hover:text-red-400 duration-300 transition-all ease-in-out cursor-pointer"
              onClick={handleModal}
            >
              <MdModeEdit />
            </div>
            {/* modal */}
            <div>
              {showModal ? (
                <>
                  <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    data-aos="zoom-in"
                    data-aos-duration="500"
                  >
                    <div className="relative w-[370px] lg:w-[640px] my-6 mx-auto">
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-md font-semibold text-center">
                            Update Profile of {name}
                          </h3>
                          <button
                            className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                            onClick={() => setShowModal(!showModal)}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                        {/*body*/}
                        <form className="py-6 px-10">
                          <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                            {/*  name */}
                            <div className="w-full">
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium "
                              >
                                Name
                              </label>

                              <input
                                type="text"
                                name="shopkeepername"
                                id="shopkeepername"
                                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                                placeholder="e.g. Babul Akter"
                                required
                                onChange={(e) =>
                                  setShopkeeperName(e.target.value)
                                }
                              />
                            </div>
                            {/* profile image */}
                            <div className="w-full">
                              <label
                                htmlFor="profileimage"
                                className="block mb-2 text-sm font-medium "
                              >
                                Profile Image
                              </label>

                              <input
                                type="file"
                                name="profileimage"
                                id="profileimage"
                                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                                required
                                onChange={(e) =>
                                  setProfileImage(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto"
                            onClick={(e) => handleUpdateProfile(e)}
                          >
                            Update Profile
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
          <div className="h-44 col-span-12 md:col-span-6 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-1">
            <h2 className="text-center font-semibold text-xl underline">
              All time summary
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-md font-semibold">Total Sells :</p>
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-300"></div>
              ) : (
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalSellGenerated}
                  </h3>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-md font-semibold">Items Sold :</p>
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-300"></div>
              ) : (
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalItemSold}
                  </h3>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-md font-semibold">Total Revenue :</p>
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-300"></div>
              ) : (
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalRevenue}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
