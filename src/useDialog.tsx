import { useState } from 'react';

export function useDialog(initial = false): [boolean, () => void, () => void, () => void] {
  const [open, setOpen] = useState(() => initial);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpen(!open);

  return [open, handleOpen, handleClose, handleToggle];
}
