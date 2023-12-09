import React, { createContext, useCallback, useEffect } from "react";

const UserInteractContext = createContext<boolean | null>(null);
export const UserInteractContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isInteract, setIsInteract] = React.useState<boolean>(false);

  const onInteract = useCallback(() => {
    setIsInteract(true);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", onInteract);
    document.addEventListener("mousemove", onInteract);
    document.addEventListener("touchstart", onInteract);
    document.addEventListener("scroll", onInteract);
    document.addEventListener("keydown", onInteract);

    return () => {
      document.removeEventListener("mousedown", onInteract);
      document.removeEventListener("mousemove", onInteract);
      document.removeEventListener("touchstart", onInteract);
      document.removeEventListener("scroll", onInteract);
      document.removeEventListener("keydown", onInteract);
    };
  }, [onInteract]);

  return (
    <UserInteractContext.Provider value={isInteract}>
      {children}
    </UserInteractContext.Provider>
  );
};

export const useUserInteract = () => {
  const isInteract = React.useContext(UserInteractContext);

  if (isInteract === null) {
    throw new Error(
      "useUserInteract must be used within a UserInteractContextProvider"
    );
  }

  return isInteract;
};
