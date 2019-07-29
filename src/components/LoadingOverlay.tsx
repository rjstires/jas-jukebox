import React from 'react';
import styled from 'styled-components';
import loading from '../assets/record-loading.gif';

const Spinner = styled.div`
  display: ${(props) => props.display ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9999;
  `;

  const Background = styled.div`
  display: ${(props) => props.display ? 'flex' : 'none'};
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9998;
  background-color: rgba(255, 255, 255, 0.75);
`;

const LoadingOverlay = ({ display }) => {
  return (
    <>
      <Spinner display={display}>
        <img src={loading} />
      </Spinner>
      <Background display={display} />
    </>
  );
}

export default LoadingOverlay;
