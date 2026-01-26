import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { InputDate } from '../components/InputDate';

const App = () => {
  return (
    <main className="demo-shell">
      <div className="demo-input-date">
        <InputDate label="Date" placeholder="01/01/2026" />
      </div>
    </main>
  );
};

export default App;
