import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Landing from '../pages/landing';
import Main from '../pages/main';
import Results from '../pages/results';

import { Provider } from 'react-redux';
import store from '../redux/store'

export default function App() {
  console.log(window.electron);
  return (
    <Provider store={store} >
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Main />} />
        <Route path="results" element={<Results />} />
      </Routes>
    </Router>
    </Provider>
  );
}
