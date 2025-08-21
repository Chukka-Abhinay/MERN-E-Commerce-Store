import { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { Route,RouterProvider , createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import store from './redux/feature/store.js';

//private
import PrivateRoute from "./components/PrivateRoute.jsx" 

import AdminRoute from './pages/Admin/AdminRoute.jsx';

//Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

import Profile from './pages/User/Profile.jsx';
import UserList from './pages/Admin/userList.jsx';
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import AllProducts from './pages/Admin/AllProducts.jsx';
import Home from './Home.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route index={true} path='/' element={<Home />} />


      <Route path='' element={<PrivateRoute/>} >
        <Route path='/profile' element={<Profile/>} />
      </Route>
      <Route path='/admin' element={<AdminRoute/>}>
        <Route path='userlist' element={<UserList/>} />
        <Route path='categorylist' element={<CategoryList/>} />
        <Route path='productlist' element={<ProductList/>} />
        <Route path='productlist/:pageNumber' element={<ProductList/>} />
        <Route path='allproductslist' element={<AllProducts/>} />
        <Route path='product/update/:_id' element={<ProductUpdate/>} />
      </Route>
    </Route>
  )
)
ReactDom.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)
