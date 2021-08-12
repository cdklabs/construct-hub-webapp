import { Package, getPackageStatics } from "views/Package";

export const { getStaticPaths, getStaticProps } = getPackageStatics({
  isScoped: true,
});

export default Package;
