import App from '@/pages/home/App';
import { FactCheck } from './pages/FactCheck';
import { BrowserRouter, Routes, Route } from "react-router";
import { DeepfakeDectector } from './pages/deepfake';


function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/deepfake-detection" element={<DeepfakeDectector />} />
        <Route path="/fact-check" element={<FactCheck />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
