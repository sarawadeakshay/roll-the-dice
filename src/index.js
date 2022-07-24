import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import "./index.scss";
import Player from "./Player";
import { baseUrl, api } from './api';

const App = () => {
  const [restartGame, setRestartGame] = useState('1');
  const [players, setPlayers] = useState([]);
  const [matchInfo, setMatchInfo] = useState({ matchId: '', scoreToWin: 0 });
  const [winner, setWinner] = useState({});

  const updatePlayers = (data) => {
    console.log('data: ', data);
    const { players, matchId, scoreToWin } = data;
    const newPlayers = players.map(player => {
      return { ...player, score: 0, isWinner: false, isActive: '' };
    });
    newPlayers[0].isActive = 'active';
    setPlayers(newPlayers); 
    setMatchInfo({ matchId, scoreToWin }); 
  }

  /**
   * Fetch the Players list and the Match Info, once per game
   * Update player object and add score=0, isWinner and isActive properties
   * isActive will be active for the first player, used to highlight the button for that player
   */
  useEffect(() => {
    fetch(`${baseUrl}${api.players}`)
    .then(data => data.json())
    .then(data => updatePlayers(data));
  }, [restartGame]);

  /**
   * Remove isActive active for the clicked button
   * Add isActive active for the next button
   */
  const updateActiveButton = (playerID) => {
    const playersCnt = players.length;
    const currPlayerIdx = players.findIndex(player => player.id === playerID);
    let nextPlayerIdx = currPlayerIdx + 1;
    nextPlayerIdx = nextPlayerIdx === playersCnt ? 0 : nextPlayerIdx;
    players[currPlayerIdx].isActive = false;
    players[nextPlayerIdx].isActive = true;
    setPlayers([...players]);
  };

  const updatePlayerScore = (currPlayerIdx) => {
    const currScore = Math.floor(Math.random() * 6) + 1;
    players[currPlayerIdx].score += currScore;
  }

  const checkForWinner = (currPlayerIdx) => {
    let foundWinner = false;
    if (players[currPlayerIdx].score >= matchInfo.scoreToWin) {
      players[currPlayerIdx].isWinner = true;
      players[currPlayerIdx].isActive = false;
      setWinner(players[currPlayerIdx]);
      foundWinner= true;
    }
    return foundWinner;
  }
  const onRollDice = (playerID) => {
    const currPlayerIdx = players.findIndex(player => player.id === playerID);
    updatePlayerScore(currPlayerIdx);
    const foundWinner = checkForWinner(currPlayerIdx);
    setPlayers([...players]);
    if (!foundWinner) {
      updateActiveButton(playerID);
    }
  };

  const onRestartGame = () => {
    setWinner({});
    setRestartGame(restartGame + 1);
  };

  return (
    <div>
      <div className="header">
        <button
          type="button"
          className="restart-game"
          onClick={onRestartGame}>Restart Game
        </button>
        <div className="match-id">Match ID: <span>{matchInfo.matchId}</span></div>
      </div>
      <div className="game-name">ROLL THE DICE</div>
      <div className="score-to-win">Score to win: <span>{matchInfo.scoreToWin}</span></div>
      {winner.name && <div className="game-won">Congratulations, {winner.name}. You won the game!</div>}
      <div className="players">
        {players.map(playerData => {
          return <Player key={playerData.id} playerData={playerData} onRollDice={onRollDice} />
        })}
      </div>
    </div>
  );
};

render(<App />, document.getElementById("app"));
