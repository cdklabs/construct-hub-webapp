import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";

/**
 * Outcome of transpiling a jsii struct.
 */
export interface TranspiledStruct {
  /**
   * The (transpiled) type.
   */
  readonly type: TranspiledType;
  /**
   * The name.
   */
  readonly name: string;
  /**
   * The import statement needed in order to use this struct.
   */
  readonly import: string;
  /**
   * How to initialize this struct.
   */
  readonly initialization: string;
}

/**
 * Outcome of transpiling a jsii class.
 */
export interface TranspiledClass {
  /**
   * The (transpiled) type.
   */
  readonly type: TranspiledType;
  /**
   * The name.
   */
  readonly name: string;
}

/**
 * Outcome of transpiling a jsii callable.
 */
export interface TranspiledCallable {
  /**
   * The (transpiled) parent type.
   */
  readonly parentType: TranspiledType;
  /**
   * How a signature of the callable looks like.
   */
  readonly signature: string;
  /**
   * The name.
   */
  readonly name: string;
  /**
   * The import statement needed in order to use this callable.
   */
  readonly import: string;
  /**
   * How an invocation of this callable looks like.
   */
  readonly invocation: string;
  /**
   * The jsii parameters this callable accepts.
   */
  readonly parameters: reflect.Parameter[];
}

/**
 * Outcome of transpiling a jsii parameter.
 */
export interface TranspiledParameter {
  /**
   * The name.
   */
  readonly name: string;
  /**
   * The (transpiled) parent type.
   */
  readonly parentType: TranspiledType;
  /**
   * The (transpiled) type reference.
   */
  readonly typeReference: TranspiledTypeReference;
  /**
   * Whether or not the parameter is optional.
   */
  readonly optional: boolean;
}

/**
 * Outcome of transpiling a jsii interface (not data type).
 */
export interface TranspiledInterface {
  /**
   * The (transpiled) type.
   */
  readonly type: TranspiledType;
  /**
   * The name.
   */
  readonly name: string;
}

/**
 * Outcome of transpiling a generic jsii type.
 */
export interface TranspiledType {
  /**
   * The language specific fqn.
   */
  readonly fqn: string;
  /**
   * The language specific module fqn (mode + submodule).
   */
  readonly moduleFqn: string;
}

/**
 * Outcome of transpiling a jsii type reference.
 */
export interface TranspiledTypeReference {
  /**
   * Markdown formatted representation.
   */
  readonly markdown: string;
  /**
   * The raw representation. Needed since type references are rendered
   * inside code blocks, which don't support markdown formatting.
   */
  readonly raw: string;
}

/**
 * Outcome of transpiling a jsii property.
 */
export type TranspiledProperty = TranspiledParameter;

/**
 * Outcome of transpiling a jsii enum.
 */
export interface TranspiledEnum {
  /**
   * The language specific fqn.
   */
  readonly fqn: string;
  /**
   * The name.
   */
  readonly name: string;
}

/**
 * Outcome of transpiling a specific enum member.
 */
export interface TranspiledEnumMember {
  /**
   * The language specific fqn.
   */
  readonly fqn: string;
  /**
   * The name.
   */
  readonly name: string;
}

/**
 * Language transpiling for jsii types.
 */
export interface Transpile {
  /**
   * The language of the tranpiler.
   */
  language: string;

  /**
   * Transpile a callable (method, static function, initializer)
   */
  callable(callable: reflect.Callable): TranspiledCallable;

  /**
   * Transpile a class.
   */
  class(klass: reflect.ClassType): TranspiledClass;

  /**
   * Transpile a struct (data type interface).
   */
  struct(struct: reflect.InterfaceType): TranspiledStruct;

  /**
   * Transpile an interface (non data type).
   */
  interface(iface: reflect.InterfaceType): TranspiledInterface;

  /**
   * Transpile a parameter.
   */
  parameter(parameter: reflect.Parameter): TranspiledParameter;

  /**
   * Transpile a property.
   */
  property(property: reflect.Property): TranspiledProperty;

  /**
   * Transpile an enum.
   */
  enum(enu: reflect.EnumType): TranspiledEnum;

  /**
   * Transpile an enum member.
   */
  enumMember(em: reflect.EnumMember): TranspiledEnumMember;

  /**
   * Transpile a type.
   */
  type(type: reflect.Type): TranspiledType;

  /**
   * Transpile (recursively) a type reference.
   */
  typeReference(typeReference: reflect.TypeReference): TranspiledTypeReference;

  /**
   * How a union of types looks like in the target language.
   */
  unionOfTypes(refs: TranspiledTypeReference[]): TranspiledTypeReference;

  /**
   * How a list of types looks like in the target language.
   */
  listOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  /**
   * How a map of types looks like in the target language.
   */
  mapOfType(ref: TranspiledTypeReference): TranspiledTypeReference;

  /**
   * How the 'any' type is represented in the target language.
   */
  any(): TranspiledTypeReference;

  /**
   * How the 'string' type is represented in the target language.
   */
  str(): TranspiledTypeReference;

  /**
   * How the 'number' type is represented in the target language.
   */
  number(): TranspiledTypeReference;

  /**
   * How the 'boolean' type is represented in the target language.
   */
  boolean(): TranspiledTypeReference;

  /**
   * How the 'json' type is represented in the target language.
   */
  json(): TranspiledTypeReference;

  /**
   * How the 'date' type is represented in the target language.
   */
  date(): TranspiledTypeReference;

  /**
   * How a readme is displayed in the target language.
   */
  readme(readme: string): string;
}

// interface merging so we don't have to implement these methods
// in the abstract class.
export interface AbstractTranspile extends Transpile {}

/**
 * Common functionality between different transpilers.
 */
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
