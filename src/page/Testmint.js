import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import swal from "sweetalert";
import $ from "jquery";
// import "slick-slider";

function Test() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [activeSale, setActiveSale] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    FINNEY_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const toggleNav = () => {
    setToggleMenu(!toggleMenu)
  }

  const comingSoon = () => {
    swal("BadBoyz coming soon!", "", "info");
  }
  
  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    console.log("smartcontract--->", blockchain.smartContract);
    console.log("presale status: ", data.presaleStatus);
    // swal(`Minting your ${CONFIG.NFT_NAME}...`, "", "info");
    setClaimingNft(true);

    if (!data.presaleStatus && !data.loading) {
        console.log("public============>", data.presaleStatus, data.saleStatus, activeSale)
        blockchain.smartContract.methods
        .mintBadBoyz(mintAmount)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: totalCostWei,
        })
        .once("error", (err) => {
          console.log(err);
          swal("Sorry, something went wrong please try again later.", "", "error");
          setClaimingNft(false);
        })
        .then((receipt) => {
            console.log("receipt", receipt.events.BadBoyzMinted.returnValues);
          swal(
            `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`, "", "success"
          );
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        });
    } else {
        console.log("presale===========>>>>>>>>>>");
        blockchain.smartContract.methods
        .presaleBadBoyz(mintAmount)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: totalCostWei,
        })
        .once("error", (err) => {
          console.log(err);
          swal("Sorry, something went wrong please try again later.", "", "error");
          setClaimingNft(false);
        })
        .then((receipt) => {
            console.log("receipt", receipt.events.BadBoyzMinted.returnValues);
          swal(
            `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`, "", "success"
          );
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        })
        .catch(revertReason => console.log("reverreason===>",{revertReason}));
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
        dispatch(fetchData(blockchain.account));  
    }
    if (blockchain.errorMsg !== "") {
      swal(blockchain.errorMsg, "", "info");
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };


  useEffect(() => {
    getConfig();
  }, []);


  useEffect(() => {
    getData();
  }, [blockchain.account]);

  useEffect(() => {
    if (data.presaleStatus || data.saleStatus) {
      setActiveSale(true);
    }
  }, [data]);

  return (
    <div>
        <nav className="navbar">
            <div className="container">
                <img className="logo-image" src="./assets/images/logo.png"/>
                <div className="social-links">
                    <a className="social-item" href="https://www.youtube.com/channel/UCIsge5kzES4PcpRlsTiTvIA" target="_blank"><i className="fab fa-youtube"></i></a>
                    <a className="social-item" href="https://www.twitter.com/thebadboyznft" target="_blank"><i className="fab fa-twitter"></i></a>
                    <a className="social-item" href="https://www.instagram.com/thebadboyznft" target="_blank"><i className="fab fa-instagram"></i></a>
                    <a className="social-item" href="https://discord.gg/badboyz" target="_blank"><i className="fab fa-discord"></i></a>
                </div>
            </div>
        </nav>
        <div className="badboy">   
            <img className="width-100 badboyz" src="./assets/images/badboyz.jpg"/>
            <img className="width-100 badboyz-mobile" src="./assets/images/mobile/trail_logo.png"/>  
            {blockchain.account == null && blockchain.account == undefined ? 
                <button className="connect-button comic-font btn btn-white"
                    onClick={(e) => {
                    e.preventDefault();
                    dispatch(connect());
                    getData();
                    }
                }
                >
                CONNECT
                </button>:
                <span className="connect-button comic-font btn btn-white">
                {String(blockchain.account).substring(0, 4) +
                    "..." +
                    String(blockchain.account).substring(38)
                }
                </span>
            }  
            {activeSale?
              <div className="col-md-3 col-sm-12 text-center">
                <button 
                    className="mint-btn comic-font btn btn btn-white"
                    disabled={claimingNft? 1 : 0}
                    onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                    }}
                >
                {claimingNft ? "MINTING" : "MINT"}
                </button>
              </div>:
              <div className="col-md-3 col-sm-12 text-center">
                <button 
                  className="mint-btn comic-font"
                  disabled
                  onClick={(e) => {
                      e.preventDefault();
                  }}
                >
                  MINT
                </button>
              </div>
            }
             
        </div>
    </div>
  );
}

export default Test;
