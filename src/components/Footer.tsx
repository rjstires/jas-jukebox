import times from 'ramda/es/times';
import React from 'react';
import useConfig from '../useConfig';
import { ALPHABET } from '../utilities';
import ControlButton from './ControlButton';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
`;

const SelectButton = styled(ControlButton)`
  font-size: 24px;
  `;

  const AlphaNumericButton = styled(ControlButton)`
  font-size: 24px;
  color: #BE2A2C;
  border-color: #FFFFFF;
  background: #FFFFFF;
  background: -webkit-gradient(linear, left top, left bottom, from(#FFFFFF), to(#EAEAEA));
`;

const Footer = () => {
  const [, handlers] = useConfig();
  const { setSelectionAlpha, setSelectionNumeric, enqueueSelection } = handlers;

  return (
    <Root>
      {times((idx) => <AlphaNumericButton onClick={() => setSelectionAlpha(ALPHABET[idx])} key={ALPHABET[idx]} value={ALPHABET[idx]}>{ALPHABET[idx]}</AlphaNumericButton>, 20)}
      <SelectButton onClick={() => enqueueSelection()}>SELECT</SelectButton>
      {times((idx) => (<AlphaNumericButton onClick={() => setSelectionNumeric(idx + 1)} key={idx + 1} value={idx + 1}>{idx + 1}</AlphaNumericButton>), 6)}
    </Root>
  )
};

export default Footer;
