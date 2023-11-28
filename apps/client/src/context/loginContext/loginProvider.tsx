import {useMemo, useState} from "react";
import LoginContext from "./loginContext.ts";

const LoginProvider: React.FC<React.PropsWithChildren> = ({children})=>{
    // const [success, setLoginSuccess] = useState(false);
    // const value = useMemo(()=>(
    //     {success, setLoginSuccess}),[success, setLoginSuccess]
    // );

    const value = false;

    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}
export default LoginProvider;