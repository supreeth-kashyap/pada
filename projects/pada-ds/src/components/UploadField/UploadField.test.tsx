import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { UploadField, type UploadedFile } from '.';

const file = (name: string, size = 10) => new File(['x'.repeat(size)], name, { type: 'text/plain' });

describe('UploadField', () => {
  it('is a labelled, described file input that keyboard users can reach', async () => {
    render(<UploadField label="Evidence" description="Attach the signed policy." accept=".pdf" maxSize={1024} />);
    const input = screen.getByLabelText('Evidence');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAccessibleDescription('Attach the signed policy. Supported type(s): .pdf Max size: 1 KB');
    await userEvent.setup().tab();
    expect(input).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
  });

  it('lists picked files and flags ones over the size limit', async () => {
    const user = userEvent.setup();
    render(<UploadField label="Evidence" multiple maxSize={5} />);
    await user.upload(screen.getByLabelText('Evidence'), [file('small.txt', 2), file('big.txt', 50)]);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[1]).toHaveAttribute('data-status', 'error');
    expect(items[1]).toHaveTextContent('File size exceeds 5 Bytes');
    await user.click(screen.getByRole('button', { name: 'Remove big.txt' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('View calls onView with the file', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const files: UploadedFile[] = [{ id: '1', file: file('report.txt'), progress: 40 }];
    render(<UploadField label="Evidence" files={files} onView={onView} />);
    expect(screen.getByRole('progressbar', { name: 'Uploading report.txt' })).toHaveAttribute('aria-valuenow', '40');
    await user.click(screen.getByRole('button', { name: 'View report.txt' }));
    expect(onView).toHaveBeenCalledWith(files[0]);
  });
});
