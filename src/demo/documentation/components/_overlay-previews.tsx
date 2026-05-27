import { useState } from 'react';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { SideDrawer } from '../../../components/SideDrawer';
import { Popover } from '../../../components/Popover';

export function ModalDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onOpenChange={setOpen} title="Confirm action">
        Are you sure? This action cannot be undone.
      </Modal>
    </div>
  );
}

export function SideDrawerDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <SideDrawer open={open} onOpenChange={setOpen} size="md">
        <div style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Settings</h2>
          <p>Drawer content lives here.</p>
        </div>
      </SideDrawer>
    </div>
  );
}

export function PopoverDemoPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-page__showcase">
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="ghost">Show popover</Button>}
        title="Quick tip"
      >
        Popovers display extra content anchored to a trigger.
      </Popover>
    </div>
  );
}
