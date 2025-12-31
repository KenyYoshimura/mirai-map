import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import DiagnosisPage from './pages/DiagnosisPage';
import LoadingPage from './pages/LoadingPage';
import ResultPage from './pages/ResultPage';
import './App.css';

function App() {
  const [userData, setUserData] = useState({
    name: '',
    birthDate: '',
    answers: {}
  });

  const [diagnosisResult, setDiagnosisResult] = useState(null);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/input"
            element={
              <InputPage
                userData={userData}
                setUserData={setUserData}
              />
            }
          />
          <Route
            path="/diagnosis"
            element={
              <DiagnosisPage
                userData={userData}
                setUserData={setUserData}
                setDiagnosisResult={setDiagnosisResult}
              />
            }
          />
          <Route
            path="/loading"
            element={<LoadingPage />}
          />
          <Route
            path="/result"
            element={
              <ResultPage
                userData={userData}
                diagnosisResult={diagnosisResult}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
