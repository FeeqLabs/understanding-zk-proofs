import { F } from "./field";
import { Commitment } from "./commitment";
import { createAccount, publicState, privateState } from "./account";
import transfer = require("./transfer");
import { createTransferProof, verifyTransferProof } from "./transfer";

const aliceBalance = F(50);
const aliceBlind = F(13);
const aliceCommitment = new Commitment(aliceBalance, aliceBlind);

// BOB
const bobBalance = F(20);
const bobBlind = F(44);
const bobCommitment = new Commitment(bobBalance, bobBlind);



// LOGS
// console.log("Alice's balance:", aliceBalance.toString());
// console.log("Alice's blind:", aliceBlind.toString());
// console.log("Alice's commitment:", aliceCommitment.toString());

// console.log("Bob's balance:", bobBalance.toString());
// console.log("Bob's blind:", bobBlind.toString());
// console.log("Bob's commitment:", bobCommitment.toString());



// Accountsconfidential_transfer.circom

const aliceAccount = createAccount("Alice", aliceBalance, aliceBlind);
const bobAccount = createAccount("Bob", bobBalance, bobBlind);



console.log("\n=== Initial Private State ===");
console.log("Private state Alice", privateState(aliceAccount));
console.log("Private state Bob", privateState(bobAccount));

console.log("\n=== Initial Public State ===");
console.log("Public state Alice", publicState(aliceAccount));
console.log("Public state Bob", publicState(bobAccount));


const amount = F(20);

const { proof, newSender:newAlice, newReceiver:newBob } = createTransferProof(aliceAccount, bobAccount, amount, F(21), F(66));
console.log("Transfer proof:", proof);

console.log("Proof Public inputs", proof.publicInputs);


console.log("\n=== Verifying Proof ===");
verifyTransferProof(proof);


console.log("\n=== Final Private State ===");
console.log(privateState(newAlice));
console.log(privateState(newBob));

console.log("\n=== Final Public State ===");
console.log(publicState(newAlice));
console.log(publicState(newBob));