import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast />} />
      </Route>
    </Routes>
  );
}

export default App;
