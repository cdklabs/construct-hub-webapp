import { Package, getPackageStatics } from "views/Package";

export const { getStaticPaths, getStaticProps } = getPackageStatics({
  isScoped: false,
});

export default Package;
