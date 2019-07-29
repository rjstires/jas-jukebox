import always from 'ramda/es/always';
import pathOr from 'ramda/es/pathOr';
import pipe from 'ramda/es/pipe';
import splitEvery from 'ramda/es/splitEvery';
import times from 'ramda/es/times';
import React from 'react';
import styled from 'styled-components';
import useConfig, { numColumns, numRows, songsPerTile } from '../useConfig';
import { addAlphanumericToSongs } from '../utilities';
import Tile from './Tile';

const Root = styled.div`
  background-color: #d2d1d2;
  background: -webkit-linear-gradient(top, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 34%,rgba(166,180,188,1) 73%,rgba(224,239,249,1) 100%);
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  margin-top: 8px;
`;

const emptyRows = pipe(
  always(times(() => ({}), songsPerTile * numColumns * numRows)),
  addAlphanumericToSongs,
  splitEvery(songsPerTile),
  splitEvery(numColumns),
)();

const Board = () => {
  const [state] = useConfig();
  const { library, page } = state;

  const rows: any = pathOr(emptyRows, [page], library);

  return (
    <Root>
      {
        rows.map((row, idx) => (
          <Row key={idx}>
            {row.map(([firstTitle, secondTitle], iidx) => (
              <Tile
                key={`${idx}-${iidx}`}
                firstKey={firstTitle.key}
                firstTitle={firstTitle.title}
                secondKey={secondTitle.key}
                secondTitle={secondTitle.title}
                artistName={firstTitle.artist}
              />
            ))}
          </Row>
        ))
      }
    </Root>
  );
};

export default Board;
