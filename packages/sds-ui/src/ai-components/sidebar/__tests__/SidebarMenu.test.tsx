import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarMenu from '../SidebarMenu';
import { MoreVertical, Edit, Star, Trash2 } from 'lucide-react';

describe('SidebarMenu', () => {
  it('renders trigger and opens/closes menu', () => {
    const onRename = jest.fn();
    const onPin = jest.fn();
    const onDelete = jest.fn();

    render(
      <SidebarMenu trigger={<MoreVertical data-testid="menu-trigger" />}>
        <SidebarMenu.Item icon={<Edit />} onClick={onRename}>
          Rename
        </SidebarMenu.Item>
        <SidebarMenu.Item icon={<Star />} onClick={onPin}>
          Pin Conversation
        </SidebarMenu.Item>
        <SidebarMenu.Item icon={<Trash2 />} onClick={onDelete}>
          Delete
        </SidebarMenu.Item>
      </SidebarMenu>,
    );

    // Trigger is visible
    const trigger = screen.getByRole('button', { name: /more options/i });
    expect(trigger).toBeInTheDocument();

    // Menu is not visible initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click a menu item
    const renameItem = screen.getByRole('menuitem', { name: /rename/i });
    fireEvent.click(renameItem);
    expect(onRename).toHaveBeenCalled();

    // Menu should close after click (if your implementation closes on click)
    // If not, you can remove this assertion
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
