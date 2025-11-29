  import { BrowserRouter } from "react-router-dom";
  import { useState } from "react";
  import SignIn from "./components/SignIn"
  import Code from "./components/Code"
  import AddFile from "./components/MainPage/AddFile"
  import Modal from "./components/MainPage/Modal"
  import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

  function App() {
    const [sign, setSign]= useState(false);
    const [isVerify, setIsVerify]= useState(false)
    const [userEmail, setUserEmail] = useState('');

    const handleSign=(val, email)=>{
      setSign(val)
      setUserEmail(email)
    }
    return (
      <>
        {!sign && <SignIn onSign={handleSign}/>}
        {sign && !isVerify && <Code onSetVerify={setIsVerify} email={userEmail} />}
        {sign && isVerify && (<AddFile />)}
        {/* <AddFile />
        {/* <Modal/> */}
      </>
    );
  }

  export default App;
