import App from '@/pages/home/App';
import { Explore } from '@/pages/explore';
import { BrowserRouter, Routes, Route } from "react-router";
import { DeepfakeDectector } from './pages/deepfake';

function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/deepfake-detection" element={<DeepfakeDectector />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
