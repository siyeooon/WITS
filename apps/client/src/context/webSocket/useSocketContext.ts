import { useContext } from "react";
import SocketContext from "./socketContext";

const useSocketContext = () => useContext(SocketContext);

export default useSocketContext;
