export const layoutState = {
  navberHamburger: false,
  loginSignupModal: false,
  loginSignupError: false,
  cartModal: false,
  cartProduct: null,
  singleProductDetail: null,
  inCart: null,
  cartTotalCost: null,
  orderSuccess: false,
  loading: false,
  // وضعیت اولیه تم با بررسی localStorage و prefers-color-scheme
  isDarkMode: localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
};

export const layoutReducer = (state, action) => {
  switch (action.type) {
    case "hamburgerToggle":
      return {
        ...state,
        navberHamburger: action.payload,
      };
    case "loginSignupModalToggle":
      return {
        ...state,
        loginSignupModal: action.payload,
      };
    case "cartModalToggle":
      return {
        ...state,
        cartModal: action.payload,
      };
    case "cartProduct":
      return {
        ...state,
        cartProduct: action.payload,
      };
    case "singleProductDetail":
      return {
        ...state,
        singleProductDetail: action.payload,
      };
    case "inCart":
      return {
        ...state,
        inCart: action.payload,
      };
    case "cartTotalCost":
      return {
        ...state,
        cartTotalCost: action.payload,
      };
    case "loginSignupError":
      return {
        ...state,
        loginSignupError: action.payload,
      };
    case "orderSuccess":
      return {
        ...state,
        orderSuccess: action.payload,
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "toggleTheme":
      const newIsDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return {
        ...state,
        isDarkMode: newIsDarkMode,
      };
    default:
      return state;
  }
};
