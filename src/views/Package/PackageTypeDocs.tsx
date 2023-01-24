import { Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { PackageDocsError } from "./PackageDocsError";
import { usePackageState } from "./PackageState";
import { Markdown } from "../../components/Markdown";

const usePackageTypeDocs = () => {
  const { typeId }: { typeId?: string } = useParams();
  const { apiReference } = usePackageState();

  if (typeId) {
    return apiReference?.[typeId];
  }
  return;
};

export const PackageTypeDocs: FunctionComponent<{ rootId: string }> = ({
  rootId,
}) => {
  const { pathname, hash, search } = useLocation();
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
  const url = `${pathname}${search}#${hash}`;
  return (
    <>
      <Heading as="h2" p={8} size="2xl">
        <NavLink id={rootId} to={url}>
          {title}
        </NavLink>
      </Heading>
      <Markdown repository={assembly.repository}>{content}</Markdown>
    </>
  );
};
