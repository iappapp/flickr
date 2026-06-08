import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Game from './component/Game';
import Clock from './component/Clock';
import WebApp from './component/WebApp';
import Counter from './component/Counter';
import HelloMessage from './component/Message';
import FlavorForm from './component/FormList';
import LoginControl from './component/LoginBox';

function Home() {
  return (
    <div className="App" width="1920px" height="1080px">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <div style={{marginTop:20}}>
          <Link className="App-link" to="/login">前往登录页面</Link>
        </div>

        <div style={{marginTop:20}}>
          <Link className="App-link" to="/game">前往游戏页面</Link>
        </div>

        <div style={{marginTop:20}}>
          <Link className="App-link" to="/loginBox">前往登录控制页面</Link>
        </div>

        <Counter />
        <Clock />
        <Clock />
        <Clock />
        <WebApp />
      </header>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/message" element={<HelloMessage />} />
      <Route path="/form" element={<FlavorForm />} />
      <Route path="/loginBox" element={<LoginControl />} />
    </Routes>
  );
}

export default App;
