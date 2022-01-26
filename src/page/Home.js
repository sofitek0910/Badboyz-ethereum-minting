import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import swal from "sweetalert";
import $ from "jquery";
// import "slick-slider";

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
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

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    console.log("smartcontract--->", blockchain.smartContract)
    // swal(`Minting your ${CONFIG.NFT_NAME}...`, "", "info");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .publicSaleMint()
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
        console.log(receipt);
        swal(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`, "", "success"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
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
    console.log("account===>", blockchain.account)
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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const flyObj = useRef();
  const whamObj = useRef();
  const bangObj = useRef();
  const powObj = useRef();
  const kaboomObj = useRef();

  const handleScroll = () => {
    var flyObjDimension = flyObj.current.getBoundingClientRect();
    var whamObjDimension = whamObj.current.getBoundingClientRect();
    var bangObjDimension = bangObj.current.getBoundingClientRect();
    var powObjDimension = powObj.current.getBoundingClientRect();
    var kaboomObjDimension = kaboomObj.current.getBoundingClientRect();

    if ( flyObjDimension.top+flyObj.current.height/2 <= window.innerHeight/2 ) {
        console.log("center position")
    }
    console.log("wham center position", whamObjDimension.top+whamObj.current.height/2, window.innerHeight/2+50)
    if ( whamObjDimension.top+whamObj.current.height/2 <= flyObjDimension.top+flyObj.current.height/2 ) {
        whamObj.current.style.setProperty("z-index", "-2")
    } else {
        whamObj.current.style.setProperty("z-index", "-10")
    }

    if ( bangObjDimension.top+bangObj.current.height/2 <= flyObjDimension.top+flyObj.current.height/2 ) {
        bangObj.current.style.setProperty("z-index", "-2")
    } else {
        bangObj.current.style.setProperty("z-index", "-10")
    }

    if ( powObjDimension.top+powObj.current.height/2 <= flyObjDimension.top+flyObj.current.height/2 ) {
        powObj.current.style.setProperty("z-index", "-2")
    } else {
        powObj.current.style.setProperty("z-index", "-10")
    }

    if ( kaboomObjDimension.top+kaboomObj.current.height/2 <= flyObjDimension.top+flyObj.current.height/2 ) {
        kaboomObj.current.style.setProperty("z-index", "-2")
    } else {
        kaboomObj.current.style.setProperty("z-index", "-10")
    }
  }

  useEffect(() => {
    getConfig();
  }, []);


  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div>
        <div className="trailer-video">
            <img className="width-100" src="./assets/images/trailer_video.jpg"/>
        </div>
        <div className="badboy">
            <img className="width-100" src="./assets/images/badboyz.jpg"/>
        </div>
        <div className="road-map">
            <img className="width-100 roadmap-image" src="./assets/images/roadmap.jpg"/>
            <img className="width-100 roadmap-front-image" src="./assets/images/roadmap_front.png"/>
            <div className="text-center">
                <img className="fly fixed" ref={flyObj} src="./assets/images/fly.png"/>
                <img className="wham" ref={whamObj} src="./assets/images/wham.png"/>
                <img className="bang" ref={bangObj}src="./assets/images/bang.png"/>
                <img className="pow" ref={powObj} src="./assets/images/pow.png"/>
                <img className="kaboom" ref={kaboomObj} src="./assets/images/kaboom.png"/>
            </div>
        </div>
        <div className="origin-story">
            {/* <img className="width-100 origin-story-back" src="./assets/images/origin_story_back.jpg"/> */}
            <div className="origin-title text-center">
                <img className="origin-story-title" src="./assets/images/origin_story_title.png"/>
            </div>
            <div className="comic-images-section">
                <div className="comic-item">
                    <a>
                        <img className="spider-boy comic-item-image" src="./assets/images/SpiderBoy.png" />
                    </a>
                </div>
                <div className="comic-item">
                    <a href="javascript:;">
                        <img className="bat-boy comic-item-image" src="./assets/images/BatBoy.png" /> 
                    </a>
                    
                </div>
                <div className="comic-item">
                    <a href="javascript:;">
                        <img className="coming-soon comic-item-image" src="./assets/images/SpiderBoy.png" />
                    </a>
                </div>
            </div>
            {/* <div className="gallery">
               <div className="slider__item">
      <img src="./assets/images/SpiderBoy.png" />
    </div>
    <div className="slider__item">
      <img src="./assets/images/BatBoy.png" /> 
    </div>
    <div className="slider__item">
      <img src="./assets/images/SpiderBoy.png" />
    </div>
                <div className="gallery-controls"></div>
            </div> */}
        </div>
        <div className="join-us">
            <img className="width-100" src="./assets/images/join_us.jpg"/>
        </div>
        <div className="our-team">
            <img className="width-100" src="./assets/images/our_team.jpg"/>
        </div>
        <div className="faq">
            <img className="width-100" src="./assets/images/faq.jpg"/>
        </div>
    </div>
  );
}

export default Home;
