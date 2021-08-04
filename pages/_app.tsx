import { Grid } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import type { FunctionComponent } from "react";
import "index.css";
import { DevPreviewBanner } from "components/DevPreviewBanner";
import { Footer } from "components/Footer";
import { Header } from "components/Header";
import { ExternalLinkWarningProvider } from "contexts/ExternalLinkWarning";
import { ShortbreadProvider } from "contexts/Shortbread";
import { Theme } from "contexts/Theme";

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <ShortbreadProvider>
      <Head>
        {/* Sets default title / description */}
        <title>Construct Hub</title>
        <meta
          content="Construct Hub helps developers find open-source construct libraries for use with AWS CDK, CDK8s, CDKTf and other construct-based tools."
          name="description"
        />
      </Head>
      <Theme>
        <ExternalLinkWarningProvider>
          <Grid
            as="main"
            bg="bgPrimary"
            gridTemplateColumns="1fr"
            gridTemplateRows="auto auto 1fr auto"
            h="100%"
            inset={0}
            maxW="100vw"
            overflow="hidden auto"
            position="fixed"
          >
            <Header />
            <DevPreviewBanner />
            <Component {...pageProps} />
            <Footer />
          </Grid>
        </ExternalLinkWarningProvider>
      </Theme>
    </ShortbreadProvider>
  );
};

export default App;
