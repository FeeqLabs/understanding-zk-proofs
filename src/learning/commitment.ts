import { F, FieldElement } from "./field";

const G = F(11);
const H = F(31);

export class Commitment {
  value: FieldElement;
  blind: FieldElement;
  commitment: FieldElement;

  constructor(value: FieldElement, blind: FieldElement) {
    this.value = value;
    this.blind = blind;

    this.commitment = value.mul(G).add(blind.mul(H));
  }

  toString(): string {
    return this.commitment.toString();
  }
}