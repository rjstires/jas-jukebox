import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import stringify from 'json-stringify-safe';
import React from 'react';
import useConfig from '../../useConfig';
import Slide from '@material-ui/core/Slide';

const remote = require('electron').remote

export const closeApplication = () => {
  let w = remote.getCurrentWindow();

  w.close();
};

const Transition: any = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props as any} />;
});

export const DiagnosticsDialog = props => {
  const [state] = useConfig();
  const { handleClose, open } = props;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <pre>{stringify(state, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
};
