import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Delius+Unicase&display=swap');
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Roboto', sans-serif;;
  }

  body.fontLoaded {
    font-family: 'Roboto', sans-serif;;
  }

  #app {
    background-color: #f5f5f5;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Roboto', sans-serif;;
    line-height: 1.5em;
  }
`;

export default GlobalStyle;
