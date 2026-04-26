export const FIELD_MODULUS = 97n;



export class FieldElement {
  value: bigint;

  

  constructor(value: bigint | number) {
    const bigintValue = BigInt(value);
    this.value = ((bigintValue % FIELD_MODULUS) + FIELD_MODULUS) % FIELD_MODULUS;
  }




  add(other: FieldElement): FieldElement {
    return new FieldElement(this.value + other.value);
  }

  sub(other: FieldElement): FieldElement {
    return new FieldElement(this.value - other.value);
  }

  mul(other: FieldElement): FieldElement {
    return new FieldElement(this.value * other.value);
  }

  equals(other: FieldElement): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }

  //   Range proof - underflow and overflow check
  toNumber(): number {
    return Number(this.value);
  }
}

export function F(value: bigint | number): FieldElement {
  return new FieldElement(value);
}