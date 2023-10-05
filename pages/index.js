import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contracts/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const [contract, setContract] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(undefined)
  const contractAddress = "0x5B51d9369652f6C0352E27130Fe9D4F58adBaf48";

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const website = new ethers.Contract(contractAddress, abi, signer);
 
    setContract(website);
  }

  const getLoggedIn = async() => {
    if (contract) {
      setLoggedIn((await contract.loggedIn()));
    }
  }

  const login = async() => {
    if (contract) {
      let tx = await contract.login();
      await tx.wait()
      getLoggedIn();
    }
  }
  const logout = async() => {
    if (contract) {
      let tx = await contract.logout(1);
      await tx.wait()
      getLoggedIn();

    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (loggedIn == undefined) {
      getLoggedIn();
    }
    function logUI() {
      return loggedIn ? <div> You have logged In</div>  : <div> click on log In to log In</div>
    }
    return (
      <div>
        <p>Your Account: {account}</p>
        {
          logUI()
        }
        <hr></hr>
        <button onClick={login}>Log In</button>
        <button onClick={logout}>Log Out</button>
        <hr></hr>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to KingErics Website!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
