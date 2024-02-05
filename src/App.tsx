import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import { persistor, store } from './redux/store';
import router from './routes/All.routes';
import './styles/index.css';

function App() {
  useEffect(() => {
    Aos.init({
      offset: 20,
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <Toaster />
    </Provider>
  );
}

export default App;
