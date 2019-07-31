import pathOr from 'ramda/es/pathOr';
import React from 'react';
import styled from 'styled-components';
import useConfig from '../useConfig';
import { emptyRows } from '../utilities';
import Tile from './Tile';

const Root = styled.div`
  background-color: #d2d1d2;
  background: -webkit-linear-gradient(top, rgba(242,246,248,1) 0%,
    rgba(216,225,231,1) 34%,
    rgba(166,180,188,1) 73%,
    rgba(224,239,249,1) 100%);
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  margin-top: 8px;
`;

const createTile = pair => {
  const { key: firstKey, title: firstTitle, artist } = pair[0];
  const { key: secondKey, title: secondTitle } = pair[1];

  return (
    <Tile
      key={`${firstKey}-${secondKey}`}
      artistName={artist}
      firstKey={firstKey}
      firstTitle={firstTitle}
      secondKey={secondKey}
      secondTitle={secondTitle}
    />
  );
};

const createRow = (row, idx) => <Row key={idx}>{row.map(createTile)}</Row>;

const Board = () => {
  const [state] = useConfig();
  const { library, page } = state;

  const rows: any = pathOr(emptyRows, [page], library);

  return (
    <Root>
      {rows.map(createRow)}
    </Root>
  );
};

export default Board;
