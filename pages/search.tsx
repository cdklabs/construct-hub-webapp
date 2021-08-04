import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { fetchPackages, Packages } from "api/package/packages";
import { CatalogProvider } from "contexts/Catalog";
import { SearchResults } from "views/SearchResults";

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

const SearchPage: FunctionComponent<StaticProps> = ({ packages }) => (
  <CatalogProvider packages={packages}>
    <SearchResults />
  </CatalogProvider>
);

export default SearchPage;
