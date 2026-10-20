import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Placeholder } from '../../stories/Placeholder';
import { Resizable } from '.';

const panel = { height: '100%', boxSizing: 'border-box' } as const;

const meta = {
  title: 'Layout/Resizable',
  component: Resizable.Root,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ height: 360 }}><Story /></div>],
} satisfies Meta<typeof Resizable.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Resizable.Root onSizesCommit={fn()}>
      <Resizable.Panel defaultSize={30} minSize={15} maxSize={50} collapsible>
        <Placeholder style={panel}>Files</Placeholder>
      </Resizable.Panel>
      <Resizable.Handle withGrip aria-label="Resize file list" />
      <Resizable.Panel>
        <Placeholder style={panel}>Editor</Placeholder>
      </Resizable.Panel>
    </Resizable.Root>
  ),
};

export const Nested: Story = {
  render: () => (
    <Resizable.Root>
      <Resizable.Panel defaultSize={25} minSize={15} maxSize={40} collapsible>
        <Placeholder style={panel}>Files</Placeholder>
      </Resizable.Panel>
      <Resizable.Handle withGrip aria-label="Resize file list" />
      <Resizable.Panel minSize={30}>
        <Resizable.Root orientation="vertical">
          <Resizable.Panel defaultSize={65}>
            <Placeholder style={panel}>Editor</Placeholder>
          </Resizable.Panel>
          <Resizable.Handle aria-label="Resize terminal" />
          <Resizable.Panel>
            <Placeholder style={panel}>Terminal</Placeholder>
          </Resizable.Panel>
        </Resizable.Root>
      </Resizable.Panel>
    </Resizable.Root>
  ),
};
