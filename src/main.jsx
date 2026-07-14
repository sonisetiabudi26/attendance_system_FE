import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from "@/App.jsx"
import { AuthProvider } from "@/features/auth/context/auth.context"
import { ToastProvider } from "@/context/ToastContext.jsx"
import ErrorBoundary from "@/shared/components/common/ErrorBoundary.jsx"
import "@/index.css"
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
          <AuthProvider>
             
            <App />
            
          </AuthProvider>
          </ToastProvider>
          </QueryClientProvider>
        
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
