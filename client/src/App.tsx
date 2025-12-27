import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Landing } from './pages/Landing';
import { Login } from './pages/SignIn&Up/Login';
import { Register } from './pages/SignIn&Up/Register';
import { UserProvider } from './context/userContext';
import { ProtectedUser } from './components/protectedUser';
import { PanelInstructor } from './components/ui/dashboard/PanelInstructor';
import { Perfil } from './components/ui/dashboard/perfil';


function App() {
  return (
    <Router>
      <UserProvider>
          <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/suscripcion' element={<div>Hola Suscripción</div>}/>
            <Route element={<ProtectedUser/>}>
              <Route path='/dashboard/instructor' element={<PanelInstructor/>}/>
              <Route path='/perfil' element={<Perfil/>}/>
            </Route>
          </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
