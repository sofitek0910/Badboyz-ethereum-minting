import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './page/Home.js';
import Test from './page/Testmint.js';


const App = () => (
  <div>
      <Router>
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/test" element={<Test/>} />
        </Routes>    
      </Router>
  </div>
)

export default App
