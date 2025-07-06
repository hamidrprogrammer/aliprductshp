import React, { Fragment, useState, useContext } from "react";
import Login from "./Login"; // Assuming Login and Signup components handle their own internal field styling
import Signup from "./Signup";
import { LayoutContext } from "../index";

const LoginSignup = (props) => {
  const { data, dispatch } = useContext(LayoutContext);

  const [login, setLogin] = useState(true);
  const [loginValue, setLoginValue] = useState("حساب کاربری ایجاد کنید"); // Translated

  const loginSignupModalToggle = () =>
    dispatch({ type: "loginSignupModalToggle", payload: !data.loginSignupModal });

  const changeLoginSignup = () => {
    if (login) {
      setLogin(false);
      setLoginValue("ورود به حساب کاربری"); // Translated
    } else {
      setLogin(true);
      setLoginValue("حساب کاربری ایجاد کنید"); // Translated
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={loginSignupModalToggle}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300
                    ${data.loginSignupModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Signup Login Component Render */}
      <section
        className={`fixed z-50 inset-0 flex items-center justify-center p-4 transition-opacity duration-300
                    ${data.loginSignupModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`relative w-full max-w-md bg-[var(--color-card-background)] text-[var(--color-text-primary)]
                      rounded-xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 ease-out
                      ${data.loginSignupModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          {/* Modal Close Button */}
          <button
            onClick={() => {
              loginSignupModalToggle();
              dispatch({ type: "loginSignupError", payload: false });
            }}
            className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="بستن"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="space-y-6">
            {login ? <Login /> : <Signup />} {/* Assume Login/Signup components will use new form styles */}

            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="flex-grow border-t border-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-secondary)] uppercase">یا</span>
              <span className="flex-grow border-t border-[var(--color-border)]" />
            </div>

            <button
              onClick={changeLoginSignup}
              className="w-full py-3 px-4 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)]
                         font-semibold hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-150
                         focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-accent)]"
            >
              {loginValue}
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default LoginSignup;
