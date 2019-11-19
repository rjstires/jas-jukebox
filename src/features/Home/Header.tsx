import React from 'react';
import useConfig from '../../useConfig';
import Display from './Display';
import ControlButton from './ControlButton';
import styled from 'styled-components';
import { useInterval } from '../../useInterval';

const Root = styled.div`
  background-color: #cfc7ca;
  display: flex;
  height: 130px;
`;

const Side = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex: 1;
`;

const Center = styled.div`
  flex: 3;
  padding: 4px 0;
`;

const Header = ({ onNavigate }) => {
  const [state, handlers] = useConfig();
  const { nextPage, previousPage } = handlers;

  const handlePreviousPageClick = () => {
    previousPage();
  };

  const handleNextPageClick = () => {
    nextPage();
  };

  const handleSkipClick = () => {
    const { currentSong } = state;
    if (currentSong && currentSong.howl.playing()) {
      currentSong.howl.stop();
    }
  }

  useInterval(() => {
    nextPage();
  }, 30000)

  return (
    <Root>
      <Side>
        <ControlButton className="control-button" onClick={onNavigate}>CHANGE</ControlButton>
      </Side>
      <Center>
        <Display />
      </Center>
      <Side>
        <ControlButton onClick={handlePreviousPageClick} className="control-button">&lt;</ControlButton>
        <ControlButton onClick={handleSkipClick} className="control-button skip">SKIP</ControlButton>
        <ControlButton onClick={handleNextPageClick} className="control-button">&gt;</ControlButton>
      </Side>
    </Root>
  );
}

export default Header;
