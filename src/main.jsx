import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})
import { CartProvider } from './context/CartContext'
import { UserActivityProvider } from './context/UserActivityContext'
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserActivityProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserActivityProvider>
    </Provider>
  </React.StrictMode>,
);
