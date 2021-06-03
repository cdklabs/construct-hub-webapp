/**
 * The PackageDetails component renders the header section of a package. This includes
 * the Getting Started, Operator Area, and Publisher Details sections
 */
import type { Assembly } from "jsii-reflect";
import { GettingStarted } from "../GettingStarted";
import { OperatorArea } from "../OperatorArea";

interface PackageDetailsProps {
  assembly?: Assembly;
}

export function PackageDetails({ assembly }: PackageDetailsProps) {
  if (!assembly) return null;

  const targets: string[] = Object.keys(assembly.targets ?? {});

  return (
    <div>
      Package Details
      <OperatorArea />
      <GettingStarted targets={targets} />
    </div>
  );
}
