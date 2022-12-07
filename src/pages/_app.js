import MusicPlayer from "components/musicPlayer";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return <MusicPlayer Component={Component} pageProps={pageProps} />;
}
