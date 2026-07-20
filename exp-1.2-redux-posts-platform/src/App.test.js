import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('renders the app header', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(
    screen.getByText(/Redux Toolkit — Posts & Platforms/i)
  ).toBeInTheDocument();
});
