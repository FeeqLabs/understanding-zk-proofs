// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/CTVerifier.sol";

contract ConfidentialTransferVerifierTest is Test {
    Groth16Verifier verifier;

    function setUp() public {
        verifier = new Groth16Verifier();
    }

    function testVerifyConfidentialTransferProof() public view {
        uint[2] memory pA = [
            uint256(0x2022bf147cfb1738efd78d644a42ffd7bbbede452c1c7210cef260c6f366af86),
            uint256(0x19644db519b8680db0e7e571ebf915c2ae169f3f4c6b59dd71f57b6b7b7e8341)
        ];

        uint[2][2] memory pB = [
            [
                uint256(0x0387ccfeba3db06d745cdf5b9dffb32182bb33c141fc4078cef3d791f89f6dcc),
                uint256(0x25aeeac983cf7ec995ed230557ce6a7904bc4bceb6a5e6128757a574e120e96d)
            ],
            [
                uint256(0x2e9c7d823883fece656cb14e6316afb0352a93029676d4e5c4ffa8b5e6ac142e),
                uint256(0x0b4024e6b37d76ec80879b6dddf64e151136ff8babd8a2afc77a10a7d98a397b)
            ]
        ];

        uint[2] memory pC = [
            uint256(0x19f76083f6418bb305d9ea3c81a1dac8047bfc8e83374ab67cd6d6f501672940),
            uint256(0x08c2497cd1f36fc76b99f8aef48847378c15cb69636a08f99697650084cb7707)
        ];

        uint[4] memory pubSignals = [
            uint256(0x03b9), // old sender commitment = 953
            uint256(0x040c), // new sender commitment = 1036
            uint256(0x0630), // old receiver commitment = 1584
            uint256(0x097f)  // new receiver commitment = 2431
        ];

        bool ok = verifier.verifyProof(pA, pB, pC, pubSignals);

        assertTrue(ok);
    }

    function testRejectsWrongPublicCommitment() public view {
        uint[2] memory pA = [
            uint256(0x2022bf147cfb1738efd78d644a42ffd7bbbede452c1c7210cef260c6f366af86),
            uint256(0x19644db519b8680db0e7e571ebf915c2ae169f3f4c6b59dd71f57b6b7b7e8341)
        ];

        uint[2][2] memory pB = [
            [
                uint256(0x0387ccfeba3db06d745cdf5b9dffb32182bb33c141fc4078cef3d791f89f6dcc),
                uint256(0x25aeeac983cf7ec995ed230557ce6a7904bc4bceb6a5e6128757a574e120e96d)
            ],
            [
                uint256(0x2e9c7d823883fece656cb14e6316afb0352a93029676d4e5c4ffa8b5e6ac142e),
                uint256(0x0b4024e6b37d76ec80879b6dddf64e151136ff8babd8a2afc77a10a7d98a397b)
            ]
        ];

        uint[2] memory pC = [
            uint256(0x19f76083f6418bb305d9ea3c81a1dac8047bfc8e83374ab67cd6d6f501672940),
            uint256(0x08c2497cd1f36fc76b99f8aef48847378c15cb69636a08f99697650084cb7707)
        ];

        uint[4] memory wrongPubSignals = [
            uint256(0x03b9),
            uint256(0x040c),
            uint256(0x0630),
            uint256(0x0980) // changed from 2431 to 2432
        ];

        bool ok = verifier.verifyProof(pA, pB, pC, wrongPubSignals);

        assertFalse(ok);
    }
}