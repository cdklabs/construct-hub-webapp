import NextDocument, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Construct Hub</title>
          <meta
            content="Construct Hub helps developers find open-source construct libraries for use with AWS CDK, CDK8s, CDKTf and other construct-based tools."
            name="description"
          />
          <script src="https://a0.awsstatic.com/s_code/js/3.0/awshome_s_code.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
