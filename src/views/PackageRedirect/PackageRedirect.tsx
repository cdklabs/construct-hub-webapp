import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { useLanguage } from "hooks/useLanguage";
import { getFullPackagePath } from "util/url";

/**
 * A client side redirect from a versioned package route to the full package route with the user's stored language
 */
export const PackageRedirect: FunctionComponent = () => {
  const { query = {}, replace } = useRouter();
  const [language] = useLanguage();

  useEffect(() => {
    const { name, scopedName, version } = query as Record<string, string>;

    if (!name || !version) return;

    const fullName = scopedName ? `${name}/${scopedName}` : name;

    void replace(
      getFullPackagePath({
        name: fullName,
        version,
        lang: language,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Center>
      <Spinner size="xl" />
    </Center>
  );
};
