import '../styles/global.css';
import '../styles/primitives.css';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const App = () => {
  const handleSplitClick = () => {
    window.alert('Splitter clicked');
  };

  return (
    <main style={{ minHeight: '100vh', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" leftIcon="info" rightIcon="chevron_down">
            With Icons
          </Button>
          <Button variant="primary" leftIcon="info" aria-label="Primary info" />
          <Button variant="secondary" leftIcon="info" aria-label="Secondary info" />
          <Button variant="ghost" leftIcon="info" aria-label="Ghost info" />
          <Button variant="secondary" leftIcon="info" split>
            Split Button
          </Button>
          <Button variant="secondary" leftIcon="info" split onSplitClick={handleSplitClick}>
            Split With Action
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default App;
