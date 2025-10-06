// import { io } from 'socket.io-client';

// import {useContext,createContext, Children} from 'react';

// const URL = 'http://localhost:5000'

// export const SocketContext = createContext()

// export const SocketProvider= ({children})=>{

//   const socket = io(URL, {
//       autoConnect: false
//     });

//   const connect =()=> {
//      socket.connect();
//   }

//   const disconnect = ()=>{
//     socket.disconnect()
//   }


// return (
//   <SocketContext.Provider value={{connect,disconnect,socket}}>
//         {children}
//   </SocketContext.Provider>
// )

// }