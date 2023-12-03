import { useContext } from "react";
import LoginContext from "./loginContext";

const useLoginContext = () => useContext(LoginContext);

export default useLoginContext;
