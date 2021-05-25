import * as spec from "@jsii/spec";
import { toSnakeCase } from "codemaker";
import * as reflect from "jsii-reflect";
import { propertyToParameter } from "../helpers";
import * as transpile from "./transpile";

export class PythonTranspile extends transpile.AbstractTranspile {
  constructor(private readonly ts: reflect.TypeSystem) {
    super("python");
  }

  public readme(readme: string): string {
    return readme;
  }

  public unionOfTypes(
    refs: transpile.TranspiledTypeReference[]
  ): transpile.TranspiledTypeReference {
    return {
      raw: `${this.typing("Union")}[${refs.map((r) => r.raw).join(", ")}]`,
      linked: `${this.typing("Union")}[${refs
        .map((r) => r.linked)
        .join(", ")}]`,
    };
  }

  public listOfType(
    ref: transpile.TranspiledTypeReference
  ): transpile.TranspiledTypeReference {
    return {
      raw: `${this.typing("List")}[${ref.raw}]`,
      linked: `${this.typing("List")}[${ref.linked}]`,
    };
  }

  public mapOfType(
    ref: transpile.TranspiledTypeReference
  ): transpile.TranspiledTypeReference {
    return {
      raw: `${this.typing("Mapping")}[#${ref.raw}]`,
      linked: `${this.typing("Mapping")}[${ref.linked}]`,
    };
  }

  public any(): transpile.TranspiledTypeReference {
    return {
      raw: this.typing("Any"),
      linked: `\`${this.typing("Any")}\``,
    };
  }

  public boolean(): transpile.TranspiledTypeReference {
    return {
      raw: this.builtins("bool"),
      linked: `\`${this.builtins("bool")}\``,
    };
  }

  public str(): transpile.TranspiledTypeReference {
    return {
      raw: this.builtins("str"),
      linked: `\`${this.builtins("str")}\``,
    };
  }

  public number(): transpile.TranspiledTypeReference {
    return {
      raw: `${this.typing("Union")}[int, float]`,
      linked: `${this.typing("Union")}[\`int\`, \`float\`]`,
    };
  }

  public parameter(
    parameter: reflect.Parameter
  ): transpile.TranspiledParameter {
    return {
      name: toSnakeCase(parameter.name),
      typeReference: this.typeReference(parameter.type),
      optional: parameter.optional,
    };
  }

  public callable(callable: reflect.Callable): transpile.TranspiledCallable {
    const requirement = `import ${this.moduleFqn(callable.parentType.fqn)}`;

    const parameters: reflect.Parameter[] = new Array<reflect.Parameter>();

    for (const p of callable.parameters.sort(this.optionalityCompare)) {
      if (this.isStruct(p)) {
        // struct parameters are expanded to the individual struct properties
        const struct = p.parentType.system.findInterface(p.type.fqn!);
        for (const property of struct.allProperties) {
          parameters.push(propertyToParameter(callable, property));
        }
      } else {
        // non struct parameters are kept as is
        parameters.push(p);
      }
    }

    const name = toSnakeCase(callable.name);
    const transpiledType = this.type(callable.parentType);
    const types = [];

    for (const parameter of parameters) {
      const transpiledParameter = this.parameter(parameter);
      types.push(
        `${transpiledParameter.name}: ${transpiledParameter.typeReference.raw}${
          transpiledParameter.optional ? " = None" : ""
        }`
      );
    }

    const signature = `def ${name}(${types.join(
      `, \n${" ".repeat(3 + 1 + 1 + name.length)}`
    )})`;

    const invocation = `${transpiledType.fqn}(${types.join(
      `, \n${" ".repeat(1 + transpiledType.fqn.length)}`
    )})`;

    return {
      requirement,
      parameters,
      name,
      signature,
      invocation,
    };
  }

  public type(type: reflect.Type): transpile.TranspiledType {
    const submodule = this.findSubmodule(type);
    const module = submodule
      ? this.extractPythonModule(submodule.targets!).split(".")[0]
      : this.extractPythonModule(type.assembly.targets!);

    return {
      fqn: [module, ...([type.namespace] ?? []), type.name].join("."),
    };
  }

  public moduleFqn(fqn: string): string {
    const type = this.ts.findFqn(fqn);
    const submodule = this.findSubmodule(type);

    if (submodule) {
      return this.extractPythonModule(submodule.targets!);
    }

    return this.extractPythonModule(type.assembly.targets!);
  }

  private optionalityCompare(
    p1: reflect.Parameter,
    p2: reflect.Parameter
  ): number {
    if (!p1.optional && p1.optional) {
      return -1;
    }
    if (!p2.optional && p1.optional) {
      return 1;
    }
    return 0;
  }

  private isStruct(p: reflect.Parameter): boolean {
    return p.type.fqn ? p.system.findFqn(p.type.fqn).isDataType() : false;
  }

  private findSubmodule(type: reflect.Type): reflect.Submodule | undefined {
    if (!type.namespace) {
      return undefined;
    }
    const submoduleFqn = `${type.assembly.name}.${
      type.namespace.split(".")[0]
    }`;
    const submodules = type.assembly.submodules.filter(
      (s) => s.fqn === submoduleFqn
    );

    if (submodules.length > 1) {
      // hmm...
      throw new Error(`Found multiple submodulues with fqn ${submoduleFqn}`);
    }

    if (submodules.length === 0) {
      return undefined;
    }

    return submodules[0];
  }

  private extractPythonModule(targets: spec.AssemblyTargets) {
    return targets.python!.module;
  }

  private typing(type: "List" | "Mapping" | "Any" | "Union"): string {
    return `typing.${type}`;
  }

  private builtins(type: "bool" | "str") {
    return `builtins.${type}`;
  }
}
