import { useNavigate, Link } from "react-router-dom";
import { decodeTokenFn } from "../utils/utils";

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = decodeTokenFn(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>This page is only accessible to authenticated users.</p>
      <p>Welcome, {user.username}!</p>
      {user.role === "ADMIN_ROLE" && (
        <Link className="link" to="/admin">
          Admin Page
        </Link>
      )}
      <button onClick={handleLogout} style={{ display: "block" }}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
