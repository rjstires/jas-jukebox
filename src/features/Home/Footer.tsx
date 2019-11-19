import { times } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import useConfig from '../../useConfig';
import { ALPHABET } from '../../constants';
import ControlButton from './ControlButton';

const Root = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
`;

const SelectButton = styled(ControlButton)`
  font-size: 24px;
`;

const AlphaNumericButton = styled(ControlButton)`
  min-width: 60px;
  font-size: 48px;
  color: #650b0c;
  border-color: #FFFFFF;
  padding: 8px 10px;
  margin: 0;
  background: #ffdcbd;
  background-image: -webkit-linear-gradient(top, #ffdcbd, #f7b375);
  background-image: -moz-linear-gradient(top, #ffdcbd, #f7b375);
  background-image: -ms-linear-gradient(top, #ffdcbd, #f7b375);
  background-image: -o-linear-gradient(top, #ffdcbd, #f7b375);
  background-image: linear-gradient(to bottom, #ffdcbd, #f7b375);
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
