import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Accordion } from '.';

describe('Accordion (styled)', () => {
  it('keeps the 1.x API: header, icon, controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Accordion header="What is Pada?" headerIconName="help_outline" open={false} onOpenChange={onOpenChange}>
        Body
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: 'What is Pada?' });
    expect(trigger).toHaveClass('accordion-header');
    expect(trigger.closest('h3')).toHaveClass('accordion-heading');
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Accordion header="What is Pada?" open onOpenChange={onOpenChange} headingLevel={2}>
        Body
      </Accordion>,
    );
    expect(screen.getByRole('region', { name: 'What is Pada?' })).toHaveTextContent('Body');
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(screen.getByRole('button', { name: 'What is Pada?' }));
    expect(await axeViolations()).toEqual([]);
  });

  it('composes a group from parts', async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="a">
          <Accordion.Trigger iconName="download_2">Install</Accordion.Trigger>
          <Accordion.Content>npm install pada-ds</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Use</Accordion.Trigger>
          <Accordion.Content>Import a component</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Install' }));
    expect(screen.getByRole('region', { name: 'Install' })).toHaveClass('accordion-content');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Use' })).toHaveFocus();
    expect(await axeViolations()).toEqual([]);
  });
});
