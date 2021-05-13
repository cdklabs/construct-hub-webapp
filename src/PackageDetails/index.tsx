interface PackageDetailsProps {
  name: string;
  scope?: string;
  version: string;
}

export default function PackageDetails({
  name,
  scope,
  version,
}: PackageDetailsProps) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Scope: {scope ?? "none"}</p>
      <p>Version: {version}</p>
    </div>
  );
}
