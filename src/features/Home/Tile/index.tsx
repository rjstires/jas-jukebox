import React from 'react';
import styled from 'styled-components';
import tileBackground from '../../../assets/images/tile-background.png';
import Fit from './Fit';
import useConfig from '../../../useConfig';
import { debounce } from '../../../utilities';

const Container = styled.div`
  display: flex;
`;

const Tile = styled.div`
  background: white;
  background-image: url(${tileBackground});
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto;
  width: 288px;
  border: solid 3px #31a0de;
  text-align: center;
  line-height: 20px;
  box-shadow: 2px 2px 4px #7d7d7d6e;
`;

const TileRow = styled.div`
  padding: 0 4px;
  font-weight: 600;
`;

const TitleRow = styled(TileRow)`
  cursor: pointer;
`;

const Selector = styled.div`
  flex: 1 auto;
  line-height: 34px;

  font-family: "Steelfish";
  font-size: 22px;
  color: #be2a2c;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  width: 25px;
`;

interface Props {
  firstKey: string;
  secondKey: string;
  firstTitle?: string;
  secondTitle?: string;
  artistName?: string;
}

const TileContainer: React.FC<Props> = props => {
  const [, dispatch] = useConfig()
  const { enqueueSelection, resetIdleTimer } = dispatch;

  const {
    artistName,
    firstKey,
    firstTitle,
    secondKey,
    secondTitle,
  } = props;

  const handleFirstTitleClick = debounce(() => {
    resetIdleTimer();
    enqueueSelection(firstKey);
  }, 250);

  const handleSecondTitleClick = debounce(() => {
    resetIdleTimer();
    enqueueSelection(secondKey);
  }, 250);

  return (
    <Container>
      <Selector>
        <div>{firstKey}</div>
        <div>{secondKey}</div>
      </Selector>
      <Tile>
        <TitleRow onClick={handleFirstTitleClick}>
          {/* These seemling unnecessary DIVs provide contextual size to the Fit below. */}
          <div>
            <Fit>{firstTitle}</Fit>
          </div>
        </TitleRow>
        <TileRow>
          {/* These seemling unnecessary DIVs provide contextual size to the Fit below. */}
          <div>
            <Fit>{artistName}</Fit>
          </div>
        </TileRow>
        <TitleRow onClick={handleSecondTitleClick}>
          {/* These seemling unnecessary DIVs provide contextual size to the Fit below. */}
          <div>
            <Fit>{secondTitle}</Fit>
          </div>
        </TitleRow>
      </Tile>
    </Container>
  );
}

export default TileContainer;
