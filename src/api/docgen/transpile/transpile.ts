import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";

export interface TranspiledStruct {
  readonly type: TranspiledType;
  readonly name: string;
  readonly requirement: string;
  readonly invocation: string;
}

export interface TranspiledClass {
  readonly type: TranspiledType;
  readonly name: string;
}

export interface TranspiledCallable {
  readonly parentType: TranspiledType;
  readonly signature: string;
  readonly name: string;
  readonly requirement: string;
  readonly invocation: string;
  readonly parameters: reflect.Parameter[];
}

export interface TranspiledParameter {
  readonly name: string;
  readonly parentType: TranspiledType;
  readonly typeReference: TranspiledTypeReference;
  readonly optional: boolean;
}

export interface TranspiledInterface {
  readonly type: TranspiledType;
  readonly name: string;
}

export interface TranspiledType {
  readonly fqn: string;
  readonly moduleFqn: string;
}

export interface TranspiledTypeReference {
  readonly raw: string;
  readonly markdown: string;
}

export interface TranspiledProperty {
  readonly name: string;
  readonly parentType: TranspiledType;
  readonly typeReference: TranspiledTypeReference;
  readonly optional: boolean;
}

export interface TranspiledEnum {
  readonly fqn: string;
  readonly name: string;
  readonly members: string[];
}

export interface TranspiledEnumMember {
  readonly fqn: string;
  readonly name: string;
}

export interface Transpile {
  language: string;

  callable(callable: reflect.Callable): TranspiledCallable;

  class(klass: reflect.ClassType): TranspiledClass;

  struct(struct: reflect.InterfaceType): TranspiledStruct;

  interface(iface: reflect.InterfaceType): TranspiledInterface;

  parameter(parameter: reflect.Parameter): TranspiledParameter;

  property(property: reflect.Property): TranspiledProperty;

  enum(enu: reflect.EnumType): TranspiledEnum;

  enumMember(em: reflect.EnumMember): TranspiledEnumMember;

  type(type: reflect.Type): TranspiledType;

  typeReference(typeReference: reflect.TypeReference): TranspiledTypeReference;

  unionOfTypes(refs: TranspiledTypeReference[]): TranspiledTypeReference;

  listOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  mapOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  any(): TranspiledTypeReference;

  str(): TranspiledTypeReference;

  number(): TranspiledTypeReference;

  boolean(): TranspiledTypeReference;

  json(): TranspiledTypeReference;

  date(): TranspiledTypeReference;

  readme(readme: string): string;
}

export interface AbstractTranspile extends Transpile {}

export abstract class AbstractTranspile implements Transpile {
  constructor(public readonly language: string) {}

  public typeReference(type: reflect.TypeReference): TranspiledTypeReference {
    if (type.fqn && type.type) {
      const transpiled = this.type(type.type);
      return {
        raw: transpiled.fqn,
        markdown: `[${Markdown.pre(transpiled.fqn)}](#${transpiled.fqn})`,
      };
    }

    if (type.unionOfTypes) {
      const types = type.unionOfTypes.map((t) => this.typeReference(t));
      return this.unionOfTypes(types);
    }

    if (type.arrayOfType) {
      const ref = this.typeReference(type.arrayOfType);
      return this.listOfType(ref);
    }

    if (type.mapOfType) {
      const ref = this.typeReference(type.mapOfType);
      return this.mapOfType(ref);
    }

    if (type.isAny) {
      return this.any();
    }

    if (type.primitive) {
      switch (type.primitive) {
        case "string":
          return this.str();
        case "boolean":
          return this.boolean();
        case "number":
          return this.number();
        case "date":
          return this.date();
        case "json":
          return this.json();
        default:
          throw new Error(`Unsupported primitive type '${type.primitive}'`);
      }
    }

    throw new Error(`Unsupported type: ${type.toString()}`);
  }
}
