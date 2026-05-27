import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DemoRoutes, sidebarData } from './router';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The sidebar's active item is whatever matches the current URL.
  const activeId = location.pathname.replace(/^\//, '');

  return (
    <main className="demo-shell demo-shell--with-sidebar">
      <Sidebar
        data={sidebarData}
        activeId={activeId}
        onItemClick={(item, event) => {
          if (!item.href) return;
          event.preventDefault();
          navigate(item.href);
        }}
      />
      <DemoRoutes />
    </main>
  );
};

export default App;
