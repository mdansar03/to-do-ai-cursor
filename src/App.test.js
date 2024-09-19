import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Todo App', () => {
  test('renders app title', () => {
    render(<App />);
    expect(screen.getByText("Cursor's Todo App")).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'New Todo Item');
    await userEvent.click(addButton);

    expect(screen.getByText('New Todo Item')).toBeInTheDocument();
  });

  test('toggles todo completion', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Toggle Todo');
    await userEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test('deletes a todo', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Todo to delete');
    await userEvent.click(addButton);

    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);

    expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  });

  test('edits a todo', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Todo to edit');
    await userEvent.click(addButton);

    const todoText = screen.getByText('Todo to edit');
    await userEvent.click(todoText);

    const editInput = screen.getByDisplayValue('Todo to edit');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Edited Todo');
    fireEvent.blur(editInput);

    expect(screen.getByText('Edited Todo')).toBeInTheDocument();
    expect(screen.queryByText('Todo to edit')).not.toBeInTheDocument();
  });

  test('adds a subtask', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Main Todo');
    await userEvent.click(addButton);

    const subtaskInput = screen.getByPlaceholderText('Add a subtask');
    const addSubtaskButton = screen.getByText('+');

    await userEvent.type(subtaskInput, 'New Subtask');
    await userEvent.click(addSubtaskButton);

    expect(screen.getByText('New Subtask')).toBeInTheDocument();
  });

  test('updates progress bar', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Todo 1');
    await userEvent.click(addButton);
    await userEvent.type(input, 'Todo 2');
    await userEvent.click(addButton);

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    const progressText = screen.getByText('50% Completed');
    expect(progressText).toBeInTheDocument();
  });
});
