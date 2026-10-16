import { Link, useLocation } from 'react-router-dom';
import { FiBox, FiClipboard, FiGrid, FiLayers, FiUsers } from 'react-icons/fi';
import './Sidebar.css';

const adminMenu = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
  { name: 'Products', path: '/admin/products', icon: FiBox },
  { name: 'Categories', path: '/admin/categories', icon: FiLayers },
  { name: 'Orders', path: '/admin/orders', icon: FiClipboard },
  { name: 'Customers', path: '/admin/customers', icon: FiUsers },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <Link to="/admin/dashboard" className="admin-brand"><span>DS</span><div><strong>DISHINE</strong><small>Backoffice</small></div></Link>
      <p className="sidebar-label">Workspace</p>
      <nav className="admin-nav">
        {/* eslint-disable-next-line no-unused-vars */}
        {adminMenu.map(({ name, path, icon: NavIcon }) => (
          <Link key={path} to={path} className={location.pathname === path ? 'active' : ''}><NavIcon /><span>{name}</span></Link>
        ))}
      </nav>
      <div className="sidebar-bottom"><p>Manage your store<br />with clarity.</p></div>
    </aside>
  );
};

export default Sidebar;
