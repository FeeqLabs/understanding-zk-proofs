import { FieldElement } from "./field";
import { Commitment } from "./commitment";

type Account = {
  name: string;
  balance: FieldElement;
  blind: FieldElement;
  commitment: Commitment;
};


function createAccount(
  name: string,
  balance: FieldElement,
  blind: FieldElement
): Account {
  return {
    name,
    balance,
    blind,
    commitment: new Commitment(balance, blind),
  };
}

function publicState(account: Account) {
  return {
    name: account.name,
    commitment: account.commitment.toString(),
  };
}

function privateState(account: Account) {
  return {
    name: account.name,
    balance: account.balance.toString(),
    blind: account.blind.toString(),
    commitment: account.commitment.toString(),
  };
}


export { Account, createAccount, publicState, privateState };