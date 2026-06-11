import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Game from './pages/Game';
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
import PeriodicTablePage from './pages/PeriodicTablePage'; // 新增导入
import WeatherPage from './weather/WeatherPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/periodic-table" element={<PeriodicTablePage />} /> {/* 新增路由 */}
        <Route path="/weather" element={<WeatherPage />} />
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