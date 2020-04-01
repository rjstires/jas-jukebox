import { RouteComponentProps } from "@reach/router";
import { remote } from "electron";
import { compose, groupBy, map, toPairs } from "ramda";
import React, { useState } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import { get } from "../../storage";
import useConfig from "../../useConfig";
import { ExtendedSong } from "../../types";
import AudioImage from "../../assets/images/sound-png-35800.png";
import SettingsImage from "../../assets/images/settings-icon-14972.png";
import styled from "styled-components";
import { useTimeout } from "../../useInterval";

const filterInYearRange = (start: string, end: string) => ({ year }) =>
  year >= Number(start) && year <= Number(end);

const Button = styled.div`
  margin: 16px 16px;
  height: 80px;
  width: 80px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;

  cursor: pointer;
`;

const Icon = styled.div`
  height: 60px;
  width: 60px;
  background-image: url(${props => props.image});
  background-size: 100%;
  flex: 1 0 auto;
`;

const Label = styled.div`
  color: white;
  font-size: 16px;
`;

const IconButton = props => {
  const { onClick, image = AudioImage, children } = props;

  return (
    <Button onClick={onClick}>
      <Icon image={image} />
      <Label>{children}</Label>
    </Button>
  );
};

const Options: React.FC<RouteComponentProps> = props => {
  const { navigate } = props;
  const [{ loading, library = [] }, { setPath, setPages }] = useConfig();

  React.useEffect(() => {
    async function setPathFromUserData() {
      const path = await get<string>("path");
      setPath(path);
    }

    setPathFromUserData();
  }, []);

  function openPathDialog() {
    remote.dialog.showOpenDialog({ properties: ["openDirectory"] }, paths => {
      if (!paths) {
        return;
      }
      setPath(paths[0]);
    });
  }

  const loadAndNavigate = fn => e => {
    fn(e);
    navigate && navigate("/play");
  };

  const RangeButton: React.FC<{ start: string; end: string }> = ({
    start,
    end
  }) => {
    const handler = loadAndNavigate(() =>
      setPages(library => library.filter(filterInYearRange(start, end)))
    );

    return (
      <IconButton onClick={handler}>
        {start} - {end}
      </IconButton>
    );
  };

  const mapYearSpanDictToButtons = compose<
    Record<string, ExtendedSong[]>,
    [string, ExtendedSong[]][],
    [string[], ExtendedSong[]][],
    [string[], ExtendedSong[]][],
    JSX.Element[]
  >(
    map(([[start, end]]) => (
      <RangeButton start={start} end={end} key={`${start}${end}`} />
    )), // -> React.FC[]
    v => v.sort(), // -> [ [ 2000, 2009] , ExtendedSong[] ]
    map(([key, values]) => [key.split(","), values]), // -> [ [ 2000, 2009] , ExtendedSong[] ]
    toPairs // -> ['2000,2009', ExtendedSong[] ]
  );

  const DecadeButtons = compose<
    ExtendedSong[],
    Record<string, ExtendedSong[]>,
    JSX.Element[]
  >(
    mapYearSpanDictToButtons,
    groupBy(({ year }) => {
      const min = Math.floor(year / 10) * 10;
      const max = min + 9;
      return [min, max].toString();
    })
  )(library);

  const HalfDecadeButtons = compose<
    ExtendedSong[],
    Record<string, ExtendedSong[]>,
    JSX.Element[]
  >(
    mapYearSpanDictToButtons,
    groupBy(({ year }) => {
      const min = Math.floor(year / 5) * 5;
      const max = min + 4;
      return [min, max].toString();
    })
  )(library);

  const loadAll = loadAndNavigate(() => {
    setPages(library => library);
  });

  const [pastTimeout, setPastTimeout] = useState(false);
  useTimeout(
    () => {
      setPastTimeout(true);
    },
    300
  );

  return loading && pastTimeout ? (
    <LoadingOverlay show={loading} timeout={200} />
  ) : (
    <div style={{ display: "inline-flex" }}>
      <div>
        <IconButton image={SettingsImage} onClick={openPathDialog}>
          Set Path
        </IconButton>
      </div>
      <div>
        <IconButton onClick={loadAll}>Load All</IconButton>
      </div>
      <div>{DecadeButtons}</div>
      <div>{HalfDecadeButtons}</div>
    </div>
  );
};

export default Options;
