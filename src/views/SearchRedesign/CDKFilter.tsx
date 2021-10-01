import { FunctionComponent, useMemo } from "react";
import { CDKType, CDKTYPE_NAME_MAP } from "../../constants/constructs";
import { useSearchContext } from "../../contexts/Search";
import { Filter } from "./Filter";
import { useSearchState } from "./SearchState";

type CDKOptions = Partial<{
  [key in CDKType]: {
    display: string;
    value: key;
    pkgCount: number;
    majorVersions: number[];
  };
}>;

export const CDKFilter: FunctionComponent = () => {
  const { cdkType, setCdkType, cdkMajor, setCdkMajor } =
    useSearchState().searchAPI;
  const searchAPI = useSearchContext()!;

  const cdkOptions = useMemo(() => {
    const cdkTypes = searchAPI.constructFrameworks;
    const options = Object.entries(cdkTypes ?? {}).reduce(
      (opts, [name, meta]) => ({
        ...opts,
        [name]: {
          display: CDKTYPE_NAME_MAP[name as CDKType],
          value: name,
          ...meta,
        },
      }),
      {}
    );

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
    setCdkType(cdk === cdkType ? undefined : cdk);
  };

  const onCdkMajorChange = (major: string) => {
    const majorNum = parseInt(major, 10);

    setCdkMajor(majorNum === cdkMajor ? undefined : majorNum);
  };

  return (
    <>
      <Filter
        hint="Constructs support distinct output types: AWS CDK libraries output Cloudformation Templates, CDK8s libraries output Kubernetes manifests, and CDKtf libraries output Terraform Configuration. The Construct Hub attempts to detect the output type of each library, but results are not guaranteed to be completely accurate."
        name="CDK Type"
        onValueChange={onCdkTypeChange}
        options={Object.values(cdkOptions)}
        values={cdkType ? [cdkType] : []}
      />
      {/* No point in showing major versions if only a single one is available */}
      {!!(majorsOptions && majorsOptions.length > 1) && (
        <Filter
          hint={`Allows you to filter by a major version of your selected CDK Type: (${
            CDKTYPE_NAME_MAP[cdkType!]
          })`}
          name="CDK Major Version"
          onValueChange={onCdkMajorChange}
          options={majorsOptions}
          values={cdkMajor ? [cdkMajor.toString()] : []}
        />
      )}
    </>
  );
};
