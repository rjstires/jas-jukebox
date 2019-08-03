import { remote } from 'electron';
import React from 'react';
import useConfig from '../useConfig';
import Display from './Display';
import ControlButton from './ControlButton';
import styled from 'styled-components';

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

const Header = () => {
  const [state, handlers] = useConfig();
  const { setPath, nextPage, previousPage } = handlers;

  const handleChangeClick = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (paths) => {
      if (!paths) {
        return;
      }
      setPath(paths[0]);
    })
  };

  const handlePreviousPageClick = () => {
    previousPage();
  };

  const handleNextPageClick = () => {
    nextPage();
  };

  const handleSkipClick = () => {
    const { currentSong } = state;
    if (currentSong) {
      currentSong.howl.stop();
    }
  }

  return (
    <Root>
      <Side>
        <ControlButton className="control-button" onClick={handleChangeClick}>CHANGE</ControlButton>
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
