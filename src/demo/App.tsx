import '../styles/global.css';
import '../styles/primitives.css';
import './App.css';
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { InputText } from '../components/InputText';
import { InputTextArea } from '../components/InputTextArea';
import { Loader } from '../components/Loader';
import { Modal } from '../components/Modal';
import { Notification } from '../components/Notification';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <main className="demo-shell">
      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={() => setModalOpen(true)} style={{ marginRight: '0.5rem' }}>
          Open Modal
        </Button>
        <Button variant="secondary" onClick={() => setNotificationOpen(true)}>
          Show Notification
        </Button>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Demo Modal">
        <p>This is a demo modal. Click outside or the close button to dismiss.</p>
      </Modal>

      <Notification
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
        title="Heads up!"
        subtitle="This is a demo notification. You can close it with the X."
      />

    </main>
  );
};

export default App;
