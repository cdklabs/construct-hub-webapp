import * as reflect from "jsii-reflect";

export interface TranspiledCallable {
  readonly signature: string;
  readonly name: string;
  readonly requirement: string;
  readonly invocation: string;
  readonly parameters: reflect.Parameter[];
}

export interface TranspiledParameter {
  readonly name: string;
  readonly typeReference: TranspiledTypeReference;
  readonly optional: boolean;
}

export interface TranspiledType {
  readonly fqn: string;
}

export interface TranspiledTypeReference {
  readonly raw: string;
  readonly linked: string;
}

export interface Transpile {
  language: string;

  callable(callable: reflect.Callable): TranspiledCallable;

  parameter(parameter: reflect.Parameter, code: boolean): TranspiledParameter;

  type(type: reflect.Type): TranspiledType;

  typeReference(typeReference: reflect.TypeReference): TranspiledTypeReference;

  unionOfTypes(refs: TranspiledTypeReference[]): TranspiledTypeReference;

  listOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  mapOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  any(): TranspiledTypeReference;

  str(): TranspiledTypeReference;

  number(): TranspiledTypeReference;

  boolean(): TranspiledTypeReference;

  moduleFqn(moduleFqn: string): string;

  readme(readme: string): string;
}

export abstract class AbstractTranspile implements Transpile {
  constructor(public readonly language: string) {}

  public typeReference(type: reflect.TypeReference): TranspiledTypeReference {
    if (type.fqn && type.type) {
      const raw = this.type(type.type).fqn;
      return { raw: raw, linked: `[\`${raw}\`](#${type.fqn})` };
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
        default:
          throw new Error(`Unsupported primitive type '${type.primitive}'`);
      }
    }

    throw new Error(`Unsupported type: ${type.toString()}`);
  }
}

// https://github.com/microsoft/TypeScript/issues/22815#issuecomment-375766197
export interface AbstractTranspile extends Transpile {}
