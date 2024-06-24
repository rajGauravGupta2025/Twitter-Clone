import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider for managing document head tags
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import { Provider } from 'react-redux'; // Import Provider to connect Redux store to React components
import { store } from './redux/store.js'; // Import Redux store
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate for persisting Redux store
import React from 'react'; // Import React library
import { persistor } from './redux/store.js'; // Import persistor for Redux store
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components
import App from './App.jsx'; // Import the root component App

ReactDOM.createRoot(document.getElementById('root')).render( 
  <React.StrictMode> 
    <HelmetProvider> 
      <BrowserRouter> 
        <Provider store={store}> 
          <PersistGate loading={null} persistor={persistor}> 
            <App />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode> 
);
