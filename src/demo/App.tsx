import './App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { ThemeProvider, ThemeToggle } from '../components/Theme';
import { DemoRoutes, sidebarData } from './router';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The sidebar's active item is whatever matches the current URL.
  const activeId = location.pathname.replace(/^\//, '');

  return (
    <ThemeProvider target="root" defaultTheme="system" storageKey="pada-demo-theme">
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
        <ThemeToggle className="demo-theme-toggle" />
      </main>
    </ThemeProvider>
  );
};

export default App;
