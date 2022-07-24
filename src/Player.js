import React from "react";
import "./Player.scss";

const Player = (props) => {
  const { playerData, onRollDice } = props;
  const { id, name, imageUrl, score, isActive, isWinner } = playerData;
  
  return (
    <div className={`player ${isWinner ? 'winner' : ''}`}>
      <div className="name">{name}</div>
      <div className="img">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="score">Score: <span>{score}</span></div>
      <button
        type="button"
        disabled={!isActive}
        className={`roll-btn ${isActive ? 'active': ''}`}
        onClick={() => onRollDice(id)}>Roll</button>
    </div>
  );
};

export default Player;
