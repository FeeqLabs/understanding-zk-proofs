

comopile the circuit
```sh
circom src/confidential/groth16/circuits/confidential_transfer.circom \
  --r1cs \
  --wasm \
  --sym \
  -o src/confidential/groth16/build
  ```

generate witness
```sh
node src/confidential/groth16/build/testing_js/generate_witness.js \
  src/confidential/groth16/build/testing_js/confidential_transfer.wasm \
  src/confidential/groth16/input.json \
  src/confidential/groth16/build/outputs/witness.wtns
```

inspect the circuit
```sh
npx snarkjs r1cs info src/confidential/groth16/build/confidential_transfer.r1cs
```


Groth16 setup phase
- install power of Tau
```sh
npx snarkjs powersoftau new bn128 12 src/confidential/groth16/build/pot12_0000.ptau -v
```

- contribute to the ceremony ( this adds entropy{randomness})
```sh
npx snarkjs powersoftau contribute \
  src/confidential/groth16/build/pot12_0000.ptau \
  src/confidential/groth16/build/pot12_0001.ptau \
  --name="First contribution" \
  -v


npx snarkjs powersoftau prepare phase2 \
  src/confidential/groth16/build/pot12_0001.ptau \
  src/confidential/groth16/build/pot12_final.ptau \
  -v

```


Phase 2 — Circuit-specific setup
Now we bind the universal setup to your exact circuit into an output zkey.
- 

```sh
npx snarkjs groth16 setup \
  src/confidential/groth16/build/confidential_transfer.r1cs \
  src/confidential/groth16/build/pot12_final.ptau \
  src/confidential/groth16/build/outputs/testing_0000.zkey
```

- Contribute once again
```sh
npx snarkjs zkey contribute \
  src/confidential/groth16/build/outputs/testing_0000.zkey \
  src/confidential/groth16/build/outputs/testing_final.zkey \
  --name="Circuit contribution" \
  -v
```


NOW GENERATE PROOFS(generate the actual proof from the witness and the final zkey)

```sh
npx snarkjs groth16 prove \
  src/confidential/groth16/build/outputs/testing_final.zkey \
  src/confidential/groth16/build/witness.wtns \
  src/confidential/groth16/build/outputs/proof.json \
  src/confidential/groth16/build/outputs/public.json
```


- Export Verification key
```sh
npx snarkjs zkey export verificationkey \
  src/confidential/groth16/build/outputs/testing_final.zkey \
  src/confidential/groth16/build/outputs/verification_key.json
```

- Verify the proof
```sh
npx snarkjs groth16 verify \
  src/confidential/groth16/build/outputs/verification_key.json \
  src/confidential/groth16/build/outputs/public.json \
  src/confidential/groth16/build/outputs/proof.json
```




EXAMPLE

-     regenerate witness
* regenerate proof
* verify again



ONCHAIN VERIFICATION METHOD
- generate soliidty verifier
```sh
npx snarkjs zkey export solidityverifier \
  src/confidential/groth16/build/outputs/testing_final.zkey \
  src/confidential/groth16/contracts/Verifier.sol
```
 - install foundry and cp the generated verifier into it

- generate the calldata to test for
```sh
npx snarkjs zkey export soliditycalldata \
  src/confidential/groth16/build/outputs/public.json \
  src/confidential/groth16/build/outputs/proof.json
```

- Run the foundry test
forge test