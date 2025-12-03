import { useEffect, useState } from "react";
import SignIn from "./components/SignIn"
import Code from "./components/Code"
import AddFile from "./components/MainPage/AddFile"

function App() {
  const [sign, setSign] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSign = (val, email) => {
    setSign(val);
    setUserEmail(email);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const verified = localStorage.getItem("verified");

    if (token) {
      setSign(true);
    }

    if (verified === "true") {
      setIsVerify(true);
    }

    setLoading(false);
  }, []);

  if (loading) return null; 

  return (
    <>
      {!sign && <SignIn onSign={handleSign} />}

      {sign && !isVerify && (
        <Code
          onSetVerify={(v) => {
            setIsVerify(v);
            if (v) localStorage.setItem("verified", "true");
          }}
          email={userEmail}
        />
      )}

      {sign && isVerify && <AddFile />}
    </>
  );
}

export default App;
