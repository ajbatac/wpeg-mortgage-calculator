import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ChangelogPage from "@/react-app/pages/Changelog";
import { ThemeProvider } from "@/react-app/context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
