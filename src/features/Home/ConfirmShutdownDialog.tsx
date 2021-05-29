import Button from '@material-ui/core/Button';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const remote = require('electron').remote

export const closeApplication = () => {
  let w = remote.getCurrentWindow();

  w.close();
};

export const ConfirmShutdownDialog = props => {
  const { handleClose, open } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Shut down?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Shutting down the jukebox may result in sadness, boredom, and inability to get down. Are you sure?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text" color="default">
          Cancel
          </Button>
        <Button onClick={closeApplication} variant="contained" color="primary" autoFocus>
          Shutdown
          </Button>
      </DialogActions>
    </Dialog>
  );
};
