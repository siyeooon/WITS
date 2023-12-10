import React from "react";

interface Player {
  id: number;
  name: string;
  profilePicture: string;
}

interface InRankingProps {
  quickAnsweredPlayers: Player[];
}

const InRanking: React.FC<InRankingProps> = ({ quickAnsweredPlayers }) => {
  return (
    <div className="ranking-container">
      <h1 className="text-2xl mb-4">가장 빠른 플레이어</h1>
      <div className="flex">
        <div className="first-place">
          {quickAnsweredPlayers.slice(0, 1).map((player) => (
            <div key={player.id} className="text-center">
              <img
                src="/src/assets/ingame/profile.png"
                className="w-16 h-16 rounded-full mb-2"
              />
              <p>{player.name}</p>
            </div>
          ))}
        </div>
        <div className="second-third-place ml-8">
          {quickAnsweredPlayers.slice(1, 3).map((player) => (
            <div key={player.id} className="text-center mb-4">
              <img
                src="/src/assets/ingame/profile.png"
                className="w-12 h-12 rounded-full mb-2"
              />
              <p>{player.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InRanking;
