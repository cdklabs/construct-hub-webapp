export type Language = "dotnet" | "js" | "ts" | "python" | "golang" | "java";

export enum Languages {
  DotNet = "dotnet",
  NodeJS = "js",
  TypeScript = "ts",
  Python = "python",
  Go = "golang",
  Java = "java",
}

export const LANGUAGE_NAME_MAP: { [key in Languages]: string } = {
  [Languages.TypeScript]: "TypeScript",
  [Languages.Python]: "Python",
  [Languages.Java]: "Java",
  [Languages.NodeJS]: "Node.js",
  [Languages.Go]: "Go",
  [Languages.DotNet]: ".NET",
};

export const LANGUAGES: Language[] = [
  Languages.TypeScript,
  Languages.Python,
  Languages.Java,
  Languages.NodeJS,
  Languages.Go,
  Languages.DotNet,
];

export const TEMP_SUPPORTED_LANGUAGES: Language[] = [
  Languages.Python,
  Languages.TypeScript,
];
