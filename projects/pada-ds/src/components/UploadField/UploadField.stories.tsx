import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { UploadField, type UploadedFile } from './UploadField';

const sampleFiles: UploadedFile[] = [
  { id: '1', file: new File(['x'.repeat(240_000)], 'contract.pdf', { type: 'application/pdf' }), status: 'success', progress: 100 },
  { id: '2', file: new File(['x'.repeat(1_200_000)], 'site-photos.zip', { type: 'application/zip' }), status: 'uploading', progress: 45 },
  { id: '3', file: new File(['x'.repeat(9_000)], 'notes.txt', { type: 'text/plain' }), status: 'error', error: 'Upload failed. Try again.' },
];

const meta = {
  title: 'Forms/UploadField',
  component: UploadField,
  tags: ['autodocs'],
  args: { label: 'Attachments', description: 'PDF up to 10 MB.', accept: 'application/pdf', maxSize: 10 * 1024 * 1024, onUpload: fn(), onFilesChange: fn() },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
} satisfies Meta<typeof UploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true, maxFiles: 5, accept: undefined, description: 'Up to 5 files.' } };
export const WithFiles: Story = { args: { multiple: true, accept: undefined, files: sampleFiles } };
export const WithError: Story = { args: { required: true, error: 'Attach the signed contract.' } };
export const Disabled: Story = { args: { disabled: true } };
