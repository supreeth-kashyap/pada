import '../styles/global.css';
import '../styles/primitives.css';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

const App = () => {
  const handleBannerAction = () => {
    window.alert('Banner action clicked');
  };

  return (
    <main style={{ minHeight: '100vh', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg)' }}>
      <Banner
        title="Banner title"
        subtitle="This is a subtitle that can wrap to a second line if needed."
        visual={<Icon name="info" size="lg" />}
        button={<Button variant="secondary">Action</Button>}
        onButtonClick={handleBannerAction}
      />
    </main>
  );
};

export default App;
