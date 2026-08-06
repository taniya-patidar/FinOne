import Dashboard from './pages/Dashboard/Dashboard';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/Layout/DashboardLayout";


const App = () => {
  return(

  <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
     <Route element={<DashboardLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>
  </Routes>

  )
  
}

export default App
