import React from 'react'
import { ALPHABET } from '../utilities';
import useConfig from '../useConfig';
import times from 'ramda/es/times';

const ControlButton = ({ value, ...props }) => (
  <button className="selection-control control-button white" {...props}>{value}</button>
);

const Footer = () => {
  const [, handlers] = useConfig();
  const { setSelectionAlpha, setSelectionNumeric, enqueueSelection } = handlers;

  return (
    <div className="footer">
      {times((idx) => <ControlButton onClick={() => setSelectionAlpha(ALPHABET[idx])} key={ALPHABET[idx]} value={ALPHABET[idx]} />, 20)}
      <button onClick={() => enqueueSelection() } className="control-button">SELECT</button>
      {times((idx) => (<ControlButton onClick={() => setSelectionNumeric(idx + 1)} key={idx + 1} value={idx + 1} />), 6)}
    </div>
  )
};

export default Footer;
