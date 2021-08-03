import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { useLanguage } from "hooks/useLanguage";
import { getFullPackagePath } from "util/url";

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

  return null;
};
