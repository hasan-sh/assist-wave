import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PatientVoiceInput from './components/PatientVoiceInput';
import StaffDashboard from './components/StaffDashboard';
import Header from './components/Header';


const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<PatientVoiceInput />} />
                <Route path="/staff" element={<StaffDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
