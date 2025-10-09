import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './Redux/store.js';

createRoot(document.getElementById('root')).render(
  // This provider will take a object and we add store to it and now redux store setup done
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>     {/** used for notification pop up */}
    </BrowserRouter>
  </Provider>
);
