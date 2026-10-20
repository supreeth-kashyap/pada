import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    visualIcon: 'bell_ring',
    title: 'Scheduled maintenance',
    subtitle: 'The workspace will be unavailable from 2am to 3am UTC.',
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithButton: Story = { args: { button: <Button variant="primary">Acknowledge</Button> } };
export const TitleOnly: Story = { args: { subtitle: undefined, title: 'New: dark mode is here' } };
