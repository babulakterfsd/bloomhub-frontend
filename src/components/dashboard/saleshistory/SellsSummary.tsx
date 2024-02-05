import { useGetAllSoldProductsQuery } from '@/redux/api/sellApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TShopkeeper, TSoldProduct, TTimeframe } from '@/types/commonTypes';
import { useState } from 'react';
import Styles from '../../../styles/home.module.css';

const SellsSummary = () => {
  const [timeframe, setTimeframe] = useState<TTimeframe>('yearly');

  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { email: shopkeepersEmail } = shopkeeper as TShopkeeper;

  let page = '1';
  let limit = '10';

  let allFilters = {
    page,
    limit,
    shopkeepersEmail,
    timeframe,
  };

  const { data, isLoading, error } = useGetAllSoldProductsQuery(allFilters, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="mb-10 lg:mb-24 lg:mt-16 lg:shadow-md lg:rounded-md lg:py-5 lg:px-6 lg:pb-8 lg:pt-5">
      {isLoading ? (
        <div className="flex justify-center mt-12 h-screen lg:shadow-md">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-300"></div>
        </div>
      ) : null}

      {error ? (
        <div className="flex justify-center items-center h-screen lg:shadow-md">
          <p className="text-red-400 text-xl">{`${error}`}</p>
        </div>
      ) : null}
      {!error && !isLoading && data?.data?.soldProductList === 0 ? (
        <div className="flex justify-center items-center h-screen lg:shadow-md">
          <p className="text-red-400 text-xl">No Sells History Found</p>
        </div>
      ) : null}
      <div className="min-h-screen">
        {/* timeframe selectors */}
        <div className="flex flex-col md:flex-row space-y-2 mt-5 justify-end items-center space-x-2 lg:space-x-4">
          <button
            className={`${
              timeframe === 'daily' ? 'bg-red-400' : 'bg-red-200'
            } rounded-md px-6 py-1 cursor-pointer text-white  transition-colors duration-300 ease-in-out mt-3`}
            onClick={() => setTimeframe('daily')}
          >
            Daily
          </button>
          <button
            className={`${
              timeframe === 'weekly' ? 'bg-red-400' : 'bg-red-200'
            } rounded-md px-6 py-1 cursor-pointer text-white  transition-colors duration-300 ease-in-out`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button
            className={`${
              timeframe === 'monthly' ? 'bg-red-400' : 'bg-red-200'
            } rounded-md px-6 py-1 cursor-pointer text-white  transition-colors duration-300 ease-in-out`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button
            className={`${
              timeframe === 'yearly' ? 'bg-red-400' : 'bg-red-200'
            } rounded-md px-6 py-1 cursor-pointer text-white  transition-colors duration-300 ease-in-out`}
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </button>
        </div>
        {/* sells summary */}
        <div className="grid grid-cols-12 gap-y-6 lg:gap-x-12 mt-6 md:mt-8 lg:mt-14">
          <div className="h-44 col-span-12 md:col-span-4 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-5">
            <h3 className={`${Styles.gradientTitle} text-4xl font-bold`}>
              {data?.data?.meta?.totalSellGenerated}
            </h3>
            <p className="text-xl font-semibold">Total Sells</p>
          </div>
          <div className="h-44 col-span-12 md:col-span-4 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-5">
            <h3 className={`${Styles.gradientTitle} text-4xl font-bold`}>
              {data?.data?.meta?.totalItemSold}
            </h3>
            <p className="text-xl font-semibold">Items Sold</p>
          </div>
          <div className="h-44 col-span-12 md:col-span-4 py-5 px-3 shadow-md rounded-md flex flex-col justify-center items-center gap-y-5">
            <h3 className={`${Styles.gradientTitle} text-4xl font-bold`}>
              {`$${data?.data?.meta?.totalRevenue}`}
            </h3>
            <p className="text-xl font-semibold">Total Revenue</p>
          </div>
        </div>
        {/* sells list */}
        <div className="mt-8">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Buyer Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date of Sell
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Bill Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading === true ? (
                  <tr>
                    <td className="text-red-400 font-semibold whitespace-nowrap py-8 pl-12">
                      Loading...
                    </td>
                  </tr>
                ) : null}
                {error ? (
                  <tr>
                    <td className="text-red-400 font-semibold whitespace-nowrap py-8 pl-12">{`${error}`}</td>
                  </tr>
                ) : null}
                {!isLoading &&
                !error &&
                data?.data?.soldProductList?.length === 0 ? (
                  <tr>
                    <td className="text-red-400 font-semibold whitespace-nowrap py-8 pl-12">
                      No Sold Prodcut Found
                    </td>
                  </tr>
                ) : null}
                {!isLoading && !error && data?.data?.soldProductList?.length > 0
                  ? data?.data?.soldProductList.map(
                      (soldProduct: TSoldProduct) => (
                        <tr
                          className="bg-white border-b  hover:bg-red-50"
                          key={soldProduct?._id}
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                          >
                            {soldProduct?.productName}
                          </th>
                          <td className="px-6 py-4">{`$${soldProduct?.productPrice}`}</td>
                          <td className="px-6 py-4">
                            {soldProduct?.quantityToBeSold}
                          </td>
                          <td className="px-6 py-4">
                            {soldProduct?.buyerName}
                          </td>
                          <td className="px-6 py-4">
                            {soldProduct?.dateOfSell}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {`$${soldProduct?.totalBill}`}
                          </td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellsSummary;
