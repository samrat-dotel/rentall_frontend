import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home/Home';
import Items from './pages/Items/Items';
import ItemDetails from './pages/ItemDetails/ItemDetails';
import Categories from './pages/Categories/Categories';
import Transactions from './pages/Transactions/Transactions';
import Payments from './pages/Payments/Payments';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import AddItem from './pages/AddItem/AddItem';
import OwnerRequests from './pages/OwnerRequests/OwnerRequests';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <ToastProvider>
              <Routes>
                {/* Auth pages — no navbar/footer */}
                <Route path="/login"  element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Main layout */}
                <Route element={<MainLayout />}>
                  <Route path="/"            element={<Home />} />
                  <Route path="/items"       element={<Items />} />
                  <Route path="/items/:id"   element={<ItemDetails />} />
                  <Route path="/categories"  element={<Categories />} />
                  <Route path="/add-item" element={<AddItem />} />
                  <Route path="/owner-requests" element={<OwnerRequests />} />

                  {/* Protected */}
                  <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                  <Route path="/payments"     element={<ProtectedRoute><Payments /></ProtectedRoute>} />
                  <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Route>
              </Routes>
            </ToastProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
