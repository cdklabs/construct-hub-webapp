export type Language = "dotnet" | "js" | "ts" | "python" | "golang" | "java";

export enum Languages {
  DotNet = "dotnet",
  NodeJS = "js",
  TypeScript = "ts",
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
