import {
  useDeleteMultipleProductsMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '@/redux/api/productApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TProduct, TShopkeeper } from '@/types/commonTypes';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { TbDatabaseEdit } from 'react-icons/tb';
import { TfiFilter } from 'react-icons/tfi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AllProductsContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const [filterPriceFrom, setFilterPriceFrom] = useState<string>('');
  const [filterPriceTo, setFilterPriceTo] = useState<string>('');
  const [filterBloomdateFrom, setFilterBloomdateFrom] = useState<string>('');
  const [filterBloomdateTo, setfilterBloomdateTo] = useState<string>('');
  const [filterByColor, setFilterByColor] = useState<string>('');
  const [filterByType, setFilterByType] = useState<string>('');
  const [filterBySize, setFilterBySize] = useState<string>('');
  const [filterByFragrance, setFilterByFragrance] = useState<string>('');
  const [filterByArrangementStyle, setFilterByArrangementStyle] =
    useState<string>('');
  const [filterByOccasion, setFilterByOccasion] = useState<string>('');
  // const [page, setPage] = useState<string>('1');
  // const [limit, setLimit] = useState<string>('20');
  const [deleteContainer, setDeleteContainer] = useState([] as string[]);
  const [isMultipleDeleteActive, setIsMultipleDeleteActive] = useState(false);
  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { email: shopkeepersEmail } = shopkeeper as TShopkeeper;

  useEffect(() => {
    if (deleteContainer.length > 0) {
      setIsMultipleDeleteActive(true);
    } else {
      setIsMultipleDeleteActive(false);
    }
  }, [deleteContainer]);

  const [deleteProduct] = useDeleteProductMutation();
  const [deleteMultipleProducts] = useDeleteMultipleProductsMutation();

  let page = '1';
  let limit = '30';

  const handleMultipleDelete = async (ids: string[]) => {
    const allow = window.confirm(
      'Are you sure you want to delete selected products?'
    );

    if (!allow) {
      toast.error('Delete operation cancelled', {
        position: 'top-right',
        duration: 1500,
      });
      setDeleteContainer([]);
      return;
    } else {
      const res = await deleteMultipleProducts(ids).unwrap();

      if (res?.statusCode === 200) {
        toast.success(res?.message, {
          position: 'top-right',
          duration: 1500,
          icon: '👏',
        });
        setDeleteContainer([]);
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          duration: 1500,
        });
      }
    }
  };
  const handleSelectAllProductCheckbox = (e: any) => {
    if (e.target.checked) {
      const allProductIds = products?.map((product: TProduct) => product._id);
      setDeleteContainer(allProductIds);
    } else {
      setDeleteContainer([]);
    }
  };

  const handleSelectProductCheckbox = (e: any, id: string) => {
    if (e.target.checked) {
      const updatedDeleteContainer = [...deleteContainer, id];
      setDeleteContainer(updatedDeleteContainer);
    } else {
      const updatedDeleteContainer = deleteContainer.filter(
        (productId) => productId !== id
      );
      setDeleteContainer(updatedDeleteContainer);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await deleteProduct(id).unwrap();

    if (res?.statusCode === 200) {
      toast.success(res?.message, {
        position: 'top-right',
        duration: 1500,
        icon: '👏',
      });
    } else {
      toast.error(res?.message, {
        position: 'top-right',
        duration: 1500,
      });
    }
  };

  let allFilters = {
    page: page,
    limit: limit,
    shopkeepersEmail,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minPrice: filterPriceFrom,
    maxPrice: filterPriceTo,
    bloomDateFrom: filterBloomdateFrom,
    bloomDateTo: filterBloomdateTo,
    color: filterByColor,
    type: filterByType,
    size: filterBySize,
    fragrance: filterByFragrance,
    arrangementStyle: filterByArrangementStyle,
    occasion: filterByOccasion,
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

  const handleResetFilters = () => {
    setFilterPriceFrom('');
    setFilterPriceTo('');
    setFilterBloomdateFrom('');
    setfilterBloomdateTo('');
    setFilterByColor('');
    setFilterByType('');
    setFilterBySize('');
    setFilterByFragrance('');
    setFilterByArrangementStyle('');
    setFilterByOccasion('');

    allFilters = {
      page: page,
      limit: limit,
      shopkeepersEmail,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      minPrice: filterPriceFrom,
      maxPrice: filterPriceTo,
      bloomDateFrom: filterBloomdateFrom,
      bloomDateTo: filterBloomdateTo,
      color: filterByColor,
      type: filterByType,
      size: filterBySize,
      fragrance: filterByFragrance,
      arrangementStyle: filterByArrangementStyle,
      occasion: filterByOccasion,
    };
  };

  const { data, error, isLoading } = useGetProductsQuery(
    createQueryString(allFilters)
  );

  const products = data?.data?.data;
  // const totalItems = data?.data?.meta?.total;
  // const totalPages = Math.ceil(Number(totalItems) / Number(limit));

  return (
    <div className="mb-10 lg:mb-24 lg:mt-16 lg:shadow-md lg:rounded-md lg:py-5 lg:px-6 lg:pb-8">
      {/* header functionalities */}
      <div className="flex flex-col space-y-3 lg:flex-row justify-between items-center">
        <Link to="productmanagement/addproduct">
          <div className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-3">
            <IoIosAddCircleOutline style={{ fontSize: '18px' }} />{' '}
            <span>Add Product</span>
          </div>
        </Link>
        <div
          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2"
          onClick={() => setShowModal(!showModal)}
        >
          <TfiFilter style={{ fontSize: '18px' }} />
          <span>Filter Products</span>
        </div>
        <button
          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-8"
          type="reset"
          onClick={handleResetFilters}
        >
          Reset All Filters
        </button>
        <button
          className={`bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white  transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-8 ${
            isMultipleDeleteActive
              ? 'opacity-100 hover:bg-red-400'
              : 'opacity-50 cursor-not-allowed'
          }`}
          type="reset"
          onClick={() => handleMultipleDelete(deleteContainer)}
          disabled={!isMultipleDeleteActive}
        >
          Delete Selected
        </button>
      </div>
      <div>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              data-aos="zoom-in"
              data-aos-duration="500"
            >
              <div className="relative w-auto my-6 mx-auto">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-md font-semibold text-center">
                      Filter Products !
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
                    <div className="grid gap-4 grid-cols-2 sm:gap-x-6 sm:gap-y-4">
                      {/* price */}
                      <div className="w-full">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium "
                        >
                          Minimum Price
                        </label>

                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                          placeholder="e.g. 100"
                          value={filterPriceFrom}
                          min={1}
                          onChange={(e) => setFilterPriceFrom(e.target.value)}
                        />
                      </div>
                      <div className="full">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium "
                        >
                          Maximum Price
                        </label>

                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                          placeholder="e.g. 100"
                          value={filterPriceTo}
                          min={1}
                          onChange={(e) => setFilterPriceTo(e.target.value)}
                        />
                      </div>
                      {/* bloom date */}
                      <div className="w-full">
                        <label
                          htmlFor="bloomdate"
                          className="block mb-2 text-sm font-medium "
                        >
                          Bloom Date From
                        </label>

                        <input
                          type="date"
                          name="bloomdate"
                          id="bloomdate"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                          placeholder="e.g. January 28, 2024"
                          value={filterBloomdateFrom}
                          onChange={(e) =>
                            setFilterBloomdateFrom(e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="bloomdate"
                          className="block mb-2 text-sm font-medium "
                        >
                          Bloom Date To
                        </label>

                        <input
                          type="date"
                          name="bloomdate"
                          id="bloomdate"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
                          placeholder="e.g. January 28, 2024"
                          value={filterBloomdateTo}
                          onChange={(e) => setfilterBloomdateTo(e.target.value)}
                        />
                      </div>
                      {/* color */}
                      <div className="w-full">
                        <label
                          htmlFor="type"
                          className="block mb-2 text-sm font-medium"
                        >
                          Color
                        </label>
                        <select
                          id="color"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          value={filterByColor}
                          onChange={(e) => setFilterByColor(e.target.value)}
                        >
                          <option value="red">Red</option>
                          <option value="yellow">Yellow</option>
                          <option value="blue">Blue</option>
                          <option value="white">White</option>
                          <option value="black">Black</option>
                        </select>
                      </div>
                      {/* type */}
                      <div className="w-full">
                        <label
                          htmlFor="type"
                          className="block mb-2 text-sm font-medium"
                        >
                          Type
                        </label>
                        <select
                          id="type"
                          value={filterByType}
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          onChange={(e) => setFilterByType(e.target.value)}
                        >
                          <option value="rose">Rose</option>
                          <option value="lily">Lily</option>
                          <option value="tulip">Tulip</option>
                          <option value="orchid">Orchid</option>
                          <option value="daisy">Daisy</option>
                          <option value="sunflower">Sunflower</option>
                          <option value="carnation">Carnation</option>
                          <option value="dahlia">Dahlia</option>
                          <option value="lavender">Lavender</option>
                        </select>
                      </div>
                      {/* size */}
                      <div className="w-full">
                        <label
                          htmlFor="size"
                          className="block mb-2 text-sm font-medium"
                        >
                          Size
                        </label>
                        <select
                          id="size"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          value={filterBySize}
                          onChange={(e) => setFilterBySize(e.target.value)}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      {/* fragrance */}
                      <div className="w-full">
                        <label
                          htmlFor="type"
                          className="block mb-2 text-sm font-medium"
                        >
                          Fragrance
                        </label>
                        <select
                          id="fragrance"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          value={filterByFragrance}
                          onChange={(e) => setFilterByFragrance(e.target.value)}
                        >
                          <option value="none">None</option>
                          <option value="sweet">Sweet</option>
                          <option value="soft">Soft</option>
                          <option value="strong">Strong</option>
                        </select>
                      </div>
                      {/* arrangement style */}
                      <div className="w-full hidden lg:block">
                        <label
                          htmlFor="arrangementstyle"
                          className="block mb-2 text-sm font-medium"
                        >
                          Arrangement Style
                        </label>
                        <select
                          id="arrangementstyle"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          value={filterByArrangementStyle}
                          onChange={(e) =>
                            setFilterByArrangementStyle(e.target.value)
                          }
                        >
                          <option value="single">Single</option>
                          <option value="bouquet">Bouquet</option>
                          <option value="basket">Basket</option>
                          <option value="vase">Vase</option>
                        </select>
                      </div>
                      {/* occasion */}
                      <div className="w-full hidden lg:block">
                        <label
                          htmlFor="occasion"
                          className="block mb-2 text-sm font-medium"
                        >
                          Occasion
                        </label>
                        <select
                          id="occasion"
                          className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
                          value={filterByOccasion}
                          onChange={(e) => setFilterByOccasion(e.target.value)}
                        >
                          <option value="birthday">Birthday</option>
                          <option value="anniversary">Anniversary</option>
                          <option value="wedding">Wedding</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black transition-all duration-300"></div>
          </>
        ) : null}
      </div>

      {/* which filters are on */}
      <div className="text-center my-3">
        <div>
          {filterPriceFrom == '' &&
          filterPriceTo == '' &&
          filterByColor == '' &&
          filterByType == '' &&
          filterBySize == '' &&
          filterByFragrance == '' &&
          filterByArrangementStyle == '' &&
          filterByOccasion == '' &&
          filterBloomdateFrom == '' &&
          filterBloomdateTo == '' ? (
            <p className="font-semibold mt-6">
              Showing all products form the inventory
            </p>
          ) : (
            <div>
              <p className="font-semibold mt-6 mb-3">
                Showing products with the following filters:
              </p>
              <p className="text-sm">
                {filterPriceFrom != ''
                  ? `Minimum Price: ${filterPriceFrom}`
                  : null}
              </p>
              <p className="text-sm">
                {filterPriceTo != '' ? `Maximum Price: ${filterPriceTo}` : null}
              </p>
              <p className="text-sm">
                {filterByColor != '' ? `Color: ${filterByColor}` : null}
              </p>
              <p className="text-sm">
                {filterByType != '' ? `Type: ${filterByType}` : null}
              </p>
              <p className="text-sm">
                {filterBySize != '' ? `Size: ${filterBySize}` : null}
              </p>
              <p className="text-sm">
                {filterByFragrance != ''
                  ? `Fragrance: ${filterByFragrance}`
                  : null}
              </p>
              <p className="text-sm">
                {filterByArrangementStyle != ''
                  ? `Arrangement Style: ${filterByArrangementStyle}`
                  : null}
              </p>
              <p className="text-sm">
                {filterByOccasion != ''
                  ? `Occasion: ${filterByOccasion}`
                  : null}
              </p>
              <p className="text-sm">
                {filterBloomdateFrom != ''
                  ? `Bloom Date From: ${filterBloomdateFrom}`
                  : null}
              </p>
              <p className="text-sm">
                {filterBloomdateTo != ''
                  ? `Bloom Date To: ${filterBloomdateTo}`
                  : null}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* product list table */}
      <div className="mt-8 min-h-screen">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="select-all"
                      type="checkbox"
                      className="w-4 h-4 border-none rounded focus:outline-none"
                      onChange={(e) => handleSelectAllProductCheckbox(e)}
                      checked={
                        deleteContainer?.length == products?.length &&
                        deleteContainer?.length != 0
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="select-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
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
                  Bloom Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Color
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Size
                </th>
                <th scope="col" className="px-6 py-3">
                  Fragrance
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
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
              {!isLoading && !error && products?.length === 0 ? (
                <tr>
                  <td className="text-red-400 font-semibold whitespace-nowrap py-8 pl-12">
                    No Prodcut Found
                  </td>
                </tr>
              ) : null}
              {!isLoading && !error && products?.length > 0
                ? products.map((product: TProduct) => (
                    <tr
                      className="bg-white border-b  hover:bg-red-50"
                      key={product._id}
                    >
                      <td className="w-4 p-4">
                        <span className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="w-4 h-4 border-none rounded focus:outline-none"
                            onChange={(e) =>
                              handleSelectProductCheckbox(e, product?._id)
                            }
                            checked={deleteContainer.includes(product?._id)}
                          />
                          <label
                            htmlFor="checkbox-table-search-1"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </span>
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                      >
                        {product.name}
                      </th>
                      <td className="px-6 py-4">{`$${product.price}`}</td>
                      <td className="px-6 py-4">{product.quantity}</td>
                      <td className="px-6 py-4">{product.bloomdate}</td>
                      <td className="px-6 py-4">{product.colors.join(', ')}</td>
                      <td className="px-6 py-4">{product.type}</td>
                      <td className="px-6 py-4">{product.sizes.join(', ')}</td>
                      <td className="px-6 py-4">{product.fragrance}</td>
                      <td className="px-6 py-4 flex space-x-4 justify-center items-center mt-5">
                        <Link
                          to={`productmanagement/updateproduct/${product?._id}`}
                        >
                          <button className="text-xl" title="update product">
                            <CiEdit />
                          </button>
                        </Link>
                        <button
                          className="text-xl"
                          title="delete product"
                          onClick={() => handleDeleteProduct(product?._id)}
                        >
                          <AiOutlineDelete />
                        </button>
                        <Link
                          to={`productmanagement/createvariant/${product?._id}`}
                        >
                          <button className="text-xl" title="create variant">
                            <TbDatabaseEdit />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllProductsContainer;
