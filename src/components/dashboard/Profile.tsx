import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/redux/api/authApi';
import { useGetAllSoldProductsQuery } from '@/redux/api/sellApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TShopkeeper, TTimeframe } from '@/types/commonTypes';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import demoPic from '../../assets/images/babul.png';
import Styles from '../../styles/home.module.css';

const Profile = () => {
  const [showNameUpdateModal, setShowNameUpdateModal] =
    useState<boolean>(false);
  const [showProfilePhotoUpdateModal, setShowProfilePhotoUpdateModal] =
    useState<boolean>(false);
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] =
    useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [shopkeeperNewName, setShopkeeperNewName] = useState<string>('');
  const [newProfileImage, setNewProfileImage] = useState('' as any);
  const [updateProfilePhotoOngoing, setUpdateProfilePhotoOngoing] =
    useState(false);
  const [changePassword] = useChangePasswordMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const { data: profileData } = useGetProfileQuery(undefined);
  const shopkeeperProfileFromDb = profileData?.data;
  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { email: shopkeepersEmail, name: shopkeepersNameInLocalStorage } =
    shopkeeper as TShopkeeper;

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

  // handle profile image upload
  const handleProfilePhotoUpload = (e: any) => {
    e.preventDefault();
    setUpdateProfilePhotoOngoing(true);

    const preset_key = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_CLODINARY_CLOUD_NAME;

    const formData = new FormData();

    if (!newProfileImage) {
      setUpdateProfilePhotoOngoing(false);
      toast.error('Please select an image to upload', {
        position: 'top-right',
        duration: 1500,
      });
      return;
    }

    // check if image size is less than 1MB and type is jpg, jpeg or png
    if (newProfileImage) {
      if (newProfileImage.size > 1024 * 1024) {
        setUpdateProfilePhotoOngoing(false);
        toast.error('Image size should be less than 1MB', {
          position: 'top-right',
          duration: 1500,
        });
        return;
      } else if (
        newProfileImage.type !== 'image/jpeg' &&
        newProfileImage.type !== 'image/jpg' &&
        newProfileImage.type !== 'image/png'
      ) {
        setUpdateProfilePhotoOngoing(false);
        toast.error('We accept only jpg, jpeg and png type images', {
          position: 'top-right',
          duration: 1500,
        });
        return;
      } else {
        formData.append('file', newProfileImage);
        formData.append('upload_preset', preset_key);
      }
    }

    fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        const response = await updateProfile({
          name: shopkeeperProfileFromDb?.name,
          profileImage: data?.secure_url
            ? data?.secure_url
            : shopkeeperProfileFromDb?.profileImage,
        }).unwrap();

        if (response?.statusCode === 200) {
          toast.success('Profile photo updated successfully', {
            position: 'top-right',
            duration: 1500,
          });
          setShowProfilePhotoUpdateModal(!showProfilePhotoUpdateModal);
          setUpdateProfilePhotoOngoing(false);
          setNewProfileImage('');
        } else {
          toast.error('Profile photo update failed', {
            position: 'top-right',
            duration: 1500,
          });
          setUpdateProfilePhotoOngoing(false);
        }
      })
      .catch(() => {
        toast.error('Image upload failed', {
          position: 'top-right',
          duration: 1500,
        });
        setUpdateProfilePhotoOngoing(false);
      });
  };

  // handle profile Name update
  const handleUpdateProfileName = async (e: any) => {
    e.preventDefault();

    if (!shopkeeperNewName) {
      toast.error('Whats the new name to be updated?', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      const response = await updateProfile({
        name: shopkeeperNewName
          ? shopkeeperNewName
          : shopkeeperProfileFromDb?.name,
        profileImage: shopkeeperProfileFromDb?.profileImage,
      }).unwrap();

      if (response?.statusCode === 200) {
        toast.success('Name updated successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowNameUpdateModal(!showNameUpdateModal);
        setShopkeeperNewName('');
      } else {
        toast.error('Name update failed', {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();

    if (shopkeeperProfileFromDb?.email === 'xpawal@gmail.com') {
      toast.error(
        `Any visitor may use this demo account, so you can't change this account's password`,
        {
          position: 'top-right',
          duration: 1500,
        }
      );
      return;
    }

    if (!currentPassword || !newPassword) {
      toast.error('Please fill all the fields', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      const response = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      if (response?.statusCode === 200) {
        toast.success('Password updated successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowPasswordUpdateModal(!showPasswordUpdateModal);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error('Password update failed', {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };

  const toggleShowingCurrentPassword = () => {
    const passwordInput = document.getElementById(
      'currentpassword'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsCurrentPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsCurrentPasswordVisible(false);
    }
  };
  const toggleShowingNewPassword = () => {
    const passwordInput = document.getElementById(
      'newpassword'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      setIsNewPasswordVisible(true);
    } else {
      passwordInput.type = 'password';
      setIsNewPasswordVisible(false);
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
            {isLoading ? (
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-300"></div>
            ) : (
              <>
                <img
                  src={
                    shopkeeperProfileFromDb?.profileImage
                      ? shopkeeperProfileFromDb?.profileImage
                      : demoPic
                  }
                  alt={shopkeeperProfileFromDb?.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold mt-4">
                  {shopkeeperProfileFromDb?.name}
                </h3>
                <h3 className="text-sm">{shopkeeperProfileFromDb?.email}</h3>
              </>
            )}
            <div
              className="absolute top-2 right-10 text-md text-red-300 hover:text-red-400 duration-300 transition-all ease-in-out cursor-pointer"
              title="Update Account"
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <CiEdit style={{ fontSize: '24px', fontWeight: 'bold' }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ background: 'white' }}>
                  <DropdownMenuItem>
                    <button
                      onClick={() => setShowNameUpdateModal(true)}
                      className="text-md hover:text-red-300 transition-all duration-300 ease-out cursor-pointer"
                    >
                      Update Name
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={() => setShowProfilePhotoUpdateModal(true)}
                      className="text-md hover:text-red-300 transition-all duration-300 ease-out cursor-pointer"
                    >
                      Update Profile Photo
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={() => setShowPasswordUpdateModal(true)}
                      className="text-md hover:text-red-300 transition-all duration-300 ease-out cursor-pointer"
                    >
                      Update Password
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* profile Name update modal */}
            <div>
              {showNameUpdateModal ? (
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
                            {shopkeeperProfileFromDb?.name
                              ? shopkeeperProfileFromDb?.name
                              : shopkeepersNameInLocalStorage}
                          </h3>
                          <button
                            className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                            onClick={() => setShowNameUpdateModal(false)}
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
                                placeholder={`e.g. ${shopkeepersNameInLocalStorage}`}
                                required
                                onChange={(e) =>
                                  setShopkeeperNewName(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                            onClick={(e) => handleUpdateProfileName(e)}
                          >
                            Update Name
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
                </>
              ) : null}
            </div>
            {/* profile photo update modal */}
            <div>
              {showProfilePhotoUpdateModal ? (
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
                            Update Profile Photo
                          </h3>
                          <button
                            className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                            onClick={() =>
                              setShowProfilePhotoUpdateModal(false)
                            }
                          >
                            <RxCross2 />
                          </button>
                        </div>
                        {/*body*/}
                        <form className="py-6 px-10">
                          <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                            {/* profile image */}
                            <div className="w-full">
                              <label
                                htmlFor="profileimage"
                                className="block mb-2 text-sm font-medium "
                              >
                                Profile Photo
                              </label>

                              <input
                                type="file"
                                name="profileimage"
                                id="profileimage"
                                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                                required
                                onChange={(e) => {
                                  const selectedFile =
                                    e.target.files && e.target.files[0];
                                  if (selectedFile) {
                                    setNewProfileImage(selectedFile);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto disabled:cursor-not-allowed disabled:bg-gray-300"
                            onClick={(e) => handleProfilePhotoUpload(e)}
                            disabled={updateProfilePhotoOngoing}
                          >
                            {updateProfilePhotoOngoing
                              ? 'Updating Profile'
                              : 'Update Profile'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
                </>
              ) : null}
            </div>
            {/* password update modal */}
            <div>
              {showPasswordUpdateModal ? (
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
                            Update Password
                          </h3>
                          <button
                            className="text-2xl text-red-300 hover:text-red-700 hover:transition-all duration-300 ease-in-out"
                            onClick={() => setShowPasswordUpdateModal(false)}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                        {/*body*/}
                        <form className="py-6 px-10">
                          <div className="grid gap-4 grid-cols-1 sm:gap-x-6 sm:gap-y-4">
                            {/*  current password */}
                            <div className="w-full relative">
                              <label
                                htmlFor="currentpassword"
                                className="block mb-2 text-sm font-medium "
                              >
                                Current Password
                              </label>

                              <input
                                type="password"
                                name="currentpassword"
                                id="currentpassword"
                                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                                placeholder="e.g. awal123"
                                required
                                onChange={(e) =>
                                  setCurrentPassword(e.target.value)
                                }
                              />
                              <span
                                className="absolute cursor-pointer top-10 right-3"
                                onClick={toggleShowingCurrentPassword}
                              >
                                {isCurrentPasswordVisible ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </span>
                            </div>
                            {/* new password */}
                            <div className="w-full relative">
                              <label
                                htmlFor="newpassword"
                                className="block mb-2 text-sm font-medium"
                              >
                                New Password
                              </label>

                              <input
                                type="password"
                                name="newpassword"
                                id="newpassword"
                                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                                placeholder="e.g. newpassword123"
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span
                                className="absolute cursor-pointer top-10 right-3"
                                onClick={toggleShowingNewPassword}
                              >
                                {isNewPasswordVisible ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto"
                            onClick={(e) => handleUpdatePassword(e)}
                          >
                            Update Password
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
          {isLoading ? (
            <div className="h-44 col-span-12 md:col-span-6 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-1">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-300"></div>{' '}
            </div>
          ) : (
            <div className="h-44 col-span-12 md:col-span-6 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-1">
              <h2 className="text-center font-semibold text-xl underline">
                All time summary
              </h2>
              <div className="flex items-center space-x-4">
                <p className="text-md font-semibold">Total Sells :</p>
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalSellGenerated}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-md font-semibold">Items Sold :</p>
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalItemSold}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-md font-semibold">Total Revenue :</p>
                <div>
                  <h3 className={`${Styles.gradientTitle} text-xl font-bold`}>
                    {data?.data?.meta?.totalRevenue}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
