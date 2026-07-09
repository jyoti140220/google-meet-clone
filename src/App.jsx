import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Meeting from "./pages/Meeting/Meeting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/meeting/:roomId"
        element={<Meeting />}
      />
    </Routes>
  );
}

export default App;