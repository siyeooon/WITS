import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import googlelogo from "../../assets/googlelogo.png";
import mainvideo from "../../assets/video.mp4";
import { auth, provider } from "../../context/loginContext/config";
import { UserCredential, signInWithPopup } from "firebase/auth";

// Signin 컴포넌트 정의
const Signin = () => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data: UserCredential) => {
      if (data.user.email !== null) {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate("/ingame");
      }
    });
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email !== null) {
      setValue(email);
    }
  }, []);

  return (
    <button onClick={handleClick} className="flex items-center space-x-2">
      <img src={googlelogo} alt="google Icon" className="w-7 h-7" />
      Sign In with Google
    </button>
  );
};

const Home = () => {
  const [showGameDescription, setShowGameDescription] = useState(false);
  const [showQuestionMarkDescription, setShowQuestionMarkDescription] =
    useState(false);

  return (
    <div className="absolute w-screen h-screen">
      <div
        className="relative max-w-md overflow-hidden bg-white h-full left-1/2 -translate-x-1/2"
        onMouseEnter={() => setShowGameDescription(true)}
        onMouseLeave={() => {
          setShowGameDescription(false);
          setShowQuestionMarkDescription(false);
        }}
      >
        <div className="absolute top-48 z-10 inset-x-0 flex items-center justify-center">
          <h1 className="text-white text-7xl font-logo">WITS</h1>
          <button
            className="ml-2 text-white text-xl cursor-pointer flex items-center justify-center w-7 h-7 bg-gray-300 rounded-full"
            onMouseEnter={() => setShowQuestionMarkDescription(true)}
            onMouseLeave={() => setShowQuestionMarkDescription(false)}
          >
            <span role="img" aria-label="question-mark" className="text-">
              ❓
            </span>
            {showQuestionMarkDescription && (
              <div className="absolute bg-gray-300 text-black p-2 rounded-lg mt-2 -top-12 right-4">
                <p className="text-sm">
                  다른 유저들과 경쟁으로 최대한 빠르게 노래 제목을 맞춰보세요!
                </p>
              </div>
            )}
          </button>
        </div>
        <video
          autoPlay
          loop
          muted
          controls={false}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={mainvideo} type="video/webm" />
        </video>

        <div className="absolute bottom-24 inset-x-0 px-4">
          <div className="flex items-center justify-center w-full h-[54px] rounded-lg text-xl font-bold text-gray-600 bg-white cursor-pointer">
            <Signin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
