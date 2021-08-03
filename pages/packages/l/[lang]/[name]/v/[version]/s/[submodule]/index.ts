import { Package, getPackageStatics } from "views/Package";

export const { getServerSideProps } = getPackageStatics({
  isSubmodule: true,
  isScoped: false,
});

export default Package;
