import { RouteComponentProps } from "@reach/router";
import React from "react";
import Board from "./Board";
import Footer from "./Footer";
import Header from "./Header";
import Player from "./Player";

type HomeProps = RouteComponentProps;

const Home: React.FC<HomeProps> = ({ navigate }) => {
  return (
    <>
      <Player />
      <Header onNavigate={() => navigate && navigate("/select")} />
      <Board />
      <Footer />
    </>
  );
};

export default Home;
