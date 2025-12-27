import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Landing } from './pages/Landing';
import { Login } from './pages/SignIn&Up/Login';
import { Register } from './pages/SignIn&Up/Register';
import { UserProvider } from './context/userContext';


function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
