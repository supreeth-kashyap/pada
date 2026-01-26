import '../styles/global.css';
import '../styles/primitives.css';
import { Accordion } from '../components/Accordion';

const App = () => {
  return (
    <main style={{ minHeight: '100vh', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <Accordion header="Accordion title 1" headerIconName="info">
        <p>This is the accordion content area.</p>
      </Accordion>
      <Accordion header="Accordion title 2" headerIconName="info">
        <p>This is the accordion content area.</p>
      </Accordion>
      <Accordion header="Accordion title 3" headerIconName="info">
        <p>This is the accordion content area.</p>
      </Accordion>
      <Accordion header="Accordion title 4" headerIconName="info">
        <p>This is the accordion content area.</p>
      </Accordion>
      <Accordion header="Accordion title 5" headerIconName="info">
        <p>This is the accordion content area.</p>
      </Accordion>
    </main>
  );
};

export default App;
