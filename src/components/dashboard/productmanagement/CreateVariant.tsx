import {
  flowerArrangementStyle,
  flowerColors,
  flowerOccasions,
  flowerSizes,
} from '@/lib/utils';
import {
  useCreateProductMutation,
  useGetSingleProductQuery,
} from '@/redux/api/productApi';
import { useCurrentShopkeeper } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TShopkeeper } from '@/types/commonTypes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'sonner';

const CreateVariant = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleProductQuery(id as string);
  const mainProduct = data?.data;

  const [name, setName] = useState<string>(mainProduct?.name);
  const [price, setPrice] = useState<string>(mainProduct?.price);
  const [quantity, setQuantity] = useState<string>(mainProduct?.quantity);
  const [bloomdate, setBloomdate] = useState<string>(mainProduct?.bloomdate);
  const [colors, setColors] = useState<string[]>(mainProduct?.colors);
  const [type, setType] = useState<string>(mainProduct?.type);
  const [sizes, setSizes] = useState<string[]>(mainProduct?.sizes);
  const [fragrance, setFragrance] = useState<string>(mainProduct?.fragrance);
  const [arrangementStyles, setArrangementStyles] = useState<string[]>(
    mainProduct?.arrangementStyles
  );
  const [occasions, setOccasions] = useState<string[]>(mainProduct?.occasions);
  const [isDiscountRunning, setIsDiscountRunning] = useState<string>(
    mainProduct?.discount
  );
  const shopkeeper = useAppSelector(useCurrentShopkeeper);
  const { _id, email } = shopkeeper as TShopkeeper;
  const [createProduct] = useCreateProductMutation();
  const navigate = useNavigate();

  useEffect(() => {
    setName(mainProduct?.name);
    setPrice(mainProduct?.price);
    setQuantity(mainProduct?.quantity);
    setBloomdate(mainProduct?.bloomdate);
    setColors(mainProduct?.colors);
    setType(mainProduct?.type);
    setSizes(mainProduct?.sizes);
    setFragrance(mainProduct?.fragrance);
    setArrangementStyles(mainProduct?.arrangementStyles);
    setOccasions(mainProduct?.occasions);
    setIsDiscountRunning(mainProduct?.discount);
  }, [mainProduct, isLoading]);

  const handleColorChange = (selectedColors: any) => {
    const selectedColorValues = selectedColors.map((color: any) => color.value);
    setColors(selectedColorValues);
  };
  const handleSizeChange = (selectedSizes: any) => {
    const selectedSizeValues = selectedSizes.map((size: any) => size.value);
    setSizes(selectedSizeValues);
  };
  const handleArrangementChange = (selectedArrangement: any) => {
    const selectedArrangementValues = selectedArrangement.map(
      (arr: any) => arr.value
    );
    setArrangementStyles(selectedArrangementValues);
  };
  const handleOccasionsChange = (selectedOccasion: any) => {
    const selectedOccasionValues = selectedOccasion.map(
      (occasion: any) => occasion.value
    );
    setOccasions(selectedOccasionValues);
  };

  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    const productData = {
      name,
      price: Number(price),
      quantity: Number(quantity),
      bloomdate,
      colors,
      type,
      sizes,
      fragrance,
      arrangementStyles,
      occasions,
      discount: isDiscountRunning,
      createdBy: _id as string,
      creatorsEmail: email as string,
    };

    if (productData?.price < 1) {
      toast.error('Price must be equal or greater than 1', {
        position: 'top-right',
        duration: 1500,
      });
    } else if (productData?.quantity < 1) {
      toast.error('Quantity must be equal or greater than 1', {
        position: 'top-right',
        duration: 1500,
      });
    } else {
      const response = await createProduct(productData).unwrap();

      if (response?.statusCode === 201) {
        toast.success('Product created successfully', {
          position: 'top-right',
          icon: '👏',
          duration: 1500,
        });
        setName('');
        setPrice('');
        setQuantity('');
        setBloomdate('');
        setColors([]);
        setType('');
        setSizes([]);
        setFragrance('');
        setArrangementStyles([]);
        setOccasions([]);
        setIsDiscountRunning('false');

        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        toast.error(response?.data?.errorMessage, {
          position: 'top-right',
          icon: '😢',
          duration: 1500,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-300"></div>
      </div>
    );
  }

  return (
    <div className="sm:mt-16 sm:mb-32 sm:w-5/6 sm:mx-auto md:shadow-md md:px-6 md:py-4 md:rounded-lg">
      <h6 className="text-center text-xl font-semibold mb-6">
        Add product to inventory from existing variants
      </h6>
      <form onSubmit={handleAddProduct}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium ">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
              placeholder="e.g. Rose Flower Bouquet"
              minLength={5}
              maxLength={50}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* price */}
          <div className="w-full">
            <label htmlFor="price" className="block mb-2 text-sm font-medium ">
              Price
            </label>

            <input
              type="number"
              name="price"
              id="price"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
              placeholder="e.g. 100"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {/* quantity */}
          <div className="w-full">
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium "
            >
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              id="quantity"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
              placeholder="e.g. 100"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          {/* bloom date */}
          <div className="w-full">
            <label
              htmlFor="bloomdate"
              className="block mb-2 text-sm font-medium "
            >
              Bloom Date
            </label>

            <input
              type="date"
              name="bloomdate"
              id="bloomdate"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600  focus:outline-none"
              placeholder="e.g. January 28, 2024"
              required
              value={bloomdate}
              onChange={(e) => setBloomdate(e.target.value)}
            />
          </div>
          {/* discount */}
          <div className="w-full">
            <label
              htmlFor="discount"
              className="block mb-2 text-sm font-medium "
            >
              Discount
            </label>
            <select
              id="discount"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
              required
              value={isDiscountRunning}
              onChange={(e) => setIsDiscountRunning(e.target.value)}
            >
              <option value="false" defaultValue="false">
                false
              </option>
              <option value="true">true</option>
            </select>
          </div>
          {/* type */}
          <div className="w-full">
            <label htmlFor="type" className="block mb-2 text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" defaultValue="">
                select
              </option>
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
          {/* fragrance */}
          <div className="w-full">
            <label htmlFor="type" className="block mb-2 text-sm font-medium">
              Fragrance
            </label>
            <select
              id="fragrance"
              className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-600 focus:outline-none"
              required
              value={fragrance}
              onChange={(e) => setFragrance(e.target.value)}
            >
              <option value="none" defaultValue="none">
                None
              </option>
              <option value="sweet">Sweet</option>
              <option value="soft">Soft</option>
              <option value="strong">Strong</option>
            </select>
          </div>
          {/* color */}
          <div className="w-full sm:col-span-2 md:col-span-1">
            <label htmlFor="colors" className="block mb-2 text-sm font-medium">
              Colors
            </label>
            <Select
              value={flowerColors.filter((flower) =>
                colors?.includes(flower.value)
              )}
              isMulti
              required
              name="colors"
              options={flowerColors}
              className="text-sm rounded-lg block w-full p-2.5 py-0 focus:outline-none"
              classNamePrefix="select"
              onChange={handleColorChange}
            />
          </div>
          {/* sizes */}
          <div className="w-full sm:col-span-2 md:col-span-1">
            <label htmlFor="sizes" className="block mb-2 text-sm font-medium">
              Sizes
            </label>
            <Select
              value={flowerSizes.filter((flower) =>
                sizes?.includes(flower.value)
              )}
              isMulti
              required
              name="sizes"
              options={flowerSizes}
              className="text-sm rounded-lg block w-full p-2.5 py-0 focus:outline-none"
              classNamePrefix="select"
              onChange={handleSizeChange}
            />
          </div>
          {/* arrangement style */}
          <div className="w-full sm:col-span-2 md:col-span-1">
            <label
              htmlFor="arrangementStyles"
              className="block mb-2 text-sm font-medium"
            >
              Arrangement Styles
            </label>
            <Select
              value={flowerArrangementStyle.filter((flower) =>
                arrangementStyles?.includes(flower.value)
              )}
              isMulti
              required
              name="arrangementStyles"
              options={flowerArrangementStyle}
              className="text-sm rounded-lg block w-full p-2.5 py-0 focus:outline-none"
              classNamePrefix="select"
              onChange={handleArrangementChange}
            />
          </div>
          {/* occasions */}
          <div className="w-full sm:col-span-2 md:col-span-1">
            <label
              htmlFor="occasions"
              className="block mb-2 text-sm font-medium"
            >
              Occasions
            </label>
            <Select
              value={flowerOccasions.filter((flower) =>
                occasions?.includes(flower.value)
              )}
              isMulti
              required
              name="occasions"
              options={flowerOccasions}
              className="text-sm rounded-lg block w-full p-2.5 py-0 focus:outline-none"
              classNamePrefix="select"
              onChange={handleOccasionsChange}
            />
          </div>
        </div>
        <button
          className="bg-red-300 rounded-md px-4 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-8"
          type="submit"
        >
          Create Variant
        </button>
      </form>
    </div>
  );
};

export default CreateVariant;
