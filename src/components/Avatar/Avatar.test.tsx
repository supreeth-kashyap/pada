import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Avatar, AvatarGroup } from './Avatar';

// jsdom never loads images; drive the load events by hand.
const images: { onload?: () => void; onerror?: () => void; src?: string }[] = [];
const RealImage = globalThis.Image;
beforeEach(() => {
  images.length = 0;
  // @ts-expect-error minimal stand-in for HTMLImageElement loading
  globalThis.Image = class {
    onload?: () => void;
    onerror?: () => void;
    src?: string;
    constructor() {
      images.push(this);
    }
  };
});
afterEach(() => {
  globalThis.Image = RealImage;
});

describe('Avatar', () => {
  it('shows initials with a stable colour until the image loads', async () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" size="lg" />);
    const fallback = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(fallback).toHaveTextContent('AL');
    expect(fallback).toHaveAttribute('data-color');
    act(() => images[0].onload?.());
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).tagName).toBe('IMG');
    expect(await axeViolations()).toEqual([]);
  });

  it('keeps the fallback when the image fails, and uses an icon without a name', () => {
    render(
      <>
        <Avatar name="Grace Hopper" src="/broken.png" />
        <Avatar alt="Unknown user" />
      </>,
    );
    act(() => images[0].onerror?.());
    expect(screen.getByRole('img', { name: 'Grace Hopper' })).toHaveTextContent('GH');
    expect(screen.getByRole('img', { name: 'Unknown user' }).querySelector('svg')).not.toBeNull();
  });

  it('groups avatars with an overflow count', () => {
    render(
      <AvatarGroup label="Members" max={2} size="sm">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" />
        <Avatar name="Edsger Dijkstra" />
      </AvatarGroup>,
    );
    const group = screen.getByRole('group', { name: 'Members' });
    expect(group.querySelectorAll('.avatar')).toHaveLength(3);
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('data-size', 'sm');
  });
});
