import { FieldElement, F } from "./field";

export type RangeProof = {
  value: FieldElement;
  bits: number[];
};

export function createRangeProof(value: FieldElement, bitLength: number): RangeProof {
  const numberValue = value.toNumber();

  const bits: number[] = [];

  for (let i = 0; i < bitLength; i++) {
    bits.push((numberValue >> i) & 1);
  }

  return {
    value,
    bits,
  };
}

export function verifyRangeProof(proof: RangeProof): boolean {
  let reconstructed = F(0);

  for (let i = 0; i < proof.bits.length; i++) {
    const bit = proof.bits[i];

    if (bit !== 0 && bit !== 1) {
      return false;
    }

    if (bit === 1) {
      reconstructed = reconstructed.add(F(2 ** i));
    }
  }

  return reconstructed.equals(proof.value);
}