import App from '@/pages/home/App';
import { Explore } from '@/pages/explore';
import { BrowserRouter, Routes, Route } from "react-router";

function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
