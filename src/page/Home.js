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
  const originObj = useRef();

  const handleScroll = () => {
    var flyObjDimension = flyObj.current.getBoundingClientRect();
    var whamObjDimension = whamObj.current.getBoundingClientRect();
    var bangObjDimension = bangObj.current.getBoundingClientRect();
    var powObjDimension = powObj.current.getBoundingClientRect();
    var kaboomObjDimension = kaboomObj.current.getBoundingClientRect();
    var originObjDimension = originObj.current.getBoundingClientRect();

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

    if ( originObjDimension.top <= window.innerHeight && originObjDimension.bottom >= 100 ) {
        originObj.current.style.setProperty("animation-name", "flash");
        originObj.current.style.setProperty("animation-duration", "1.5s");
        originObj.current.style.setProperty("animation-iteration-count", "1");
        originObj.current.style.setProperty("animation-fill-mode", "forwards");
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
            <div className="roadmap-text-section rubik-font">
                <div className="percent25-text">
                    <span className="roadmap-title">
                        Snack Time!
                    </span>
                    <div className="roadmap-content">
                        First origin stories. <br/>
                        Launch of Discord. <br/>
                        BadBoyz animated trailer Chapter I.  
                    </div>
                </div>
                <div className="percent50-text">
                    <span className="roadmap-title">
                        Good guys turn bad.
                    </span>
                    <div className="roadmap-content">
                        Start of marketing campaign. <br/>
                        BadBoyz going live. <br/>
                        Chapter I reveal. <br/>
                        XXXX.
                    </div>
                </div>
                <div className="percent75-text">
                    <span className="roadmap-title">
                        Is it a bird, is it a plane?
                    </span>
                    <div className="roadmap-content">
                        40% of total secondary sales will be used to sweep the ﬂoor! <br/>
                        BadBoyz gym clothes. <br/>
                        BadBoyz #GetFitForRewards challenge. <br/>
                    </div>
                </div>
                <div className="percent100-text">
                    <span className="roadmap-title">
                        Badboyz Metaverse
                    </span>
                    <div className="roadmap-content">
                        Join the Baddest Superhero League and experience them at hosted events in a 
                        Metaverse chosen by the community. <br/> 
                        First animations based on holder NFTs.
                    </div>
                </div>
            </div>
        </div>
        <div className="origin-story">
            <div className="origin-title text-center">
                <img className="origin-story-title" ref={originObj} src="./assets/images/origin_story_title.png"/>
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
        <div className="faq-section">
            <img className="width-100" src="./assets/images/faq.jpg"/>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      <button className="phase-btn">phase 1</button> initiation
                    </div>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      WELCOME TO DEAD PUNKZ.PRESALE &
                      MINT DATE ANNOUNCED FOR THE
                      SPOOKY SKELLY PUNKZ
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <button className="phase-btn">phase 2</button> reveal
                    </div>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      ALL SPOOKY SKELLY PUNKS ARE
                      REVEALED TO HOLDERS
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading3">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                      <button className="phase-btn">phase 3</button> vamp airdrops
                    </div>
                  </h2>
                  <div id="collapse3" className="accordion-collapse collapse rubik-font" aria-labelledby="heading3" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      1993 Vamp Punkz airdropped to 
                      random Spooky Skelly Punk holders
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading4">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                      <button className="phase-btn">phase 4</button> DEAD PUNKZ Z
                    </div>
                  </h2>
                  <div id="collapse4" className="accordion-collapse collapse rubik-font" aria-labelledby="heading4" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      Reveal of presale and mint date 
                      for DEAD PUNK Zombies 
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading3">
                    <div className="accordion-button collapsed 
                    rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                      <button className="phase-btn">phase 5</button> mummy airdrops
                    </div>
                  </h2>
                  <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      777 Mummy Punkz airdropped to 
                      random DEAD PUNK Zombies holders
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading6">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
                      <button className="phase-btn">phase 6</button> merch realease
                    </div>
                  </h2>
                  <div id="collapse6" className="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      DeadPunkz™ official clothing line 
                      release exclusively to DEAD PUNKZ 
                      Holders
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading7">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
                      <button className="phase-btn">phase 7</button> customization
                    </div>
                  </h2>
                  <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      Custom Dead Punk CREATOR, create 
                      a DeadPunk and gain cool new 
                      traits and additions to your Dead
                      Punk
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading8">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
                      <button className="phase-btn">phase 8</button> dead punkz festival
                    </div>
                  </h2>
                  <div id="collapse8" className="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      Exclusive Festival for all holders 
                      of DeadPunkz, with concerts, food, 
                      celebrity appearances and more
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading9">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
                      <button className="phase-btn">phase 9</button> deadverse beta
                    </div>
                  </h2>
                  <div id="collapse9" className="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                      Reveal and first access the beta 
                      to DeadPunkz game
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading10">
                    <div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
                      <button className="phase-btn phase10">phase 10</button> deadverse
                    </div>
                  </h2>
                  <div id="collapse10" className="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#accordionExample">
                    <div className="accordion-body rubik-font">
                    DeadPunkz meta verse, an undead 
                      mirror to our own with passive income 
                      potential, real estate and job 
                      opportunities, along with immersive 
                      aesthetics and exclusive holder 
                      benefits. DEADVERSE games release.
                    </div>
                  </div>
                </div>
              </div>
            <section className="section-qa rubik-font">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font">1. Who are the BadBoyz?</h2>
                            </button>
                            <div className="panel">
                                <p>BadBoyz is a collection of 3333 unique superheroes exploring their own multiverse and becoming the first web3 related animated superhero series.</p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font"> 3. Where will the minting take place?</h2>
                            </button>
                            <div className="panel">
                                <p>
                                    The minting will take place on our official website: https://badboyz.io/. 
                                    Keep an eye at the announcement channels in the official Discord for the exact link and beware of DM scammers. 
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font">5. What will be the mint price?</h2>
                            </button>
                            <div className="panel">
                                <p>The public/pre sale mint price is yet to be announced.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font"> 2. When is the drop?</h2>
                            </button>
                            <div className="panel">
                                <p>The public/pre sale date is yet to be announced in our official Discord announcements channel.</p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font">4. How can I get whitelisted?</h2>
                            </button>
                            <div className="panel">
                                <p>
                                    To save yourself a spot, you need to join the Discord, be active and helpful 
                                    and follow the whitelisting process described in our dedicated „how-to-whitelist“ channel.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <button className="accordion py-2">
                                <h2 className="footer-font"> 6. What happens after Roadmap completion?</h2>
                            </button>
                            <div className="panel">
                                <p>
                                    The BadBoyz will continue their venture into the unknown depths of the Multiverse. 
                                    Fueling their animated series with exciting story lines and new plot twists.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
}

export default Home;
