import type { GetStaticProps } from "next";
import type { FunctionComponent } from "react";
import { fetchPackages, Packages } from "api/package/packages";
import { CatalogProvider } from "contexts/Catalog";
import { Home } from "views/Home";

interface StaticProps {
  packages: Packages;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const data = await fetchPackages();
  return {
    props: {
      packages: data,
      revalidate: 60, // 1 minute
    },
  };
};

const HomePage: FunctionComponent<StaticProps> = ({ packages }) => (
  <CatalogProvider packages={packages}>
    <Home />
  </CatalogProvider>
);

export default HomePage;
