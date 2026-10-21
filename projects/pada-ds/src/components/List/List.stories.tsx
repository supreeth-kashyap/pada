import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { List, ListItem } from '.';

const meta = {
  title: 'Layout/List',
  component: List,
  tags: ['autodocs'],
  args: {
    children: [
      <ListItem key="a">Hello world</ListItem>,
      <ListItem key="b">Welcome to Pada</ListItem>,
      <ListItem key="c">Your weekly digest is ready</ListItem>,
    ],
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Reorderable: Story = {
  args: {
    draggable: true,
    label: 'Release checklist',
    onReorder: fn(),
    children: [
      <ListItem key="tokens" id="tokens">Ship tokens v2</ListItem>,
      <ListItem key="docs" id="docs">Write the migration guide</ListItem>,
      <ListItem key="announce" id="announce">Announce the release</ListItem>,
    ],
  },
};
