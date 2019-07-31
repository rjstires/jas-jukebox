import { render } from '@testing-library/react';
import React from 'react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay', () => {
  describe('when `show` is true', () => {
    it('should render a spinner', async () => {
      const { queryByTestId } = render(<LoadingOverlay show />);
      const spinner = await queryByTestId('loading-overlay-spinner');

      expect(spinner).toBeInTheDocument()
    });

    it('should render a background', async () => {
      const { queryByTestId } = render(<LoadingOverlay show />);
      const background = await queryByTestId('loading-overlay-background');

      expect(background).toBeInTheDocument()
    });

    it('should render an image', async () => {
      const { queryByTestId } = render(<LoadingOverlay show />);
      const image = await queryByTestId('loading-overlay-image');

      expect(image).toBeInTheDocument()
    });
  });

  it('should not render.', async () => {
    const { queryByTestId } = render(<LoadingOverlay />);
    const spinner = await queryByTestId('loading-overlay-spinner');

    expect(spinner).not.toBeInTheDocument()
  });
})
