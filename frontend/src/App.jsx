import { 
  BrowserRouter,
  Routes,
  Route
 } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { SendMoney } from './pages/SendMoney';

function App() {

  return (
     <>
  <BrowserRouter>
    <Routes>
     <Route path="/" element={<Signup />} />
     <Route path="/login" element={<Signin />} />
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/send" element={<SendMoney />} />
    </Routes>
  </BrowserRouter>
    
     
     </>
  )
}

export default App
