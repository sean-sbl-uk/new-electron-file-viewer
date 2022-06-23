import Layout from './Layout';
import { renderWithStore } from '../utils/testUtils';
import '@testing-library/jest-dom';

describe('Layout', () => {
  it('should render with title and content', () => {
    const content = <div>content</div>;
    const { getByTestId, getByText } = renderWithStore(
      <Layout title={'test'}>{content}</Layout>
    );

    expect(getByText('test')).toBeInTheDocument();
    expect(getByText('content')).toBeInTheDocument();
  });
});
