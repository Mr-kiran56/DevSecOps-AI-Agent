import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RepoProvider } from "@/context/RepoContext";
import SetupPage from "@/pages/SetupPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";

const App = () => (
  <RepoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </RepoProvider>
);

export default App;
