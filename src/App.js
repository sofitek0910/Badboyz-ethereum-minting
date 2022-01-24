import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './page/Home.js';


const App = () => (
  <div>
      <Router>
        <Routes>
            <Route exact path="/" element={<Home/>} />
        </Routes>    
      </Router>
  </div>
)

export default App
