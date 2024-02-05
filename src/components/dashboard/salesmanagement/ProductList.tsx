import { useGetProductsQuery } from '@/redux/api/productApi';
import { useSellAProductMutation } from '@/redux/api/sellApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TProduct, TShopkeeper } from '@/types/commonTypes';
import { useState } from 'react';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { GiFlowerPot } from 'react-icons/gi';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';

const ProductList = () => {
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct>(
    {} as TProduct
  );
  const [buyerName, setBuyerName] = useState<string>('');
  const [quantityToBeSold, setQuantityToBeSold] = useState<number>(0);
  const [dateOfSell, setDateOfSell] = useState<string>('');

  const shopkeeperInfo = useAppSelector(useCurrentShopkeeper);
  const [sellAProduct] = useSellAProductMutation();

  const page = '1';
  const limit = '50';

  const allFilters = {
    page,
    limit,
    shopkeepersEmail: (shopkeeperInfo as TShopkeeper)?.email,
    search,
  };

  const createQueryString = (obj: any) => {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
      );
    }
    return keyValuePairs.join('&');
  };

  const { data, error, isLoading } = useGetProductsQuery(
    createQueryString(allFilters)
  );

  const products = data?.data?.data;

  const handleModal = (id: string) => {
    const productToBeSold = products?.find(
      (product: TProduct) => product?._id === id
    );
    if (productToBeSold) {
      setShowModal(true);
      setSelectedProduct(productToBeSold);
    }
  };

  const handleSellProduct = async (e: any, product: TProduct) => {
    e.preventDefault();
    const productToBeSold = {
      productID: product?._id,
      productName: product?.name,
      productPrice: product?.price,
      quantityToBeSold,
      buyerName,
      sellerEmail: (shopkeeperInfo as TShopkeeper)?.email,
      dateOfSell,
      totalBill: product?.price * quantityToBeSold,
    };
    // setShowModal(false);

    if (!buyerName || !dateOfSell || !quantityToBeSold) {
      toast.error('Please fill all the fields', {
        position: 'top-right',
        duration: 1500,
      });
    } else if (product?.quantity < quantityToBeSold) {
      toast.error(
        'We do not have enough quantity to sell, please try again with less quantity',
        {
          position: 'top-right',
          duration: 1500,
        }
      );
    } else if (dateOfSell > new Date().toISOString().split('T')[0]) {
      toast.error('You can not sell a product in future date', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      const response = await sellAProduct(productToBeSold).unwrap();
      if (response?.statusCode === 201) {
        toast.success('Product sold successfully', {
          position: 'top-right',
          duration: 1500,
        });
        setShowModal(false);
        setBuyerName('');
        setDateOfSell('');
        setQuantityToBeSold(0);
      } else {
        toast.error('Something went wrong, please try again', {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };

  return (
    <div className="mb-10 lg:mb-24 lg:mt-16 lg:shadow-md lg:rounded-md lg:py-5 lg:px-6 lg:pb-8 lg:pt-5 overflow-x-hidden">
      {/* header searchbar */}
      <div className="flex justify-end items-center mt-6 mb-10 lg:mt-0 lg:mb-20 ">
        <input
          type="search"
          id="search"
          className="text-sm rounded-lg w-full mb-1.5 lg:mb-0 sm:w-4/6 lg:w-[320px] pl-10 p-2 focus:outline-none bg-gray-100 h-[44px]"
          placeholder="Search by product name or type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* product list */}
      <div>
        {isLoading ? (
          <div className="flex justify-center mt-12 h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-300"></div>
          </div>
        ) : null}

        {error ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-xl">{`${error}`}</p>
          </div>
        ) : null}
        {!error && !isLoading && products?.length === 0 ? (
          <div className="flex justify-center h-screen">
            <p className="text-red-500 font-semibold">No Product Found</p>
          </div>
        ) : null}
        {products?.length > 0 ? (
          <div
            className="min-h-screen grid grid-cols-12 gap-8  overflow-x-hidden"
            data-aos="fade-down"
            data-aos-duration="1500"
          >
            {products?.map((product: any) => (
              <div
                className="col-span-12 md:col-span-6 lg:col-span-4  flex flex-col justify-between items-center bg-gradient-to-br from-teal-100 to-yellow-50 via-white rounded-md shadow-md p-4 hover:to-teal-200 transition-all duration-300 hover:cursor-pointer h-80 xl:h-72 relative"
                key={product?._id}
              >
                {/* card */}
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm text-gray-900 font-semibold absolute top-3 left-6">
                    {product?.type}
                  </p>
                  <p className="text-sm text-gray-900 font-semibold absolute top-3 right-10 md:right-5">{`$${product?.price}`}</p>

                  <GiFlowerPot
                    className="mt-12"
                    style={{ height: '80px', width: '80px' }}
                  />
                  <p className="text-lg font-semibold">{product?.name}</p>

                  <p className="text-sm text-gray-500">{`In-stock: ${product?.quantity}`}</p>
                  <div
                    className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 bottom-4 absolute mx-auto"
                    onClick={() => handleModal(product?._id)}
                  >
                    <FaHandHoldingUsd style={{ fontSize: '18px' }} />
                    <span>Sell Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
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
                        Sell : {selectedProduct?.name}
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
                        {/* buyer name */}
                        <div className="w-full">
                          <label
                            htmlFor="buyername"
                            className="block mb-2 text-sm font-medium "
                          >
                            Buyer Name
                          </label>

                          <input
                            type="text"
                            name="buyername"
                            id="buyername"
                            className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                            placeholder="e.g. Babul Akter"
                            required
                            onChange={(e) => setBuyerName(e.target.value)}
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="quantitytobesold"
                            className="block mb-2 text-sm font-medium "
                          >
                            Quantity
                          </label>

                          <input
                            type="number"
                            name="quantitytobesold"
                            id="quantitytobesold"
                            className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                            placeholder="e.g. 7"
                            required
                            onChange={(e) =>
                              setQuantityToBeSold(Number(e.target.value))
                            }
                          />
                        </div>
                        {/* sell date */}
                        <div className="w-full">
                          <label
                            htmlFor="dateofsell"
                            className="block mb-2 text-sm font-medium "
                          >
                            Date of Sell
                          </label>

                          <input
                            type="date"
                            name="dateofsell"
                            id="dateofsell"
                            className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                            placeholder="e.g. 2024-02-01"
                            required
                            onChange={(e) => setDateOfSell(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-6 ml-auto"
                        onClick={(e) => handleSellProduct(e, selectedProduct)}
                      >
                        <FaHandHoldingUsd style={{ fontSize: '18px' }} />
                        <span>Sell Product</span>
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
  );
};

export default ProductList;
