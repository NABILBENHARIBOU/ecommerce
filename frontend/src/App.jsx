import AdminModesPaiementPage from './pages/admin/AdminModesPaiementPage';
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import AdminHeader from './pages/admin/AdminHeader'
import Panier from './components/Panier'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductList from './components/ui/ProductList'
import AdminHome from './pages/admin/AdminHome'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import AdminProducts from './pages/admin/AdminProducts'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import AdminCategories from './pages/admin/AdminCategories'
import AdminUsers from './pages/admin/AdminUsers'
import CreateUser from './pages/admin/CreateUser'
import { CartProvider } from './store/CartContext'
import { AuthProvider } from './store/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ClientOrAdminRoute from './components/ClientOrAdminRoute'
import ProductDetails from './components/ui/ProductDetails'
import AdminFooter from './pages/admin/AdminFooter'
import Statistics from './pages/admin/Statistique'
import AdminCommandes from './pages/admin/AdminCommande'
import OrdersManagement from './pages/admin/OrdersManagement'
import MyOrders from './pages/MyOrders'
import OrderConfirmation from './pages/OrderConfirmation'
import Settings from './pages/admin/Parametre'
import Categories from './pages/Categories'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          
          {/* =========================================================
              1. ROUTES PUBLIQUES & CLIENTS (Header Standard + Footer)
              ========================================================= */}
          <Route element={
            <>
              <Header />
              <main className="min-h-screen">
                <Outlet /> {/* Les pages ci-dessous s'afficheront ici */}
              </main>
              <Footer />
            </>
          }>
            {/* Publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Pages Client (Panier / Achat) */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/checkout" element={
              <ClientOrAdminRoute>
                <Checkout />
              </ClientOrAdminRoute>
            } />
            <Route path="/my-orders" element={
              <ClientOrAdminRoute>
                <MyOrders />
              </ClientOrAdminRoute>
            } />
            <Route path="/myorders" element={
              <ClientOrAdminRoute>
                <MyOrders />
              </ClientOrAdminRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
              <ClientOrAdminRoute>
                <OrderConfirmation />
              </ClientOrAdminRoute>
            } />
            
            {/* Page Profil (Protégée) */}
            <Route path="/profile" element={
              <ClientOrAdminRoute>
                <Profile />
              </ClientOrAdminRoute>
            } />
          </Route>

          {/* =========================================================
              2. ROUTES ADMIN (AdminHeader seul, pas de Footer client)
              ========================================================= */}
          <Route element={
            <AdminRoute>
              <>
                <AdminHeader />
                <main className="admin-container">
                  <Outlet /> {/* Les pages admin s'afficheront ici */}
                </main>
                <AdminFooter />
              </>
            </AdminRoute>
          }>
            <Route path="/admin/" element={<AdminHome />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/stats" element={<Statistics />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/modes-paiement" element={<AdminModesPaiementPage />} />
          </Route>

        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
export default App
