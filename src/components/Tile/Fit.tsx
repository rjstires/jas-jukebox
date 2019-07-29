import React from 'react';
import styled from 'styled-components';
import fitty from 'fitty';

const Root = styled.div`
  white-space: nowrap;
  display: inline-block;
`;

const Fit: React.FC = ({ children }) => {
  const ref = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const fit = fitty(ref.current, { minSize: 6, maxSize: 16 });
    console.log('ref.current', ref.current)
    return () => {
      fit.unsubscribe();
    }
  }, [children])

  return <Root ref={ref}>{children}</Root>;
};

export default Fit;
