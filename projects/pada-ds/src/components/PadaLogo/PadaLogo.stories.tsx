import type { Meta, StoryObj } from '@storybook/react-vite';
import { PadaLogo } from './PadaLogo';

const meta = {
  title: 'Foundation/PadaLogo',
  component: PadaLogo,
  tags: ['autodocs'],
  args: { variant: 'lockup', tone: 'color', size: 'lg' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['lockup', 'mark', 'wordmark'] },
    tone: { control: 'inline-radio', options: ['color', 'accent', 'mono'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    animated: { control: 'inline-radio', options: [false, true, 'loop'] },
  },
} satisfies Meta<typeof PadaLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lockup: Story = {};
export const Mark: Story = { args: { variant: 'mark' } };
export const Wordmark: Story = { args: { variant: 'wordmark' } };
export const Accent: Story = { args: { tone: 'accent' } };
export const Animated: Story = { args: { variant: 'mark', size: 'xl', animated: 'loop' } };
