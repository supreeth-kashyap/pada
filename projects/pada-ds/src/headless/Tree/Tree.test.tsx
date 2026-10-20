import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tree, type TreeRootProps } from '.';

function Item({ value, children, disabled }: { value: string; children?: ReactNode; disabled?: boolean }) {
  return (
    <Tree.Item value={value} expandable={!!children} disabled={disabled}>
      <Tree.ItemRow>
        <Tree.ItemIndicator data-testid={`toggle-${value}`}>▸</Tree.ItemIndicator>
        <Tree.ItemLabel>{value}</Tree.ItemLabel>
      </Tree.ItemRow>
      {children && <Tree.Group>{children}</Tree.Group>}
    </Tree.Item>
  );
}

function Example(props: Partial<TreeRootProps>) {
  return (
    <Tree.Root aria-label="Files" {...props}>
      <Item value="src">
        <Item value="components">
          <Item value="Button.tsx" />
        </Item>
        <Item value="index.ts" />
      </Item>
      <Item value="docs">
        <Item value="guide.md" />
      </Item>
      <Item value="package.json" disabled />
    </Tree.Root>
  );
}

const item = (name: string) => screen.getByRole('treeitem', { name });

describe('Tree', () => {
  it('exposes tree semantics with levels, expanded and selected state, and one tab stop', async () => {
    render(<Example defaultExpanded={['src']} defaultValue={['index.ts']} />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    expect(item('docs')).toHaveAttribute('aria-expanded', 'false');
    expect(item('index.ts')).toHaveAttribute('aria-level', '2');
    expect(item('index.ts')).toHaveAttribute('aria-selected', 'true');
    expect(item('index.ts')).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('treeitem').filter((element) => element.tabIndex === 0)).toHaveLength(1);
    expect(screen.queryByRole('treeitem', { name: 'guide.md' })).toBeNull();
    expect(await axeViolations()).toEqual([]);
  });

  it('navigates with arrows: Right expands then enters, Left collapses then goes up', async () => {
    const user = userEvent.setup();
    render(<Example />);
    item('src').focus();
    await user.keyboard('{ArrowRight}');
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    expect(item('components')).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(item('docs')).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowLeft}');
    expect(item('src')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{End}');
    expect(item('package.json')).toHaveFocus();
    await user.keyboard('{Home}*');
    expect(item('docs')).toHaveAttribute('aria-expanded', 'true');
    // Type-ahead
    await user.keyboard('g');
    expect(item('guide.md')).toHaveFocus();
  });

  it('selects with Enter and click; multiple mode toggles; disabled items are not selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example selectionMode="multiple" defaultExpanded={['src']} onValueChange={onValueChange} />);
    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(screen.getByText('index.ts'));
    expect(onValueChange).toHaveBeenLastCalledWith(['index.ts']);
    expect(item('index.ts')).toHaveFocus();
    await user.keyboard('{ArrowUp} ');
    expect(onValueChange).toHaveBeenLastCalledWith(['index.ts', 'components']);
    await user.click(screen.getByText('package.json'));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    // The indicator toggles without selecting.
    await user.click(screen.getByTestId('toggle-docs'));
    expect(item('docs')).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });
});
