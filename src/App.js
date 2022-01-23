import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './page/Home.js';
import Landing from './page/Landing.js';
import Utility from './page/Utility.js';


const App = () => (
  <div>
      <Router>
        <Routes>
            <Route exact path="/" element={<Landing/>} />
            <Route exact path="/home" element={<Home/>} />
            <Route exact path="/utility" element={<Utility/>} />
        </Routes>    
      </Router>
  </div>
)

export default App
