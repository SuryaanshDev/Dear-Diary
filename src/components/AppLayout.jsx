import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
    </div>
  );
}

export default AppLayout;

