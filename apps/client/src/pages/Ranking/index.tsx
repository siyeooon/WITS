import React, { useEffect, useState } from "react";
import { auth } from "../../context/loginContext/config";

const TotalRanking = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      const uid = user.uid;

      setUserDetails({
        displayName,
        email,
        photoURL,
        emailVerified,
        uid,
      });

      updateRankings(uid, displayName);
    }
  }, []);

  const updateRankings = (uid, displayName) => {
    setRankings((prevRankings) => [
      ...prevRankings,
      { uid, displayName, score: Math.floor(Math.random() * 100) },
    ]);
  };

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen">
      {userDetails && (
        <>
          <ul className="flex flex-col items-center">
            <li>
              <span>디스플레이 이름:</span> {userDetails.displayName}
            </li>
            <li>
              <span>사진:</span>
              <img src={userDetails.photoURL} alt="프로필 사진" />
            </li>
          </ul>

          <h1 className="text-2xl font-bold mb-4">Ranking</h1>
          <ul className="flex flex-col items-center">
            {rankings.map((user, index) => (
              <li key={index} className="mb-2 flex items-center p-2">
                <span className="mr-4">{index + 1}.</span>
                <img
                  src={userDetails.photoURL}
                  alt="프로필 사진"
                  className="w-[70px] h-[70px] rounded-full mr-4"
                />
                <span className="flex-grow">{user.displayName}</span>
                <span className="ml-4"> {user.score} 점</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TotalRanking;
