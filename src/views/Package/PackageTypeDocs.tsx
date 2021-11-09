import { Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Markdown } from "../../components/Markdown";
import { PackageDocsError } from "./PackageDocsError";
import { usePackageState } from "./PackageState";

const usePackageTypeDocs = () => {
  const { typeId }: { typeId?: string } = useParams();
  const { apiReference } = usePackageState();

  if (typeId) {
    return apiReference?.[typeId];
  }
  return;
};

export const PackageTypeDocs: FunctionComponent = () => {
  const {
    isLoadingDocs,
    assembly: { data: assembly },
  } = usePackageState();
  const docs = usePackageTypeDocs();

  if (isLoadingDocs) {
    return null;
  } else if (!docs || !assembly) {
    return <PackageDocsError />;
  }
  const { title, content } = docs;

  return (
    <>
      <Heading as="h2" p={8} size="2xl">
        {title}
      </Heading>
      <Markdown repository={assembly.repository}>{content}</Markdown>
    </>
  );
};
