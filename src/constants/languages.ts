export type Language =
  | "dotnet"
  | "js"
  | "typescript"
  | "python"
  | "golang"
  | "java";

export enum Languages {
  DotNet = "dotnet",
  NodeJS = "js",
  TypeScript = "typescript",
  Python = "python",
  Go = "golang",
  Java = "java",
}

export const LANGUAGES: Language[] = [
  Languages.TypeScript,
  Languages.Python,
  Languages.Java,
  Languages.NodeJS,
  Languages.Go,
  Languages.DotNet,
];

export const TEMP_SUPPORTED_LANGUAGES: Language[] = [
  Languages.TypeScript,
  Languages.Python,
];
