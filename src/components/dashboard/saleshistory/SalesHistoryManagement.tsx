import SellsSummary from './SellsSummary';

const SalesHistoryManagement = () => {
  return (
    <div>
      <h3 className="text-center lg:mt-8 text-2xl font-semibold">
        Sells summary and history of Bloomhub Shop
      </h3>
      <p className="text-center lg:mt-2 text-md lg:w-2/3 lg:mx-auto">
        A flower, also known as a bloom or blossom, is the reproductive
        structure found in flowering plants Flowers consist of a combination of
        vegetative organ
      </p>
      <div className="lg:w-11/12 lg:mx-auto">
        <SellsSummary />
      </div>
    </div>
  );
};

export default SalesHistoryManagement;
