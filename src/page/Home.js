import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from 'jquery';
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
        <div className="preloader">
            <div className="layer"></div>
            <div className="inner">
            {/* <figure> <img src="./assets/images/preloader1.gif" alt="Image"/> </figure> */}
            <span>Site Loading</span> </div>
        </div>
        <div className="top-section">
            <div className="top-icon-block">
                <a href="#">
                    <img className="top-icon" src="./assets/images/discord_red.png"/>
                </a>
                <a href="#">
                    <img className="top-icon" src="./assets/images/instagram_red.png"/>
                </a>
                <a href="#">
                    <img className="top-icon" src="./assets/images/twitter_red.png"/>
                </a>
                {blockchain.account == null && blockchain.account == undefined ? 
                  <button className="connect-button megrim-font"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }
                    }
                  >
                    CONNECT
                  </button>:
                  <span className="connect-button megrim-font">
                    {String(blockchain.account).substring(0, 4) +
                      "..." +
                      String(blockchain.account).substring(38)
                    }
                  </span>
                }
            </div>
        </div>
        
        <header className="navbar-block">
            <nav> 
                <a href="/"><img className="logo-image" src="./assets/images/logo.png"/></a>
                {(toggleMenu || screenWidth > 1060) && (
                    <div className="menu-block">
                        <ul className="list">
                            <li className="items"><a className="nav-item" href="#buy">Buy</a></li>
                            <li className="items"><a className="nav-item" href="#roadmap">Roadmap</a></li>
                            <li className="items"><a className="nav-item" href="#team">Team</a></li>
                            <li className="items"><a href="#"></a>gallery</li>
                            <li className="items"><a href="#"></a>utility</li>
                            <li className="items"><a href="#"></a>members</li>
                        </ul>
                    </div>
                )}
                <button onClick={toggleNav} className="menu-btn">MENU</button>
            </nav>
        </header>

        <div className="hero-block">
            <img className="hero-image wow rubberBand" src="./assets/images/landing_video1.gif"/>
        </div>
        <section className="welcome-section content-section">
            <div className="row d-flex flex-center">
                <div className="col-md-8 col-sm-12 wow bounceInLeft">
                    <div className="title-font welcome-font">
                        WELCOME TO THE DEAD PUNKZ
                    </div>
                    <div className="content-font1 welcome-content">
                        {
                            scrollY > welcomeHeight && 
                            <Typewriter
                                options={{
                                    strings: `10,000 High-end, Unique, & Hand-Picked programmatically generated SPOOKY SKELLY PUNKS brought back to life and encrypted on the ERC-721 blockchain by the DEAD PUNKZ. A community that will blow every other out of the water.`,
                                    autoStart: true,
                                    loop: true,
                                    deleteSpeed: 5,
                                    delay: 20
                                }}
                            />
                        }
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <img className="cat-gif width-100 wow bounceInRight" src="./assets/images/welcome.png"/>
                </div>
            </div>
        </section>

        <section id="buy" className="buy-section content-section wow bounceInLeft">
            <div className="title-font">BUY</div>
            <div className="row d-flex flex-center">
                <div className="col-md-8 col-sm-12">
                    <div className="content-font1">
                        {
                            scrollY > buyHeight && 
                            <Typewriter
                                options={{
                                    strings: `Every SPOOKY SKELLY PUNK costs .1 eth.There will be a presale for whitelist members, and a public sale following a day after. There will be only 9,980 avialble, as 20 will be used for the team, giveaways, & rewards. `,
                                    autoStart: true,
                                    loop: true,
                                    deleteSpeed: 5,
                                    delay: 20
                                }}
                            />
                        }
                    </div>
                </div>
                <div className="col-md-4 col-sm-12 text-center">
                    <button 
                        className="mint-btn rubik-font"
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
        </section>

        <section className="spec-section content-section  wow bounceInLeft">
            <div className="title-font">THE SPECS</div>
            <div className="row d-flex flex-center">
                <div className="col-lg-9 col-md-8 col-sm-12">
                    <div className="content-font2 specs-content-text">
                        {
                            scrollY > specsHeight && 
                            <Typewriter
                                options={{
                                    strings: `Each SPOOKY SKELLY PUNK is unique and programmatically generated from over 200 possible traits, including headwear, mouth pieces, glasses, and more. All SPOOKY SKELLYS have abilities and traits that make some rarer than others. Every Spooky Skelly is unique and sick. These DEAD PUNKZ are stored as ERC-721 tokens on the Ethereum blockchain. Check out how rare your skelly is through rarity.tools. To Enter the members only area click on the “Members Only” link or the “Member” tab at the top of the page. You must be signed into you rmetamask wallet to enter the members club.`,
                                    autoStart: true,
                                    loop: true,
                                    deleteSpeed: 5,
                                    delay: 20
                                }}
                            />
                        }
                        
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 text-center">
					<div className="row">
						<div className="col-md-12 col-sm-6">
							<a href="#">
								<img className="width-100 club-btn" src="./assets/images/rarity.png"></img>
							</a>
						</div>
						<div className="col-md-12 col-sm-6">
							<a href="#">
								<img className="width-100 club-btn" src="./assets/images/club.png"></img>
							</a>
						</div>
					</div>
                </div>
            </div>
        </section>

        <section id="roadmap" className="roadmap-section content-section">
			<div className="wow bounceInLeft">
				<div className="title-font">ROADMAP</div>
				<div className="content-font2">
                    {
                        scrollY > roadmapHeight && 
                        <Typewriter
                            options={{
                                strings: `Our Roadmap catalogs a handful of future utilities and benefits we wish to bring our members as our community develops. Glance over the phases to see a few of the concepts we wish to bring to light and deliver as our project grows. We are constantly integrating new ideas and will evolve to meet the needs of our community to make sure we provide the top meta verse experience`,
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 5,
                                delay: 20
                            }}
                        />
                    }
				</div>
			</div>
            
            <div className="row d-flex roadmap-block wow zoomInUp">
                <div className="col-md-6 col-sm-12 text-center">
                    <img className="width-100" src="./assets/images/roadmap.jpeg"/>
                </div>
                <div className="col-md-6 col-sm-12">
					<div className="accordion" id="accordionExample">
						<div className="accordion-item">
							<h2 className="accordion-header" id="headingOne">
								<div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
									<button className="phase-btn">phase 1</button> initiation
								</div>
							</h2>
							<div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
								<div className="accordion-body rubik-font">
									This is roadmap answer for intiation one
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
									This is the answer for phase 2.
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
									This is the answer for phase 3.
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
									This is the answer for phase 4.
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
									This is the answer for phase 5.
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
									This is the answer for phase 6.
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
									This is the answer for phase 7.
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
									This is the answer for phase 8.
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
									This is the answer for phase 9.
								</div>
							</div>
						</div>
						<div className="accordion-item">
							<h2 className="accordion-header" id="heading10">
								<div className="accordion-button collapsed rubik-font" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
									<button className="phase-btn phase10">phase 10</button> deadverse
								</div>
							</h2>
							<div id="collapse8" className="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#accordionExample">
								<div className="accordion-body rubik-font">
									This is the answer for phase 10.
								</div>
							</div>
						</div>
					</div>
                </div>
            </div>
        </section>

		<section id="team" className="spec-section team-section content-section wow rollIn">
            <div className="title-font">TEAM</div>
            <div className="row d-flex flex-center">
                <div className="col-md-3 col-sm-6">
					<img className="width-100 team-image" src="./assets/images/member1.png"/>
					<div className="member-name">
						coordinate
					</div>
                </div>
				<div className="col-md-3 col-sm-6">
					<img className="width-100 team-image" src="./assets/images/member2.png"/>
					<div className="member-name">
						don
					</div>
                </div>
				<div className="col-md-3 col-sm-6">
					<img className="width-100 team-image" src="./assets/images/member3.png"/>
					<div className="member-name">
						trill
					</div>
                </div>
				<div className="col-md-3 col-sm-6">
					<img className="width-100 team-image" src="./assets/images/member4.png"/>
					<div className="member-name">
						steven
					</div>
                </div>
            </div>
        </section>

		<section className="community-section content-section wow fadeInUp">
            <div className="title-font">JOIN OUR COMMUNITY</div>
            <div className="content-font1">
                {
                    scrollY > communityHeight && 
                    <Typewriter
                        options={{
                            strings: `Become a part of the community. join our discord for exclusive news, giveaways, fun games, and ask any questions about DEAD PUNKZ NFTS. `,
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 5,
                            delay: 20
                        }}
                    />
                }
				
			</div>
			<div className="join-discord text-center">
				<button className="discord-button rubik-font">
					JOIN DISCORD
				</button>
			</div>
			<div className="smart-contract rubik-font">
				VERIFIED SMART CONTRACT ADDRESS:
			</div>
        </section>

		<section className="bottom-section wow zoomIn">
			<div className="row d-flex flex-center">
                <div className="col-md-4 col-sm-12">
					<div className="subscribe">
						<div className="subscribe-title">GET ON THE LIST</div>
						<div className="mx-0">
							<div className="input-group mb-3 mt-4"> 
								<input type="text" className="form-control" placeholder="EMAIL ADDRESS" aria-label="Recipient's username" aria-describedby="button-addon2"/> 
								<button className="btn btn-success border-rad" type="button" id="button-addon2">&#10132;</button> 
							</div>
						</div>
					</div>
                </div>
				<div className="col-md-4 col-sm-12 bottom-logo-block">
					<img className="width-100 bottom-logo" src="./assets/images/logo.png"/>
                </div>
				<div className="col-md-4 col-sm-12">
					<div className="bottom-icon-section">
						<div className="bottom-icon-block">
							<a href="#">
								<img className="top-icon" src="./assets/images/discord.png"/>
							</a>
							<a href="#">
								<img className="top-icon" src="./assets/images/instagram.png"/>
							</a>
							<a href="#">
								<img className="top-icon" src="./assets/images/twitter.png"/>
							</a>
							<a href="#">
								<img className="top-icon" src="./assets/images/video.png"/>
							</a>
						</div>
					</div>
					<div className="bottom-text-block">
						<div>&#169; 2022 DEAD PUNKZ LLC</div>
						<div>DPTERMS # CONDITIONS</div>
						<div>SSPTERMS # CONDITIONS</div>
						<div>DPZTERMS # CONDITIONS</div>
					</div>
                </div>
            </div>
        </section>
    </div>
  );
}

export default Home;
