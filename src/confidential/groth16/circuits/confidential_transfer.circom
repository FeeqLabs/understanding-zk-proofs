pragma circom 2.0.0;

template ConfidentialTransfer() {
    // Private balances
    signal input oldSenderBalance;
    signal input newSenderBalance;
    signal input oldReceiverBalance;
    signal input newReceiverBalance;
    signal input amount;

    // Private blinds
    signal input oldSenderBlind;
    signal input newSenderBlind;
    signal input oldReceiverBlind;
    signal input newReceiverBlind;

    // Public commitments
    signal input oldSenderCommitment;
    signal input newSenderCommitment;
    signal input oldReceiverCommitment;
    signal input newReceiverCommitment;

    var G = 11;
    var H = 31;

    // Balance conservation
    oldSenderBalance === newSenderBalance + amount;
    newReceiverBalance === oldReceiverBalance + amount;

    // Commitment correctness
    oldSenderCommitment === oldSenderBalance * G + oldSenderBlind * H;
    newSenderCommitment === newSenderBalance * G + newSenderBlind * H;
    oldReceiverCommitment === oldReceiverBalance * G + oldReceiverBlind * H;
    newReceiverCommitment === newReceiverBalance * G + newReceiverBlind * H;
}

component main {public [
    oldSenderCommitment,
    newSenderCommitment,
    oldReceiverCommitment,
    newReceiverCommitment
]} = ConfidentialTransfer();