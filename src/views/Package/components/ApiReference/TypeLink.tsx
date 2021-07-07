import { Code } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { TypeJson } from "../../../../api/docgen/api-reference";
import { FqnLink } from "../../../../components/FqnLink";

interface TypeLinkProps extends TypeJson {}

export const TypeLink: FunctionComponent<TypeLinkProps> = ({
  fqn,
  name,
  types,
}) => {
  let body: string | ReactNode[] = name;

  if (types?.length) {
    let newBody: ReactNode[] = name.split(/(\%)/);
    types.map((t) => {
      const i = newBody.indexOf("%");
      newBody[i] = <TypeLink key={t.name} {...t} />;
    });
    body = newBody;
  }

  return fqn ? (
    <FqnLink fqn={fqn}>
      <Code p={2}>{body}</Code>
    </FqnLink>
  ) : (
    <Code p={2}>{body}</Code>
  );
};
