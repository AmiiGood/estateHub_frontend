import { useState } from "react";
import Login from "./Login";
import Register from "./Register";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => setIsLogin(prev => !prev);

  return (
    <>
      {isLogin ? (
        <Login onToggleView={toggleView} />
      ) : (
        <Register onToggleView={toggleView} />
      )}
    </>
  );
};

export default AuthPage;
