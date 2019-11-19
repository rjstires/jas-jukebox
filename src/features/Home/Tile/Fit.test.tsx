import React from 'react'

import { render } from '@testing-library/react';
import fitty from 'fitty';
import Fit from './Fit';

describe('Fit', () => {
  it('should call fitty on the element after paint', () => {
    render(<Fit>Some Text</Fit>);
    expect(fitty).toHaveBeenCalledTimes(1);
  });

  it('should render children', async () => {
    const text = 'Some Text';
    const { queryByText } = render(<Fit>{text}</Fit>);
    const found = await queryByText(text);
    expect(found).toBeInTheDocument();
  });
});
