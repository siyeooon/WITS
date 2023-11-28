import {useMemo, useState} from "react";
import LoginContext from "./loginContext.ts";

const LoginProvider = ({children})=>{
    // const [success, setLoginSuccess] = useState(false);
    // const value = useMemo(()=>(
    //     {success, setLoginSuccess}),[success, setLoginSuccess]
    // );

    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}
export default LoginProvider;