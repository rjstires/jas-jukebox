import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Help from '@material-ui/icons/HelpRounded';
import NavigateBefore from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNext from '@material-ui/icons/NavigateNextRounded';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNewRounded';
import Settings from '@material-ui/icons/SettingsRounded';
import SkipNext from '@material-ui/icons/SkipNextRounded';
import React from 'react';
import styled from 'styled-components';
import useConfig from '../../useConfig';
import { ConfirmShutdownDialog } from './ConfirmShutdownDialog';
import { DiagnosticsDialog } from './DiagnosticsDialog';
import Display from './Display';
import { useDialog } from '../../useDialog';
import { VolumeControlSlider } from './VolumeControlSlider';

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
  const { currentSong } = state;
  const { nextPage, previousPage, resetIdleTimer } = handlers;

  const handlePreviousPageClick = () => {
    resetIdleTimer();
    previousPage();
  };

  const handleNextPageClick = () => {
    resetIdleTimer();
    nextPage();
  };

  const handleSkipClick = () => {
    resetIdleTimer();
    if (currentSong && currentSong.howl.playing()) {
      currentSong.howl.stop();
    }
  }

  const [confirmShutdownOpen, openConfirmShutdown, closeConfirmShutdown] = useDialog();
  const [diagnosticsOpen, openDiagnostics, closeDiagnostics] = useDialog();

  return (
    <>
      <DiagnosticsDialog open={diagnosticsOpen} handleClose={closeDiagnostics} />
      <ConfirmShutdownDialog open={confirmShutdownOpen} handleClose={closeConfirmShutdown} />
      <Root>
        <Side>
          <Grid container spacing={2} style={{ maxWidth: '90%' }}>
            <Grid container item xs={12} justify="center">
              <ButtonGroup size="large" variant="contained" color="primary">
                <Button size="large" variant="contained" color="primary" onClick={openConfirmShutdown}><PowerSettingsNew /></Button>
                <Button size="large" variant="contained" color="primary" onClick={onNavigate}><Settings /></Button>
                {process.env.NODE_ENV !== 'production' && <Button size="large" variant="contained" color="primary" onClick={openDiagnostics}><Help /></Button>}
              </ButtonGroup>
            </Grid>
          </Grid>
        </Side>
        <Center>
          <Display />
        </Center>
        <Side>
          <Grid container spacing={2} style={{ maxWidth: '90%' }}>
            <Grid container item xs={12} justify="center">
              <ButtonGroup size="large" variant="contained" color="primary">
                <Button onClick={handlePreviousPageClick}><NavigateBefore /></Button>
                <Button onClick={handleSkipClick}><SkipNext /></Button>
                <Button onClick={handleNextPageClick}><NavigateNext /></Button>
              </ButtonGroup>
            </Grid>
            <Grid container spacing={2} item xs={12}>
              <Grid item xs>
                <VolumeControlSlider />
              </Grid>
            </Grid>
          </Grid>
        </Side>
      </Root>
    </>
  );
}

export default Header;
