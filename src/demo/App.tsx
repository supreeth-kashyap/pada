import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import { InputText } from '../components/InputText';
import { InputTextArea } from '../components/InputTextArea';

const App = () => {
  return (
    <main className="demo-shell">
      <div className="demo-input-date">
        <InputText label="Thoughts" placeholder="Type in your thoughts" />
        <InputTextArea label="More thoughts" placeholder="Type in your thoughts" />
      </div>
    </main>
  );
};

export default App;
