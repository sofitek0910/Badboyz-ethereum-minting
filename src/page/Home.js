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
  const storyObj1 = useRef();
  const storyObj2 = useRef();
  const storyObj3 = useRef();
  const storyObj4 = useRef();
  const storyObj5 = useRef();
  const storyObj6 = useRef();

  const handleScroll = () => {
    var flyObjDimension = flyObj.current.getBoundingClientRect();
    var whamObjDimension = whamObj.current.getBoundingClientRect();
    var bangObjDimension = bangObj.current.getBoundingClientRect();
    var powObjDimension = powObj.current.getBoundingClientRect();
    var kaboomObjDimension = kaboomObj.current.getBoundingClientRect();
    var originObjDimension = originObj.current.getBoundingClientRect();
    var storyObj1Dimension = storyObj1.current.getBoundingClientRect();
    var storyObj2Dimension = storyObj2.current.getBoundingClientRect();
    var storyObj3Dimension = storyObj3.current.getBoundingClientRect();
    var storyObj4Dimension = storyObj4.current.getBoundingClientRect();
    var storyObj5Dimension = storyObj5.current.getBoundingClientRect();
    var storyObj6Dimension = storyObj6.current.getBoundingClientRect();

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

    if ( originObjDimension.top <= window.innerHeight && originObjDimension.bottom >= 150 ) {
        originObj.current.style.setProperty("animation-name", "flash");
        originObj.current.style.setProperty("animation-duration", "1.5s");
        originObj.current.style.setProperty("animation-iteration-count", "1");
        originObj.current.style.setProperty("animation-fill-mode", "forwards");
    } 

    if ( storyObj1Dimension.top <= window.innerHeight && storyObj1Dimension.bottom >= 150 ) {
        storyObj1.current.style.setProperty("animation-name", "story");
        storyObj1.current.style.setProperty("animation-duration", "1s");
        storyObj1.current.style.setProperty("animation-delay", ".5s");
        storyObj1.current.style.setProperty("animation-iteration-count", "1");
        storyObj1.current.style.setProperty("animation-fill-mode", "forwards");

        storyObj2.current.style.setProperty("animation-name", "story");
        storyObj2.current.style.setProperty("animation-duration", "1s");
        storyObj2.current.style.setProperty("animation-delay", "1.5s");
        storyObj2.current.style.setProperty("animation-iteration-count", "1");
        storyObj2.current.style.setProperty("animation-fill-mode", "forwards");

        storyObj3.current.style.setProperty("animation-name", "story");
        storyObj3.current.style.setProperty("animation-duration", "1s");
        storyObj3.current.style.setProperty("animation-delay", "2.5s");
        storyObj3.current.style.setProperty("animation-iteration-count", "1");
        storyObj3.current.style.setProperty("animation-fill-mode", "forwards");

        storyObj4.current.style.setProperty("animation-name", "story");
        storyObj4.current.style.setProperty("animation-duration", "1s");
        storyObj4.current.style.setProperty("animation-delay", "3.5s");
        storyObj4.current.style.setProperty("animation-iteration-count", "1");
        storyObj4.current.style.setProperty("animation-fill-mode", "forwards");

        storyObj5.current.style.setProperty("animation-name", "story");
        storyObj5.current.style.setProperty("animation-duration", "1s");
        storyObj5.current.style.setProperty("animation-delay", "4.5s");
        storyObj5.current.style.setProperty("animation-iteration-count", "1");
        storyObj5.current.style.setProperty("animation-fill-mode", "forwards");

        storyObj6.current.style.setProperty("animation-name", "story");
        storyObj6.current.style.setProperty("animation-duration", "1s");
        storyObj6.current.style.setProperty("animation-delay", "5.5s");
        storyObj6.current.style.setProperty("animation-iteration-count", "1");
        storyObj6.current.style.setProperty("animation-fill-mode", "forwards");
    } 

    // if ( storyObj4Dimension.top <= window.innerHeight && storyObj4Dimension.bottom >= 150 ) {
       
    // } 
    
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
            <video className="width-100 landing-video" src="./assets/images/video01.mp4" autoPlay muted loop></video>
            {/* <img className="width-100" src="./assets/images/trailer_video.jpg"/> */}
        </div>
        <div className="badboy">
            <img className="width-100 badboyz" src="./assets/images/badboyz.jpg"/>
        </div>
        <div className="our-story">
            <img className="width-100 our-story-back" src="./assets/images/our-story.png"/>
            <div className="story-block">
                <div className="left-block">
                    <img className="story-image story-1" ref={storyObj1} src="./assets/images/story1.png"/>
                    <img className="story-image story-4" ref={storyObj4} src="./assets/images/story4.png"/>
                </div>
                <div className="medium-block">
                    <img className="story-image story-2" ref={storyObj2} src="./assets/images/story2.png"/>
                    <img className="story-image story-5" ref={storyObj5} src="./assets/images/story5.png"/>
                </div>
                <div className="right-block">
                    <img className="story-image story-3" ref={storyObj3} src="./assets/images/story3.png"/>
                    <img className="story-image story-6" ref={storyObj6} src="./assets/images/story6.png"/>
                </div>
            </div>
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
            <div className="roadmap-text-section">
                <div className="percent25-text">
                    <span className="roadmap-title">
                        Snack Time!
                    </span>
                    <div className="roadmap-content">
                        <i className="fa fa-circle"></i> First origin stories. <br/>
                        <i className="fa fa-circle"></i> Launch of Discord. <br/>
                        <i className="fa fa-circle"></i> BadBoyz animated trailer Chapter I.  
                    </div>
                </div>
                <div className="percent50-text">
                    <span className="roadmap-title">
                        Good guys turn bad.
                    </span>
                    <div className="roadmap-content">
                        <i className="fa fa-circle"></i> Start of marketing campaign. <br/>
                        <i className="fa fa-circle"></i> BadBoyz going live. <br/>
                        <i className="fa fa-circle"></i> Chapter I reveal. <br/>
                        <i className="fa fa-circle"></i> XXXX.
                    </div>
                </div>
                <div className="percent75-text">
                    <span className="roadmap-title">
                        Is it a bird, is it a plane?
                    </span>
                    <div className="roadmap-content">
                        <i className="fa fa-circle"></i> 40% of total secondary sales will be used to sweep the ﬂoor! <br/>
                        <i className="fa fa-circle"></i> BadBoyz gym clothes. <br/>
                        <i className="fa fa-circle"></i> BadBoyz #GetFitForRewards challenge. <br/>
                    </div>
                </div>
                <div className="percent100-text">
                    <span className="roadmap-title">
                        Badboyz Metaverse
                    </span>
                    <div className="roadmap-content">
                        <i className="fa fa-circle"></i> Join the Baddest Superhero League and experience them at hosted events in a 
                        Metaverse chosen by the community. <br/> 
                        <i className="fa fa-circle"></i> First animations based on holder NFTs.
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
                    <a href="./assets/images/BatBoy.png">
                        <img className="spider-boy comic-item-image" src="./assets/images/SpiderBoy.png" />
                    </a>
                </div>
                <div className="comic-item">
                    <a href="./assets/images/BatBoy.png">
                        <img className="bat-boy comic-item-image" src="./assets/images/BatBoy.png" /> 
                    </a>
                    
                </div>
                <div className="comic-item">
                    <a href="./assets/images/ComingSoon.png">
                        <img className="coming-soon comic-item-image" src="./assets/images/ComingSoon.png" />
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
            <img className="width-100 join-us-img" src="./assets/images/join_us.jpg"/>
            <div className="join-us-text comic-font text-center">
                Get together with likeminded Badboyz and shower other projects with warm, compassionate love!<br/>
                Come join the BadBoyz adventure in the official Discord server!
                <div className="text-center">
                    <a href="#">
                        <img className="width-100 discord-button" src="./assets/images/discord-button.png"/>
                    </a>
                </div>
            </div>
        </div>
        <div className="our-team">
            <img className="width-100 our-team-back" src="./assets/images/our_team.jpg"/>
            <img className="member founder" src="./assets/images/founder.png"/>
            <img className="member developer" src="./assets/images/developer.png"/>
            <img className="member designer" src="./assets/images/designer.png"/>
        </div>
        <div className="faq-section">
            <img className="width-100 footer-back" src="./assets/images/faq.jpg"/>
            <section className="rubik-font" id="accordionExample">
                <div className="row section-qa">
                    <div className="col-md-6 col-sm-12">
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingOne">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    Who are the BadBoyz?
                                </h2>
                            </div>
                            <div id="collapseOne" className="accordion-collapse collapse panel" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <p>
                                    BadBoyz is a collection of 3333 unique superheroes exploring their own multiverse and becoming the first web3 related animated superhero series.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingTwo">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Where will the minting take place?
                                </h2>
                            </div>
                            <div id="collapseTwo" className="accordion-collapse collapse panel" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <p>
                                    The minting will take place on our official website: https://badboyz.io/. 
                                    Keep an eye at the announcement channels in the official Discord for the exact link and beware of DM scammers.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingThree">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    What will be the mint price?
                                </h2>
                            </div>
                            <div id="collapseThree" className="accordion-collapse collapse panel" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <p>
                                    The public/pre sale mint price is yet to be announced.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingFour">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    When is the drop?
                                </h2>
                            </div>
                            <div id="collapseFour" className="accordion-collapse collapse panel" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                <p>
                                The public/pre sale date is yet to be announced in our official Discord announcements channel.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingFive">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    How can I get whitelisted?
                                </h2>
                            </div>
                            <div id="collapseFive" className="accordion-collapse collapse panel" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                <p>
                                    To save yourself a spot, you need to join the Discord, be active and helpful and follow the whitelisting process described in our dedicated „how-to-whitelist“ channel.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 accordion-container footer_round">
                            <div className="accordion py-2" id="headingSix">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                    What happens after Roadmap completion?
                                </h2>
                            </div>
                            <div id="collapseSix" className="accordion-collapse collapse panel" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                <p>
                                    The BadBoyz will continue their venture into the unknown depths of the Multiverse. Fueling their animated series with exciting story lines and new plot twists.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="footer-section">
            <img className="width-100" src="./assets/images/footer.jpg"/>
        </div>
    </div>
  );
}

export default Home;
