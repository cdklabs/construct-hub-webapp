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
    return { raw: typing, markdown: Markdown.pre(typing) };
  }

  public boolean(): transpile.TranspiledTypeReference {
    const typing = this.builtins("bool");
    return { raw: typing, markdown: Markdown.pre(typing) };
  }

  public str(): transpile.TranspiledTypeReference {
    const typing = this.builtins("str");
    return { raw: typing, markdown: Markdown.pre(typing) };
  }

  public number(): transpile.TranspiledTypeReference {
    const types = ["int", "float"];
    const typing = this.typing("Union");
    return {
      raw: `${typing}[${types.join(", ")}]`,
      markdown: `${Markdown.bold(this.typing("Union"))}[${types
        .map((t) => Markdown.pre(t))
        .join(", ")}]`,
    };
  }

  public date(): transpile.TranspiledTypeReference {
    const d = "datetime.datetime";
    return { raw: d, markdown: Markdown.pre(d) };
  }

  public enum(enu: reflect.EnumType): transpile.TranspiledEnum {
    return {
      fqn: this.type(enu).fqn,
      name: enu.name,
      members: enu.members.map((e) => e.name),
    };
  }

  public enumMember(em: reflect.EnumMember): transpile.TranspiledEnumMember {
    return {
      fqn: `${this.enum(em.enumType).fqn}.${em.name}`,
      name: em.name,
    };
  }
  public json(): transpile.TranspiledTypeReference {
    const a = "any";
    return { raw: a, markdown: Markdown.pre(a) };
  }

  public property(property: reflect.Property): transpile.TranspiledProperty {
    return {
      name: property.const ? property.name : toSnakeCase(property.name),
      parentType: this.type(property.parentType),
      typeReference: this.typeReference(property.type),
      optional: property.optional,
    };
  }

  public class(klass: reflect.ClassType): transpile.TranspiledClass {
    return {
      name: toSnakeCase(klass.name),
      type: this.type(klass),
    };
  }

  public parameter(
    parameter: reflect.Parameter
  ): transpile.TranspiledParameter {
    return {
      name: toSnakeCase(parameter.name),
      parentType: this.type(parameter.parentType),
      typeReference: this.typeReference(parameter.type),
      optional: parameter.optional,
    };
  }

  public struct(struct: reflect.InterfaceType): transpile.TranspiledStruct {
    const type = this.type(struct);
    const inputs = struct.allProperties.map((p) =>
      formatInput(this.property(p))
    );
    return {
      type: type,
      name: struct.name,
      requirement: formatRequirement(type),
      invocation: formatInvocation(type, inputs),
    };
  }

  public callable(callable: reflect.Callable): transpile.TranspiledCallable {
    const type = this.type(callable.parentType);

    const parameters = new Array<reflect.Parameter>();

    for (const p of callable.parameters.sort(this.optionalityCompare)) {
      if (!this.isStruct(p)) {
        parameters.push(p);
      } else {
        // struct parameters are expanded to the individual struct properties
        const struct = p.parentType.system.findInterface(p.type.fqn!);
        for (const property of struct.allProperties) {
          const parameter = propertyToParameter(callable, property);
          parameters.push(parameter);
        }
      }
    }

    const name = toSnakeCase(callable.name);
    const inputs = parameters.map((p) => formatInput(this.parameter(p)));

    return {
      name,
      parentType: type,
      requirement: formatRequirement(type),
      parameters,
      signature: formatSignature(name, inputs),
      invocation: formatInvocation(
        type,
        inputs,
        callable.kind === reflect.MemberKind.Initializer ? undefined : name
      ),
    };
  }

  public interface(
    iface: reflect.InterfaceType
  ): transpile.TranspiledInterface {
    return {
      name: iface.name,
      type: this.type(iface),
    };
  }

  public type(type: reflect.Type): transpile.TranspiledType {
    const module = this.moduleFqn(type.fqn);

    const fqn = [module];

    if (type.namespace) {
      fqn.push(type.namespace);
    }

    fqn.push(type.name);

    return { fqn: fqn.join("."), moduleFqn: module };
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

function formatInput(
  transpiled: transpile.TranspiledParameter | transpile.TranspiledProperty
): string {
  return `${transpiled.name}: ${transpiled.typeReference.raw}${
    transpiled.optional ? " = None" : ""
  }`;
}

function formatInvocation(
  type: transpile.TranspiledType,
  inputs: string[],
  method?: string
) {
  let target = type.fqn;
  if (method) {
    target = `${target}.${method}`;
  }
  return `${target}(${formatInputs(inputs, 1 + target.length)})`;
}

function formatRequirement(type: transpile.TranspiledType) {
  return `import ${type.moduleFqn}`;
}

function formatSignature(name: string, inputs: string[]) {
  return `def ${name}(${formatInputs(inputs, 3 + 1 + 1 + name.length)})`;
}

function formatInputs(inputs: string[], indent: number) {
  return inputs.join(`, \n${" ".repeat(indent)}`);
}

function propertyToParameter(
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
