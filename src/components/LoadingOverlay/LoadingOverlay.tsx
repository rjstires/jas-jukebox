import React from 'react';
import styled from 'styled-components';
import loading from '../../assets/images/record-loading.gif';

const Common = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Spinner = styled(Common)`
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Background = styled(Common)`
  z-index: 9998;
  background-color: rgba(255, 255, 255, 0.75);
`;

interface Props {
  show?: boolean;
}

const LoadingOverlay: React.FC<Props> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <Spinner data-testid="loading-overlay-spinner">
        <img src={loading} data-testid="loading-overlay-image" />
      </Spinner>
      <Background data-testid="loading-overlay-background" />
    </>
  );
}



export default LoadingOverlay;
