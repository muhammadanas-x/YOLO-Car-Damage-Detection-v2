import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from '../components/FrontPage';
import ExperimentPage from '../components/Experiment';
import UNITYAPP from './unity/unity';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/experiment" element={<ExperimentPage />} />
        <Route path="/3Dexperiment" element={<UNITYAPP/>}/>
      </Routes>
    </Router>
  );
};

export default App;
