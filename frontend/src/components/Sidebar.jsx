import { Link, useLocation } from "react-router-dom";

const adminMenu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Products",
    path: "/admin/products",
  },
  {
    name: "Categories",
    path: "/admin/categories",
  },
  {
    name: "Order",
    path: "/admin/orders",
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside
      style={{
        width: "220px",
        background: "#ffffff",
        height: "100vh",
        padding: "20px 0",
        borderRight: "2px solid rgba(0,0,0,.1)"
      }}
    >
      <div style={{padding: "0 24px", marginBottom: "32px", fontWeight: "bold", fontSize: "1.25rem"}}>
        Dishine Backoffice
      </div>
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {adminMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                style={{
                  display: "block",
                  padding: "12px 24px",
                  color: location.pathname === item.path ? "#4F200D" : "#343131",
                  textDecoration: "none",
                  background: location.pathname === item.path ? "#FEF3E2" : "transparent",
                  borderRadius: "4px",
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
