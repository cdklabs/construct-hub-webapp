import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { QUERY_PARAMS } from "../../../constants/url";
import { useLanguage } from "../../../hooks/useLanguage";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { API_URL_RESOURCE } from "../constants";
import { usePackageState } from "../PackageState";
import type { MenuItem } from "../util";
import { schemaToSectionItems } from "./util";

export const useSectionItems = (): MenuItem[] => {
  const { path } = useRouteMatch();
  const { jsonDocs } = usePackageState();
  const match = useRouteMatch<{ typeId: string }>(
    `${path}/${API_URL_RESOURCE}/:typeId`
  );
  const typeId = match?.params.typeId;

  const [language] = useLanguage();
  const q = useQueryParams();
  const submodule = q.get(QUERY_PARAMS.SUBMODULE) ?? "";

  const { types, metadata } = useMemo(() => {
    if (!jsonDocs.data) return { types: [] };

    const apiReference = jsonDocs.data?.apiReference;
    if (!apiReference) return { types: [] };

    return {
      types: [
        ...apiReference.classes,
        ...apiReference.constructs,
        ...apiReference.interfaces,
        ...apiReference.structs,
        ...apiReference.enums,
      ],
      metadata: jsonDocs.data.metadata,
    };
  }, [jsonDocs]);

  const typeInfo = types.find((type) => type.displayName === typeId);
  return typeInfo && metadata
    ? schemaToSectionItems(typeInfo, language, submodule)
    : [];
};
