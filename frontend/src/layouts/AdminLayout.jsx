import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FAF6F0"
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "32px 40px",
          overflowY: "auto"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
