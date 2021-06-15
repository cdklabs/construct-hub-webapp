import * as reflect from "jsii-reflect";

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
  /**
   * Simple name of the type.
   */
  readonly name: string;
}

/**
 * Options for how to render a string representation of a type reference.
 */
export interface TranspiledTypeReferenceToStringOptions {
  /**
   * Type formatter.
   */
  typeFormatter?: (t: TranspiledType) => string;
  /**
   * String formatter.
   */
  stringFormatter?: (formatter: string) => string;
}

/**
 * Outcome of transpiling a jsii type reference.
 */
export class TranspiledTypeReference {
  /**
   * Create a type reference that reprensents a primitive.
   */
  public static primitive(
    transpile: Transpile,
    ref: reflect.TypeReference,
    primitive: string
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(transpile, ref, primitive);
  }
  /**
   * Create a type reference that represents any type.
   */
  public static any(
    transpile: Transpile,
    ref: reflect.TypeReference
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(transpile, ref, undefined, true);
  }
  /**
   * Create a type reference that reprenets a concrete type.
   */
  public static type(
    transpile: Transpile,
    ref: reflect.TypeReference,
    type: TranspiledType
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(
      transpile,
      ref,
      undefined,
      undefined,
      type
    );
  }
  /**
   * Create a type reference that reprenets an array of a type reference.
   */
  public static arrayOfType(
    transpile: Transpile,
    ref: reflect.TypeReference,
    tf: TranspiledTypeReference
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(
      transpile,
      ref,
      undefined,
      undefined,
      undefined,
      tf
    );
  }
  /**
   * Create a type reference that reprenets a map of a type reference.
   */
  public static mapOfType(
    transpile: Transpile,
    ref: reflect.TypeReference,
    tf: TranspiledTypeReference
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(
      transpile,
      ref,
      undefined,
      undefined,
      undefined,
      undefined,
      tf
    );
  }
  /**
   * Create a type reference that reprenets a union of a type references.
   */
  public static unionOfTypes(
    transpile: Transpile,
    ref: reflect.TypeReference,
    tfs: TranspiledTypeReference[]
  ): TranspiledTypeReference {
    return new TranspiledTypeReference(
      transpile,
      ref,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      tfs
    );
  }

  private constructor(
    /**
     * A transpiler
     */
    private readonly transpile: Transpile,
    /**
     * The original type reference.
     */
    private readonly ref: reflect.TypeReference,
    /**
     * Primitive type ref.
     */
    private readonly primitive?: string,
    /**
     * 'Any' type ref
     */
    private readonly isAny?: boolean,
    /**
     * Concrete type.
     */
    private readonly type?: TranspiledType,
    /**
     * Array of ref.
     */
    private readonly arrayOfType?: TranspiledTypeReference,
    /**
     * Map of ref.
     */
    private readonly mapOfType?: TranspiledTypeReference,
    /**
     * Union of ref.
     */
    private readonly unionOfTypes?: TranspiledTypeReference[]
  ) {}

  public toString(options?: TranspiledTypeReferenceToStringOptions): string {
    const tFormatter = options?.typeFormatter ?? ((t) => t.fqn);
    const sFormatter = options?.stringFormatter ?? ((s) => s);
    if (this.primitive) {
      return sFormatter(this.primitive);
    }
    if (this.type) {
      return tFormatter(this.type);
    }
    if (this.isAny) {
      return sFormatter(this.transpile.any());
    }
    if (this.arrayOfType) {
      const ref = this.arrayOfType.toString(options);
      return this.transpile.listOf(ref);
    }
    if (this.mapOfType) {
      const ref = this.mapOfType.toString(options);
      return this.transpile.mapOf(ref);
    }
    if (this.unionOfTypes) {
      const refs = this.unionOfTypes.map((t) => t.toString(options));
      return this.transpile.unionOf(refs);
    }
    throw new Error(`Invalid type reference: ${this.ref.toString()}`);
  }
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
   * How a union looks like in the target language.
   */
  unionOf(types: string[]): string;

  /**
   * How a list looks like in the target language.
   */
  listOf(type: string): string;

  /**
   * How a map looks like in the target language.
   */
  mapOf(type: string): string;

  /**
   * How the 'any' type is represented in the target language.
   */
  any(): string;

  /**
   * How the 'string' type is represented in the target language.
   */
  str(): string;

  /**
   * How the 'number' type is represented in the target language.
   */
  number(): string;

  /**
   * How the 'boolean' type is represented in the target language.
   */
  boolean(): string;

  /**
   * How the 'json' type is represented in the target language.
   */
  json(): string;

  /**
   * How the 'date' type is represented in the target language.
   */
  date(): string;

  /**
   * How a readme is displayed in the target language.
   */
  readme(readme: string): string;
}

// interface merging so we don't have to implement these methods
// in the abstract class.
export interface TranspileBase extends Transpile {}

/**
 * Common functionality between different transpilers.
 */
export abstract class TranspileBase implements Transpile {
  constructor(public readonly language: string) {}

  public typeReference(ref: reflect.TypeReference): TranspiledTypeReference {
    if (ref.type) {
      const transpiled = this.type(ref.type);
      return TranspiledTypeReference.type(this, ref, transpiled);
    }

    if (ref.unionOfTypes) {
      const transpiled = ref.unionOfTypes.map((t) => this.typeReference(t));
      return TranspiledTypeReference.unionOfTypes(this, ref, transpiled);
    }

    if (ref.arrayOfType) {
      const transpiled = this.typeReference(ref.arrayOfType);
      return TranspiledTypeReference.arrayOfType(this, ref, transpiled);
    }

    if (ref.mapOfType) {
      const transpiled = this.typeReference(ref.mapOfType);
      return TranspiledTypeReference.mapOfType(this, ref, transpiled);
    }

    if (ref.isAny) {
      return TranspiledTypeReference.any(this, ref);
    }

    if (ref.primitive) {
      let transpiled;
      switch (ref.primitive) {
        case "string":
          transpiled = this.str();
          break;
        case "boolean":
          transpiled = this.boolean();
          break;
        case "number":
          transpiled = this.number();
          break;
        case "date":
          transpiled = this.date();
          break;
        case "json":
          transpiled = this.json();
          break;
        default:
          throw new Error(`Unsupported primitive type '${ref.primitive}'`);
      }
      return TranspiledTypeReference.primitive(this, ref, transpiled);
    }

    throw new Error(`Unsupported type: ${ref.toString()}`);
  }
}
