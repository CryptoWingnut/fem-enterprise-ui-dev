import { render, screen } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { PropsWithChildren, ReactElement } from 'react';
import { render as renderComponent } from '@testing-library/react';

const renderWithProvider: typeof render = (
  ui: ReactElement,
  options?: Parameters<typeof renderComponent>[1],
) => {
  const store = createStore();

  const Wrapper = ({ children }: PropsWithChildren) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(ui, { ...options, wrapper: Wrapper });
};

it('renders the Packing List application', () => {
  renderWithProvider(<PackingList />);
});

it('has the correct title', async () => {
  renderWithProvider(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  renderWithProvider(<PackingList />);
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  renderWithProvider(<PackingList />);
  const button = screen.getByRole('button', { name: 'Add New Item' });
  expect(button).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { user } = renderWithProvider(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  expect(button).toBeDisabled();
  await user.type(input, 'test');
  expect(button).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { user } = renderWithProvider(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'test');
  await user.click(button);

  expect(screen.getByLabelText('test')).not.toBeChecked();
});

it('remove an item', async () => {
  const { user } = renderWithProvider(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const addButton = screen.getByRole('button', { name: 'Add New Item' });

  await user.type(input, 'test');
  await user.click(addButton);

  const removeButton = screen.getByText(/remove/i);
  await user.click(removeButton);
});
