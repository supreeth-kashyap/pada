import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tree, type TreeNode } from '.';

const items: TreeNode[] = [
  {
    value: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { value: 'index', label: 'index.ts' },
      { value: 'theme', label: 'theme.css' },
    ],
  },
  { value: 'readme', label: 'README.md' },
];

describe('Tree (styled)', () => {
  it('renders nested items from data and selects them', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tree aria-label="Project" items={items} onValueChange={onValueChange} />);
    const src = screen.getByRole('treeitem', { name: 'src' });
    expect(src.firstElementChild).toHaveClass('tree-row');
    await user.click(screen.getByText('src').closest('.tree-row')!.querySelector('.tree-indicator')!);
    expect(screen.getByRole('treeitem', { name: 'theme.css' })).toHaveAttribute('aria-level', '2');
    await user.click(screen.getByText('theme.css'));
    expect(onValueChange).toHaveBeenCalledWith(['theme']);
    expect(await axeViolations()).toEqual([]);
  });
});
