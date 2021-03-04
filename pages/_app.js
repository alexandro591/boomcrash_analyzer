import "../styles/globals.css";
import { ChakraProvider } from "../shared/chakra";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
