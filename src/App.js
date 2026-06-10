import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Game from './component/Game';
import Clock from './component/Clock';
import Counter from './component/Counter';
import HelloMessage from './component/Message';
import FlavorForm from './component/FormList';
import LoginControl from './component/LoginBox';
import Stopwatch from './component/Stopwatch';
import TaskListPage from './component/TaskListPage';
import LogPage from './component/LogPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/message" element={<HelloMessage />} />
        <Route path="/form" element={<FlavorForm />} />
        <Route path="/loginBox" element={<LoginControl />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route path="/log" element={<LogPage />} />
        <Route path="/taskListPage" element={<TaskListPage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
