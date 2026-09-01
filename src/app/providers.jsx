import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
 
import queryClient from "../lib/queryClient";
 
const Providers = ({ children }) => {
  return (
    <BrowserRouter basename="/attendance">
      <QueryClientProvider client={queryClient}>
        {children}
 
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  );
};
 
export default Providers;