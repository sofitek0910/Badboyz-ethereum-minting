// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let presaleStatus = await store
        .getState()
        .blockchain.smartContract.methods.currentPresaleStatus()
        .call();
console.log("presale------=====>", presaleStatus);
      let saleStatus = await store
        .getState()
        .blockchain.smartContract.methods.currentSaleStatus()
        .call();
      console.log("sale------=====>", saleStatus);
      dispatch(
        fetchDataSuccess({
          totalSupply,
          presaleStatus,
          saleStatus
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
