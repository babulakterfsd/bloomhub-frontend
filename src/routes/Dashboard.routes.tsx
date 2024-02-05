import Profile from '@/components/dashboard/Profile';
import AddProduct from '@/components/dashboard/productmanagement/AddProduct';
import CreateVariant from '@/components/dashboard/productmanagement/CreateVariant';

import ProductManagement from '@/components/dashboard/productmanagement/ProductManagement';
import UpdateProduct from '@/components/dashboard/productmanagement/UpdateProduct';
import SalesHistoryManagement from '@/components/dashboard/saleshistory/SalesHistoryManagement';
import SalesManagement from '@/components/dashboard/salesmanagement/SalesManagement';
import NotFound from '@/pages/NotFound';

export const dashboardRoutePaths = [
  { index: true, element: <ProductManagement /> },
  { path: 'profile', element: <Profile /> },
  { path: 'productmanagement/addproduct', element: <AddProduct /> },
  { path: 'productmanagement/createvariant/:id', element: <CreateVariant /> },
  { path: 'productmanagement/updateproduct/:id', element: <UpdateProduct /> },
  { path: 'salesmanagement', element: <SalesManagement /> },
  { path: 'saleshistory', element: <SalesHistoryManagement /> },
  { path: '*', element: <NotFound /> },
];
