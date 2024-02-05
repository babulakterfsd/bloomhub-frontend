import { useGetProductsQuery } from '@/redux/api/productApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TShopkeeper } from '@/types/commonTypes';
import { Link } from 'react-router-dom';
import AllProductsContainer from './AllProductsContainer';

const ProductManagement = () => {
  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { email: shopkeepersEmail } = shopkeeper as TShopkeeper;

  const { data, isLoading } = useGetProductsQuery(
    `page=1&limit=10&shopkeepersEmail=${shopkeepersEmail}`
  );
  const products = data?.data?.data;

  return (
    <div>
      <h3 className="text-center lg:mt-8 text-2xl font-semibold">
        All products in the inventory
      </h3>
      {!isLoading && products?.length === 0 ? (
        <p className="text-center lg:mt-2 text-md lg:w-2/3 lg:mx-auto">
          If You are a new shopkeeper, you have to add products to your
          inventory by yourself. You can add products by clicking on the "Add
          Product" button. One shopkeeper should not see or manage other
          shopkeeper's products. So, the developer,{' '}
          <Link
            to="https://babulakter.com"
            target="_blank"
            className="font-semibold text-red-400"
          >
            Mr. Babul Akter
          </Link>{' '}
          built the logic this way.{' '}
          <span className="text-red-400">
            For testing, try login with default email as xpawal@gmail.com and
            password as awal123.
          </span>
        </p>
      ) : (
        <p className="text-center lg:mt-2 text-md lg:w-2/3 lg:mx-auto">
          A flower, also known as a bloom or blossom, is the reproductive
          structure found in flowering plants Flowers consist of a combination
          of vegetative organ
        </p>
      )}
      <div className="lg:w-11/12 lg:mx-auto">
        <AllProductsContainer />
      </div>
    </div>
  );
};

export default ProductManagement;
