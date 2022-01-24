import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import swal from "sweetalert";

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [scrollY, setScrollY] = useState(window.innerHeight);
  const [walletAddress, setWallet] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [welcomeHeight, setWelcomeHeight] = useState(0);
  const [buyHeight, setBuyHeight] = useState(0);
  const [specsHeight, setSpecsHeight] = useState(0);
  const [roadmapHeight, setRoadmapHeight] = useState(0);
  const [communityHeight, setCommunityHeight] = useState(0);
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

  const handleScroll = () => {
    setScrollY(window.scrollY);
    setWelcomeHeight($(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height()-250);
    setBuyHeight($(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height()+$(".welcome-section").height()-250);
    setSpecsHeight($(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height()+$(".welcome-section").height()+$(".buy-section").height()-50);
    setRoadmapHeight($(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height()+$(".welcome-section").height()+$(".buy-section").height()+$(".spec-section").height());
    setCommunityHeight($(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height()+$(".welcome-section").height()+$(".buy-section").height()+$(".spec-section").height()+$(".roadmap-section").height()+$(".team-section").height()+250);
    // console.log("scroll--->", window.scrollY)
    console.log('scroll event', $(".top-section").height()+$(".navbar-block").height()+$(".hero-block").height());
  }
  
  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', changeWidth);
    return () => {
        window.removeEventListener('resize', changeWidth)
    }
  }, []);

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
        <div className="our-story">
            <img className="width-100" src="./assets/images/origin_story_back.jpg"/>
        </div>
        <div className="road-map">
            <img className="width-100" src="./assets/images/roadmap.jpg"/>
        </div>
        <div className="origin-story">
            <img className="width-100" src="./assets/images/origin_story_back.jpg"/>
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
