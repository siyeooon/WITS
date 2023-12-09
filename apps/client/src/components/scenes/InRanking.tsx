import React from "react";

interface InRankingProps {
  quickAnsweredPlayers: string[];
}

const InRanking: React.FC<InRankingProps> = ({ quickAnsweredPlayers }) => {
  return (
    <div className="fixed">
      <h2>Fastest</h2>
      <ul>
        {quickAnsweredPlayers.map((player, index) => (
          <li>박시연;;</li>
        ))}
      </ul>
    </div>
  );
};

export default InRanking;
