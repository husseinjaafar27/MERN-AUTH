import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Activate from "./components/Activate";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import ValidateResetCode from "./components/ValidateResetCode";
import ChangePassword from "./components/ChangePassword";

function App() {
  const user = localStorage.getItem("user");

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/activate" exact element={<Activate />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/forgot" exact element={<Forgot />} />
      <Route path="/validateResetCode" exact element={<ValidateResetCode />} />
      <Route path="/changePassword" exact element={<ChangePassword />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
