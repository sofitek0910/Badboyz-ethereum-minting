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
    console.log("smartcontract--->", blockchain.smartContract);
    console.log("presale status: ", data.presaleStatus);
    // swal(`Minting your ${CONFIG.NFT_NAME}...`, "", "info");
    setClaimingNft(true);

    if (!data.presaleStatus && !data.loading) {
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
  const navObj = useRef();
  const roadmapObj = useRef();
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
    var roadmapObjDimension = roadmapObj.current.getBoundingClientRect();
    var storyObj2Dimension = storyObj2.current.getBoundingClientRect();
    var storyObj3Dimension = storyObj3.current.getBoundingClientRect();
    var storyObj4Dimension = storyObj4.current.getBoundingClientRect();
    var storyObj5Dimension = storyObj5.current.getBoundingClientRect();
    var storyObj6Dimension = storyObj6.current.getBoundingClientRect();

    console.log("scroll", window.scrollY)
    if (window.scrollY>10){
        navObj.current.style.setProperty("animation-name", "fadeOut");
        navObj.current.style.setProperty("animation-duration", "1.5s");
        navObj.current.style.setProperty("animation-iteration-count", "1");
        navObj.current.style.setProperty("animation-fill-mode", "forwards");
    } else {
        navObj.current.style.setProperty("animation-name", "fadeIn");
        navObj.current.style.setProperty("animation-duration", "1.5s");
        navObj.current.style.setProperty("animation-iteration-count", "1");
        navObj.current.style.setProperty("animation-fill-mode", "forwards");
    }
    
    if(roadmapObjDimension.top < window.innerHeight && roadmapObjDimension.bottom >= 0) {
		flyObj.current.style.setProperty("display", "block");
	} else {
        flyObj.current.style.setProperty("display", "none");
    }

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
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div>
        <div className="preloader">
            <div className="layer"></div>
            <div className="inner">
				<figure>
                    <video className="width-100" src="./assets/images/trailer.webm" type="video/webm" controls>
                        {/* <source src="./assets/images/trailer.webm" type="video/webm"></source> */}
                    </video>
				</figure> 
                <span>Loading graphics..<br/> Please have patience</span>
			</div>
        </div>
        <nav className="navbar" ref={navObj}>
            <div className="container">
                <img className="lazy logo-image" src="./assets/images/logo.png"/>
                <div className="social-links">
                    <a className="social-item" href="https://www.youtube.com/channel/UCIsge5kzES4PcpRlsTiTvIA" target="_blank"><i className="fab fa-youtube"></i></a>
                    <a className="social-item" href="https://www.twitter.com/thebadboyznft" target="_blank"><i className="fab fa-twitter"></i></a>
                    <a className="social-item" href="https://www.instagram.com/thebadboyznft" target="_blank"><i className="fab fa-instagram"></i></a>
                    <a className="social-item" href="https://discord.gg/badboyz" target="_blank"><i className="fab fa-discord"></i></a>
                </div>
            </div>
        </nav>
        <div className="badboy">  
            <div className="mobile-youtube-block">
                <div className="youtube-container">
                    {/* <video className="landing-video" controls> */}
                        {/* <source src="./assets/images/trailer.webm" type="video/webm"></source> */}
                    {/* </video> */}
                    <iframe className="width-100 landing-video" frameBorder="0" allowFullScreen src="https://www.youtube.com/embed/oqZErpzJMJM"> 
                    </iframe>
                </div>
            </div>  
            <img className="lazy width-100 badboyz" src="./assets/images/badboyz.jpg"/>
            <img className="lazy width-100 badboyz-mobile" src="./assets/images/mobile/trail_logo.jpg"/>  
            {blockchain.account == null && blockchain.account == undefined ? 
                <button className="connect-button comic-font btn btn-white no-display"
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
            <div className="col-md-3 col-sm-12 text-center">
                <button 
                    className="mint-btn comic-font btn btn btn-white no-display"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                    }}
                >
                {claimingNft ? "MINTING" : "MINT"}
                </button>
            </div> 
        </div>
        <div className="our-story">
            <img className="lazy width-100 our-story-back" src="./assets/images/our_story.jpg"/>
            <img className="lazy width-100 our-story-back-mobile" src="./assets/images/mobile/our_story_background.png"/>
            <div className="story-block row">
                <div className="left-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-1" ref={storyObj1} src="./assets/images/story1.jpg"/>
                </div>
                <div className="medium-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-2" ref={storyObj2} src="./assets/images/story2.jpg"/>
                </div>
                <div className="right-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-3" ref={storyObj3} src="./assets/images/story3.jpg"/>
                </div>
                <div className="left-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-4" ref={storyObj4} src="./assets/images/story4.jpg"/>
                </div>
                <div className="medium-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-5" ref={storyObj5} src="./assets/images/story5.jpg"/>
                </div>
                <div className="right-block col-md-4 story-item col-sm-6 px-0">
                    <img className="lazy story-image story-6" ref={storyObj6} src="./assets/images/story6.jpg"/>
                </div>
            </div>
            {/* <div className="story-block-mobile">
                <div className="left-block">
                    <img className="lazy story-image story-1" ref={storyObj1} src="./assets/images/story1.png"/>
                    <img className="lazy story-image story-3" ref={storyObj3} src="./assets/images/story3.png"/>
                    <img className="lazy story-image story-5" ref={storyObj5} src="./assets/images/story5.png"/>
                </div>
                <div className="right-block">
                    <img className="lazy story-image story-2" ref={storyObj2} src="./assets/images/story2.png"/>
                    <img className="lazy story-image story-4" ref={storyObj3} src="./assets/images/story4.png"/>
                    <img className="lazy story-image story-6" ref={storyObj6} src="./assets/images/story6.png"/>
                </div>
            </div> */}
        </div>
        <div className="road-map " ref={roadmapObj}>
            <img className="lazy width-100 roadmap-image" src="./assets/images/WEB5.jpg"/>
            <img className="lazy width-100 roadmap-image-mobile" src="./assets/images/mobile/roadmap-bottom-layer.jpg"/>
            <img className="lazy width-100 roadmap-front-image" src="./assets/images/roadmap_front.png"/>
            <img className="lazy width-100 roadmap-front-image-mobile" src="./assets/images/mobile/roadmap_top_layer.jpg"/>
            <div className="text-center">
                <img className="lazy fly fixed" ref={flyObj} src="./assets/images/fly.png"/>
                <img className="lazy wham" ref={whamObj} src="./assets/images/wham.png"/>
                <img className="lazy bang" ref={bangObj}src="./assets/images/bang.png"/>
                <img className="lazy pow" ref={powObj} src="./assets/images/pow.png"/>
                <img className="lazy kaboom" ref={kaboomObj} src="./assets/images/kaboom.png"/>
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
                <img className="lazy origin-story-title" ref={originObj} src="./assets/images/origin_story_title.png"/>
            </div>
            <div className="comic-images-section">
                <div className="comic-item">
                    <a href="./assets/images/SpiderBoy.jpg" data-fancybox>
                        <img className="lazy spider-boy comic-item-image" src="./assets/images/SpiderBoy.jpg" />
                    </a>
                </div>
                <div className="comic-item">
                    <a href="./assets/images/BatBoy.jpg" data-fancybox>
                        <img className="lazy bat-boy comic-item-image" src="./assets/images/BatBoy.jpg" /> 
                    </a>
                </div>
                <div className="comic-item">
                    <a href="./assets/images/ComingSoon.jpg" data-fancybox>
                        <img className="lazy coming-soon comic-item-image" src="./assets/images/ComingSoon.jpg" />
                    </a>
                </div>
            </div>
        </div>
        <div className="join-us">
            <img className="lazy width-100 join-us-img" src="./assets/images/join_discord.jpg"/>
            <img className="lazy width-100 join-us-img-mobile" src="./assets/images/join_us.jpg"/>
            <div className="join-us-text comic-font text-center">
                <div className="join-us-text-block">
                    Get together with likeminded Badboyz and shower other projects with warm, compassionate love!<br/>
                    Come join the BadBoyz adventure in the official Discord server!
                </div>
                <div className="text-box text-center comic-caption">
                    <a href="https://discord.gg/badboyz" target="_blank" className="btn btn-white btn-animate">JOIN DISCORD</a>
                </div>
            </div>
        </div>
        <div className="our-team">
            <img className="lazy width-100 our-team-back" src="./assets/images/our_team.jpg"/>
            <img className="lazy width-100 our-team-back-mobile" src="./assets/images/mobile/our_team.jpg"/>
            <div className="row text-center team-block">
                <div className="col-md-6 col-sm-6 team-item">
                    <img className="lazy member co-founder1" src="./assets/images/team1.png"/>
                    <div className="team-caption co-founder1">
                        <div>CO-FOUNDER</div>
                        <div>NAME</div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 team-item">
                    <img className="lazy member co-founder2" src="./assets/images/team2.png"/>
                    <div className="team-caption co-founder2">
                        <div>CO-FOUNDER</div>
                        <div>NAME</div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <img className="lazy member-second-row member center-member" src="./assets/images/team3.png"/>
                    <div className="team-caption">
                        <div>DEVELOPER</div>
                        <div>NAME</div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-6 team-item">
                    <img className="lazy member-second-row member" src="./assets/images/team4.png"/>
                    <div className="team-caption">
                        <div>MARKETER</div>
                        <div>NAME</div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-6 team-item">
                    <img className="lazy member-second-row member" src="./assets/images/team5.png"/>
                    <div className="team-caption">
                        <div>ARTIST</div>
                        <div>NAME</div>
                    </div>
                </div>
            </div>
            <img className="lazy width-100 footer-img" src="./assets/images/footer.jpg"/>
            <div className="footer-logo-section">
                    <div>
                        <a className="social-text" href="https://discord.gg/badboyz" target="_blank">Discord</a>
                    </div>
                    <div>
                        <img className="lazy logo-image footer-logo-image" src="./assets/images/logo.png"/>
                    </div>
                    <div>
                        <a className="social-text mx-2" href="https://www.instagram.com/thebadboyznft" target="_blank">Instagram</a>
                        <a className="social-text mx-2" href="https://www.twitter.com/thebadboyznft" target="_blank">Twitter</a>
                        <a className="social-text mx-2" href="https://www.youtube.com/channel/UCIsge5kzES4PcpRlsTiTvIA" target="_blank">Youtube</a>
                    </div>
                </div>
        </div>
        <div className="faq-section">
            <img className="lazy width-100 footer-back" src="./assets/images/faq.jpg"/>
            <img className="lazy width-100 footer-back-mobile" src="./assets/images/mobile/faq.jpg"/>
            <section className="rubik-font accordion-section" id="accordionExample">
                <div className="row section-qa">
                    <div className="col-md-6 col-sm-12">
                        <div className="mt-3 accordion-container footer_round">
                            <div className="accordion py-1" id="headingOne">
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
                        <div className="mt-3 accordion-container footer_round">
                            <div className="accordion py-1" id="headingTwo">
                                <h2 className="footer-font" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Where will the minting take place?
                                </h2>
                            </div>
                            <div id="collapseTwo" className="accordion-collapse collapse panel" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <p>
                                    The minting will take place on our official website: https://bboyz.ioad/. 
                                    Keep an eye at the announcement channels in the official Discord for the exact link and beware of DM scammers.
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 accordion-container footer_round">
                            <div className="accordion py-1" id="headingThree">
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
                        <div className="mt-3 accordion-container footer_round special-footer-round">
                            <div className="accordion py-1" id="headingFour">
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
                        <div className="mt-3 accordion-container footer_round">
                            <div className="accordion py-1" id="headingFive">
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
                        <div className="mt-3 accordion-container footer_round">
                            <div className="accordion py-1" id="headingSix">
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
        {/* <div className="footer-section">
            <img className="lazy width-100 footer-img" src="./assets/images/footer.jpg"/>
        </div> */}
    </div>
  );
}

export default Home;
