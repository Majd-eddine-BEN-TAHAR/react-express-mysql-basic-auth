import { Link, useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>This page is only accessible to admin users.</p>
      <Link className="link" to="/dashboard">
        dashboard Page
      </Link>
      <button onClick={handleLogout} style={{ display: "block" }}>
        Logout
      </button>
    </div>
  );
}

export default AdminPage;
