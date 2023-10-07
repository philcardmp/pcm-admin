import "../styles/globals.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
