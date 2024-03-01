import { Link } from "react-router-dom";
import { decodeTokenFn } from "../utils/utils";

function HomePage() {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && decodeTokenFn(token);

  return (
    <div className="home-container">
      <h1>Welcome to Our App</h1>
      <p>This is the home page. Please login or register to continue.</p>
      {!isAuthenticated && (
        <div>
          <Link to="/login" style={{ margin: "10px" }}>
            Login
          </Link>
          <Link to="/register" style={{ margin: "10px" }}>
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
