import { Package, getPackageStatics } from "views/Package";

export const { getStaticPaths, getStaticProps } = getPackageStatics({
  isSubmodule: true,
  isScoped: true,
});

export default Package;
