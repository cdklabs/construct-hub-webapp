import * as reflect from "jsii-reflect";
import * as transpile from "./transpile";

/**
 * A TypeScript transpiler.
 */
export class TypeScriptTranspile extends transpile.TranspileBase {
  constructor(private readonly ts: reflect.TypeSystem) {
    super("typescript");
  }

  public readme(readme: string): string {
    return readme;
  }

  public unionOf(types: string[]): string {
    return `${types.join(" | ")}`;
  }

  public listOf(type: string): string {
    return `${type}[]`;
  }

  public mapOf(type: string): string {
    return `{[ key: string ]: ${type}}`;
  }

  public any(): string {
    return "any";
  }

  public boolean(): string {
    return "boolean";
  }

  public str(): string {
    return "string";
  }

  public number(): string {
    return `number`;
  }

  public date(): string {
    return "Date";
  }

  public json(): string {
    return "object";
  }

  public enum(enu: reflect.EnumType): transpile.TranspiledEnum {
    return {
      fqn: this.type(enu).fqn,
      name: enu.name,
    };
  }

  public enumMember(em: reflect.EnumMember): transpile.TranspiledEnumMember {
    return {
      fqn: `${this.enum(em.enumType).fqn}.${em.name}`,
      name: em.name,
    };
  }

  public property(property: reflect.Property): transpile.TranspiledProperty {
    return {
      name: property.name,
      parentType: this.type(property.parentType),
      typeReference: this.typeReference(property.type),
      optional: property.optional,
    };
  }

  public class(klass: reflect.ClassType): transpile.TranspiledClass {
    return {
      name: klass.name,
      type: this.type(klass),
    };
  }

  public parameter(
    parameter: reflect.Parameter
  ): transpile.TranspiledParameter {
    return {
      name: parameter.name,
      parentType: this.type(parameter.parentType),
      typeReference: this.typeReference(parameter.type),
      optional: parameter.optional,
    };
  }

  public struct(struct: reflect.InterfaceType): transpile.TranspiledStruct {
    const type = this.type(struct);
    const inputs = struct.allProperties.map((p) =>
      this.formatInput(this.property(p))
    );
    return {
      type: type,
      name: struct.name,
      import: formatImport(type),
      initialization: formatInitialization(type, inputs),
    };
  }

  public callable(callable: reflect.Callable): transpile.TranspiledCallable {
    const type = this.type(callable.parentType);
    const parameters = callable.parameters.sort(this.optionalityCompare);
    const name = callable.name;
    const inputs = parameters.map((p) => this.formatInput(this.parameter(p)));

    const invocation =
      callable.kind === reflect.MemberKind.Initializer
        ? formatInitialization(type, inputs)
        : formatInvocation(type, inputs, name);

    return {
      name,
      parentType: type,
      import: formatImport(type),
      parameters,
      signature: formatSignature(name, inputs),
      invocation,
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

  // TODO this method is a mess, refactor at some point...
  public type(type: reflect.Type): transpile.TranspiledType {
    const t = this.ts.findFqn(type.fqn);
    const submodule = this.findSubmodule(t);
    const moduleFqn = submodule ? submodule.fqn : t.assembly.name;
    const submoduleName = submodule?.name;
    const moduleName = t.assembly.name;

    const fqn = [moduleName];

    if (type.namespace) {
      fqn.push(type.namespace);
    }

    fqn.push(type.name);

    return {
      fqn: fqn.join("."),
      moduleFqn,
      name: type.name,
      module: moduleName,
      submodule: submoduleName,
    };
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

  private formatInput(
    transpiled: transpile.TranspiledParameter | transpile.TranspiledProperty
  ): string {
    const tf = transpiled.typeReference.toString({
      typeFormatter: (t) => t.name,
    });
    return `${transpiled.name}${transpiled.optional ? "?" : ""}: ${tf}`;
  }
}

function formatInitialization(
  type: transpile.TranspiledType,
  inputs: string[]
) {
  const target = type.submodule ? `${type.submodule}.${type.name}` : type.name;
  return `new ${target}(${formatInputs(inputs)})`;
}

function formatInvocation(
  type: transpile.TranspiledType,
  inputs: string[],
  method: string
) {
  const target = type.submodule ? `${type.submodule}.${type.name}` : type.name;
  return `${target}.${method}(${formatInputs(inputs)})`;
}

function formatImport(type: transpile.TranspiledType) {
  if (type.submodule) {
    return `import { ${type.submodule} } from '${type.module}'`;
  } else {
    return `import { ${type.name} } from '${type.module}'`;
  }
}

function formatSignature(name: string, inputs: string[]) {
  return `public ${name}(${formatInputs(inputs)})`;
}

function formatInputs(inputs: string[]) {
  return inputs.join(", ");
}
