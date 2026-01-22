import { render, screen } from '@testing-library/react';
import ResumeEditor from '../pages/ResumeEditor';

test('renders resume editor header', () => {
  render(<ResumeEditor />);
  expect(screen.getByText(/Editor de Currículo/i)).toBeInTheDocument();
});
