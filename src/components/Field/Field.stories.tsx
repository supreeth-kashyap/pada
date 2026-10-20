import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '.';

const meta = {
  title: 'Components/Field',
  component: Field.Root,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root required>
      <Field.Label>Work email</Field.Label>
      <Field.Control type="email" placeholder="you@company.com" />
      <Field.Description>We’ll send the invite here.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root required invalid>
      <Field.Label>Work email</Field.Label>
      <Field.Control type="email" defaultValue="grace@" />
      <Field.Error>Enter a complete email address.</Field.Error>
    </Field.Root>
  ),
};

export const CustomControl: Story = {
  render: () => (
    <Field.Root>
      <Field.Label optional>About you</Field.Label>
      <Field.Control asChild>
        <textarea rows={3} />
      </Field.Control>
    </Field.Root>
  ),
};
