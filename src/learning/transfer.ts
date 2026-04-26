import { F, FieldElement } from "./field";
import { Account, createAccount } from "./account";
import { Commitment } from "./commitment";
import { createRangeProof, verifyRangeProof} from "./rangeProof";


export type TransferProof = {

   rangeProofs: {

    amount: RangeProof;

    newSenderBalance: RangeProof;

    };


  publicInputs: {
    oldSenderCommitment: string;
    newSenderCommitment: string;
    oldReceiverCommitment: string;
    newReceiverCommitment: string;
  };


  witness: {
    oldSenderBalance: FieldElement;
    newSenderBalance: FieldElement;
    oldReceiverBalance: FieldElement;
    newReceiverBalance: FieldElement;
    amount: FieldElement;

    oldSenderBlind: FieldElement;
    newSenderBlind: FieldElement;
    oldReceiverBlind: FieldElement;
    newReceiverBlind: FieldElement;
  };
};

export function createTransferProof(
  sender: Account,
  receiver: Account,
  amount: FieldElement,
  newSenderBlind: FieldElement,
  newReceiverBlind: FieldElement
): {
  proof: TransferProof;
  newSender: Account;
  newReceiver: Account;
} {


  const newSenderBalance = sender.balance.sub(amount);
  const newReceiverBalance = receiver.balance.add(amount);

  const newSender = createAccount(sender.name, newSenderBalance, newSenderBlind);
  const newReceiver = createAccount(receiver.name, newReceiverBalance, newReceiverBlind);

    //   Range Proofs
    const amountRangeProof = createRangeProof(amount, 6); // 6 bits can represent values up to 63
    const newSenderBalanceRangeProof = createRangeProof(newSenderBalance, 6); // Assuming max balance is 63


  const proof: TransferProof = {
    rangeProofs: {
        amount: amountRangeProof,
        newSenderBalance: newSenderBalanceRangeProof,
    },

    publicInputs: {
      oldSenderCommitment: sender.commitment.toString(),
      newSenderCommitment: newSender.commitment.toString(),
      oldReceiverCommitment: receiver.commitment.toString(),
      newReceiverCommitment: newReceiver.commitment.toString(),
    },

    witness: {
      oldSenderBalance: sender.balance,
      newSenderBalance,
      oldReceiverBalance: receiver.balance,
      newReceiverBalance,
      amount,

      oldSenderBlind: sender.blind,
      newSenderBlind,
      oldReceiverBlind: receiver.blind,
      newReceiverBlind,
    },
  };

  return {
    proof,
    newSender,
    newReceiver,
  };
}





export function verifyTransferProof(proof: TransferProof): boolean {
  const w = proof.witness;
  const p = proof.publicInputs;

  const checks: string[] = [];
  
  const amountInRange = w.amount.toNumber() >= 0 && w.amount.toNumber() <= 96;

    if (!amountInRange) {
    checks.push("Transfer amount is out of range");

    }

    const senderNewBalanceInRange = w.newSenderBalance.toNumber() >= 0 && w.newSenderBalance.toNumber() <= 96;

    if (!senderNewBalanceInRange) {
    checks.push("Sender new balance is out of range");

    }

    const senderDidNotOverspend = w.oldSenderBalance.toNumber() >= w.amount.toNumber();
    if (!senderDidNotOverspend) {

    checks.push("Sender tried to spend more than available balance");

    }


    // Verify range proofs
    const amountRangeProofIsValid = verifyRangeProof(proof.rangeProofs.amount);

    if (!amountRangeProofIsValid) {
    checks.push("Amount range proof failed");
    }

    const newSenderBalanceRangeProofIsValid = verifyRangeProof(
    proof.rangeProofs.newSenderBalance
    );

    if (!newSenderBalanceRangeProofIsValid) {
    checks.push("New sender balance range proof failed");
    }


  // Check 1:
  // oldSenderBalance = newSenderBalance + amount
  const senderConserved = w.oldSenderBalance.equals(
    w.newSenderBalance.add(w.amount)
  );

  if (!senderConserved) {
    checks.push("Sender balance conservation failed");
  }

  // Check 2:
  // newReceiverBalance = oldReceiverBalance + amount
  const receiverConserved = w.newReceiverBalance.equals(
    w.oldReceiverBalance.add(w.amount)
  );

  if (!receiverConserved) {
    checks.push("Receiver balance conservation failed");
  }

  // Check 3:
  // Rebuild old sender commitment and compare to public input
  const oldSenderCommitment = new Commitment(
    w.oldSenderBalance,
    w.oldSenderBlind
  );

  if (oldSenderCommitment.toString() !== p.oldSenderCommitment) {
    checks.push("Old sender commitment mismatch");
  }

  // Check 4:
  // Rebuild new sender commitment and compare to public input
  const newSenderCommitment = new Commitment(
    w.newSenderBalance,
    w.newSenderBlind
  );

  if (newSenderCommitment.toString() !== p.newSenderCommitment) {
    checks.push("New sender commitment mismatch");
  }

  // Check 5:
  // Rebuild old receiver commitment and compare to public input
  const oldReceiverCommitment = new Commitment(
    w.oldReceiverBalance,
    w.oldReceiverBlind
  );

  if (oldReceiverCommitment.toString() !== p.oldReceiverCommitment) {
    checks.push("Old receiver commitment mismatch");
  }

  // Check 6:
  // Rebuild new receiver commitment and compare to public input
  const newReceiverCommitment = new Commitment(
    w.newReceiverBalance,
    w.newReceiverBlind
  );

  if (newReceiverCommitment.toString() !== p.newReceiverCommitment) {
    checks.push("New receiver commitment mismatch");
  }

  if (checks.length > 0) {
    console.log("Proof rejected:");
    for (const check of checks) {
      console.log("✗", check);
    }
    return false;
  }

  console.log("Proof accepted:");
  console.log("✓ Sender balance conserved");
  console.log("✓ Receiver balance conserved");
  console.log("✓ Old sender commitment is valid");
  console.log("✓ New sender commitment is valid");
  console.log("✓ Old receiver commitment is valid");
  console.log("✓ New receiver commitment is valid");

  return true;
}