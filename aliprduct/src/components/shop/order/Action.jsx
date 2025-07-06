import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState, // To set errors or update clientToken/instance if needed
  getPaymentProcess, // Function to call Braintree payment processing
  totalCost // Function to calculate total cost
  // history/navigate is removed, will be handled by the calling component
) => {
  return new Promise((resolve, reject) => {
    if (!state.address) {
      setState({ ...state, error: "Please provide your address" });
      reject("Address is required.");
      return;
    }
    if (!state.phone) {
      setState({ ...state, error: "Please provide your phone number" });
      reject("Phone number is required.");
      return;
    }

    // Braintree instance is expected to be in state.instance by the calling component
    if (!state.instance || typeof state.instance.requestPaymentMethod !== 'function') {
      setState({ ...state, error: "Payment gateway not initialized."});
      reject("Payment gateway not initialized.");
      return;
    }

    state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: true });
        const nonce = data.nonce;
        const paymentData = {
          amountTotal: totalCost(),
          paymentMethod: nonce,
        };

        getPaymentProcess(paymentData)
          .then(async (paymentResult) => {
            if (paymentResult && paymentResult.success && paymentResult.transaction) { // Assuming success structure
              const orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")),
                // user ID is now added by backend using JWT from createOrder call
                amount: paymentResult.transaction.amount,
                transactionId: paymentResult.transaction.id,
                address: state.address,
                phone: state.phone,
              };

              try {
                const orderResponse = await createOrder(orderData);
                if (orderResponse && orderResponse.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true }); // For success message display
                  setState(prevState => ({ ...prevState, clientToken: "", instance: {} })); // Reset Braintree state
                  dispatch({ type: "loading", payload: false });
                  resolve(orderResponse);
                } else {
                  dispatch({ type: "loading", payload: false });
                  setState({ ...state, error: orderResponse.error || "Order creation failed."});
                  reject(orderResponse.error || "Order creation failed.");
                }
              } catch (error) {
                dispatch({ type: "loading", payload: false });
                console.error("Create order error:", error);
                setState({ ...state, error: "Order creation failed due to a network or server error."});
                reject("Order creation failed due to a network or server error.");
              }
            } else {
              dispatch({ type: "loading", payload: false });
              setState({ ...state, error: paymentResult.error || "Payment processing failed."});
              reject(paymentResult.error || "Payment processing failed.");
            }
          })
          .catch((paymentProcessError) => {
            dispatch({ type: "loading", payload: false });
            console.error("Braintree payment process error:", paymentProcessError);
            setState({ ...state, error: "Payment processing failed."});
            reject("Payment processing failed.");
          });
      })
      .catch((requestPaymentMethodError) => {
        dispatch({ type: "loading", payload: false }); // Ensure loading is stopped
        console.error("Braintree request payment method error:", requestPaymentMethodError);
        setState({ ...state, error: requestPaymentMethodError.message || "Failed to request payment method." });
        reject(requestPaymentMethodError.message || "Failed to request payment method.");
      });
  });
};
