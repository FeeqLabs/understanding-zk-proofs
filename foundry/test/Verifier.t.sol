// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Verifier.sol";

contract VerifierTest is Test {
    Groth16Verifier verifier;

    function setUp() public {
        verifier = new Groth16Verifier();
    }

    function testVerifyProof() public view {
        uint[2] memory pA = [
            uint256(0x17ba9f95982a82d63e82aff4e786a6843e9be1f242e00f865af0e96eba55c9c9),
            uint256(0x1b645039f1aed486e616ae6f069917d49bef4b97d28b25a4543e58245ece6141)
        ];

        uint[2][2] memory pB = [
            [
                uint256(0x10504786e28b0e3599d7647f1527f33eccbdd1d19a31490f38ec2832ceec7868),
                uint256(0x2f936f6cfa9dfeb525064ff27be92896bd49f6aa62bc9df8fa72f8659c555f46)
            ],
            [
                uint256(0x087b363e40ab463c06340a1ab625c2652a6bf7d3856f5e16ec535f8d7afea5c5),
                uint256(0x20ddb52da751a042b07d818ce2c6356ff8c6ee02e586237dbac3eddee0f759bf)
            ]
        ];

        uint[2] memory pC = [
            uint256(0x19ff93d1471a9d067e6fc83d405a20cd9ccac3157e56c80a9dd91a210482912f),
            uint256(0x0205eca018b32f7b5d02ba96d684a84051b6b5bde570e5b790842af422b3c312)
        ];

        uint[1] memory pubSignals = [
            uint256(0x000000000000000000000000000000000000000000000000000000000000000d)
        ];

        bool ok = verifier.verifyProof(pA, pB, pC, pubSignals);

        assertTrue(ok);
    }
}