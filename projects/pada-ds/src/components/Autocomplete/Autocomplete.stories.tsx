import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Autocomplete, type AutocompleteOption } from './Autocomplete';

const countries: AutocompleteOption[] = [
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'de', label: 'Germany' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'ke', label: 'Kenya', disabled: true },
];

const people: AutocompleteOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering', icon: 'user_default' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform', icon: 'user_default' },
  { value: 'alan', label: 'Alan Turing', description: 'Research', icon: 'user_default' },
];

const meta: Meta<typeof Autocomplete> = {
  title: 'Forms/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: { label: 'Country', options: countries, onValueChange: fn() },
  decorators: [(Story) => <div style={{ width: 320, minHeight: 280 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: 'jp' } };
export const Multiple: Story = {
  render: () => (
    <Autocomplete label="Reviewers" options={people} multiple defaultValue={['ada']} onValueChange={fn()} />
  ),
};
