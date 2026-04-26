# Confidential Transfer ZK Demo

## Overview

This project is an implementation of a **confidential transfer system** built with **zero-knowledge proofs (ZKPs)** specicfically SNARK using the groth16 proving system.

It demonstrates how one person can send value to another person and prove the transfer is valid **without revealing**:
- the sender’s balance
- the receiver’s balance
- the transfer amount
- the hidden randomness used to protect those balances

The verifier only sees:
- public commitments
- a zero-knowledge proof
and can still verify that the transfer is valid.


I made use of circom as the Domain specific language and for writing the contraint and also implemented an onchain verifier used in verifying the proofs.