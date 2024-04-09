import { createContext, useEffect, useState } from "react";
import axios from "axios"
axios.defaults.withCredentials = true

export const UserContext = createContext()


export const UserProvider=({children})=>{



    useEffect(()=>{
        const getUser=async()=>{
            try {
                const resp =await axios.get('http://localhost:8080/api/users/jwt',{withCredentials:true})
                console.log(resp.data);
                setUser(resp.data)
            } catch (error) {
                console.log(error);
            }
        }
        getUser()

        
    },[])

    const [chat, setChat] = useState([]);
    const [user,setUser]=useState(null)
    return <UserContext.Provider value={{user,setUser , chat, setChat}}>{children}</UserContext.Provider>
}