import { FunctionComponent, useMemo } from "react";
import { CatalogConstructFrameworkMeta } from "../../api/catalog-search";
import { CDKType, CDKTYPE_NAME_MAP } from "../../constants/constructs";
import { useSearchContext } from "../../contexts/Search";
import { RadioFilter } from "./RadioFilter";
import { useSearchState } from "./SearchState";

type CDKOptions = Partial<{
  [key in CDKType]: CatalogConstructFrameworkMeta & {
    display: string;
    value: key;
  };
}>;

export const CDKFilter: FunctionComponent = () => {
  const { cdkType, setCdkType, cdkMajor, setCdkMajor } =
    useSearchState().searchAPI;
  const searchAPI = useSearchContext()!;

  // Options with less than one package will be omitted
  const cdkOptions = useMemo(() => {
    const cdkTypes = searchAPI.constructFrameworks;
    const options = Object.entries(cdkTypes).reduce((opts, [name, meta]) => {
      if (meta.pkgCount < 1) {
        return opts;
      }

      return {
        ...opts,
        [name]: {
          display: CDKTYPE_NAME_MAP[name as CDKType],
          value: name,
          ...meta,
        },
      };
    }, {});

    return Object.keys(options).length ? (options as CDKOptions) : undefined;
  }, [searchAPI]);

  const majorsOptions = useMemo(() => {
    if (!cdkOptions || !cdkType) return undefined;
    const majorVersions = cdkOptions[cdkType]?.majorVersions;

    if (!majorVersions) return undefined;

    return [...majorVersions]
      .sort((a, b) => a - b)
      .map((value) => ({
        value: value.toString(),
        display: `${CDKTYPE_NAME_MAP[cdkType]} v${value}`,
      }));
  }, [cdkOptions, cdkType]);

  if (!cdkOptions) {
    return null;
  }

  const onCdkTypeChange = (type: string) => {
    const cdk = type as CDKType;
    setCdkMajor(undefined);
    setCdkType(type ? cdk : undefined);
  };

  const onCdkMajorChange = (major: string) => {
    if (!major) {
      setCdkMajor(undefined);
      return;
    }

    const majorNum = parseInt(major, 10);

    setCdkMajor(majorNum);
  };

  return (
    <>
      <RadioFilter
        hint="Constructs support distinct output types: AWS CDK libraries output Cloudformation Templates, CDK8s libraries output Kubernetes manifests, and CDKtf libraries output Terraform Configuration. The Construct Hub attempts to detect the output type of each library, but results are not guaranteed to be completely accurate."
        name="CDK Type"
        onValueChange={onCdkTypeChange}
        options={[
          { display: "Any CDK Type", value: "" },
          ...Object.values(cdkOptions),
        ]}
        value={cdkType ?? ""}
      />
      {/* No point in showing major versions if only a single one is available */}
      {!!(majorsOptions && majorsOptions.length > 1) && (
        <RadioFilter
          hint={`Allows you to filter by a major version of your selected CDK Type: (${
            CDKTYPE_NAME_MAP[cdkType!]
          })`}
          name="CDK Major Version"
          onValueChange={onCdkMajorChange}
          options={[
            { display: "Any Major Version", value: "" },
            ...majorsOptions,
          ]}
          value={cdkMajor?.toString() ?? ""}
        />
      )}
    </>
  );
};
