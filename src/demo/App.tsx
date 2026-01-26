import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { Icon } from '../components/Icon';

const App = () => {
  return (
    <main className="demo-shell">
      <Icon src="e88a" size={24} color="var(--color-neutral-600)" />
    </main>
  );
};

export default App;
