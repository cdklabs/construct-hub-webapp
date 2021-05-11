import { useParams } from "react-router-dom";
import PackageDetails from "../PackageDetails";

interface PathParams {
  fqn: string;
}

interface TypeDocsProps {
  name: string;
  scope?: string;
  version: string;
}

export default function TypeDocs(props: TypeDocsProps) {
  const { fqn }: PathParams = useParams();
  return (
    <>
      <h1>{fqn} Docs</h1>
      <PackageDetails {...props} />
    </>
  );
}
