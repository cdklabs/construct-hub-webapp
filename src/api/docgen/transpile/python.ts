import { toSnakeCase } from "codemaker";
import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
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
    const typing = this.typing("Union");
    return {
      raw: `${typing}[${refs.map((r) => r.raw).join(", ")}]`,
      markdown: `${Markdown.bold(typing)}[${refs
        .map((r) => r.markdown)
        .join(", ")}]`,
    };
  }

  public listOfType(
    ref: transpile.TranspiledTypeReference
  ): transpile.TranspiledTypeReference {
    const typing = this.typing("List");
    return {
      raw: `${typing}[${ref.raw}]`,
      markdown: `${Markdown.bold(typing)}[${ref.markdown}]`,
    };
  }

  public mapOfType(
    ref: transpile.TranspiledTypeReference
  ): transpile.TranspiledTypeReference {
    const typing = this.typing("Mapping");
    return {
      raw: `${typing}[#${ref.raw}]`,
      markdown: `${Markdown.bold(this.typing("Mapping"))}[${ref.markdown}]`,
    };
  }

  public any(): transpile.TranspiledTypeReference {
    const typing = this.typing("Any");
    return { raw: typing, markdown: Markdown.code(typing) };
  }

  public boolean(): transpile.TranspiledTypeReference {
    const typing = this.builtins("bool");
    return { raw: typing, markdown: Markdown.code(typing) };
  }

  public str(): transpile.TranspiledTypeReference {
    const typing = this.builtins("str");
    return { raw: typing, markdown: Markdown.code(typing) };
  }

  public number(): transpile.TranspiledTypeReference {
    const types = ["int", "float"];
    const typing = this.typing("Union");
    return {
      raw: `${typing}[${types.join(", ")}]`,
      markdown: `${Markdown.bold(this.typing("Union"))}[${types
        .map((t) => Markdown.code(t))
        .join(", ")}]`,
    };
  }

  public date(): transpile.TranspiledTypeReference {
    const d = "datetime.datetime";
    return { raw: d, markdown: Markdown.code(d) };
  }

  public enum(enu: reflect.EnumType): transpile.TranspiledEnum {
    return {
      name: enu.name,
      members: enu.members.map((e) => e.name),
    };
  }

  public json(): transpile.TranspiledTypeReference {
    const a = "any";
    return { raw: a, markdown: Markdown.code(a) };
  }

  public property(property: reflect.Property): transpile.TranspiledProperty {
    return {
      name: property.const ? property.name : toSnakeCase(property.name),
      typeReference: this.typeReference(property.type),
      optional: property.optional,
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

  public struct(struct: reflect.InterfaceType): transpile.TranspiledStruct {
    const requirement = `import ${this.moduleFqn(struct.fqn)}`;
    const transpiledType = this.type(struct);

    const types = [];

    for (const property of struct.allProperties) {
      const transpiledProperty = this.property(property);
      types.push(
        `${transpiledProperty.name}: ${transpiledProperty.typeReference.raw}${
          transpiledProperty.optional ? " = None" : ""
        }`
      );
    }

    const invocation = `${transpiledType.fqn}(${types.join(
      `, \n${" ".repeat(1 + transpiledType.fqn.length)}`
    )})`;
    return {
      requirement,
      invocation,
    };
  }

  public callable(callable: reflect.Callable): transpile.TranspiledCallable {
    const requirement = `import ${this.moduleFqn(callable.parentType.fqn)}`;

    const parameters = new Array<reflect.Parameter>();

    for (const p of callable.parameters.sort(this.optionalityCompare)) {
      if (this.isStruct(p)) {
        // struct parameters are expanded to the individual struct properties
        const struct = p.parentType.system.findInterface(p.type.fqn!);
        for (const property of struct.allProperties) {
          const parameter = propertyToParameter(callable, property);
          parameters.push(parameter);
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
      const transpiled = this.parameter(parameter);
      types.push(
        `${transpiled.name}: ${transpiled.typeReference.raw}${
          transpiled.optional ? " = None" : ""
        }`
      );
    }

    const signature = `def ${name}(${types.join(
      `, \n${" ".repeat(3 + 1 + 1 + name.length)}`
    )})`;

    const invocationTarget = `${transpiledType.fqn}${
      name === "<initializer>" ? "" : `.${name}`
    }`;
    const invocation = `${invocationTarget}(${types.join(
      `, \n${" ".repeat(1 + invocationTarget.length)}`
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
    const module = this.moduleFqn(type.fqn);

    const fqn = [module];

    if (type.namespace) {
      fqn.push(type.namespace);
    }

    fqn.push(type.name);

    return { fqn: fqn.join(".") };
  }

  private moduleFqn(fqn: string): string {
    const type = this.ts.findFqn(fqn);
    const submodule = this.findSubmodule(type);

    const targets = submodule ? submodule.targets : type.assembly.targets;

    if (!targets) {
      throw new Error(`Unable to find 'targets' for fqn ${type.fqn}`);
    }

    if (!targets.python) {
      throw new Error(`Python is not a supported target for fqn ${type.fqn}`);
    }

    return targets.python.module;
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

  private typing(type: "List" | "Mapping" | "Any" | "Union"): string {
    return `typing.${type}`;
  }

  private builtins(type: "bool" | "str") {
    return `builtins.${type}`;
  }
}

export function propertyToParameter(
  callable: reflect.Callable,
  property: reflect.Property
): reflect.Parameter {
  return {
    docs: property.docs,
    method: callable,
    name: property.name,
    optional: property.optional,
    parentType: property.parentType,
    spec: property.spec,
    system: property.system,
    type: property.type,
    variadic: false,
  };
}
