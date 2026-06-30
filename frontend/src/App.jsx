import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Competitors from './pages/Competitors';
import SwotAnalysis from './pages/SwotAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="competitors" element={<Competitors />} />
          <Route path="swot" element={<SwotAnalysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;