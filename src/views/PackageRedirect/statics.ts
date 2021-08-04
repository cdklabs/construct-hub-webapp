import { GetServerSideProps } from "next";
import { Language } from "constants/languages";
import { getFullPackagePath } from "util/url";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { name, scopedName, version, submodule } = params as Record<
    string,
    string
  >;

  return {
    redirect: {
      destination: getFullPackagePath({
        name: scopedName ? [name, scopedName].join("/") : name,
        submodule,
        lang: Language.TypeScript,
        version,
      }),
      permanent: false,
    },
  };
};
