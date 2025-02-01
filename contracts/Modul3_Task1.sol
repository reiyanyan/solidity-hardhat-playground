// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

struct Candidate {
    uint id;
    string name;
    uint voteCount;
}

contract Modul3_Task1 {
    /* ----------------------------- errors section ----------------------------- */
    error AlreadyVoted(address voter);
    error CandidateNotFound(uint candidateId);

    /* ------------------------------ event section ----------------------------- */
    event Add(uint id, string name);
    event Vote(address indexed voter, uint candidateId);
    event Winner(Candidate candidate);

    /* ---------------------------- variables section --------------------------- */
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) private isAlreadyVoted;
    Candidate[] public candidateList;
    uint private idCounter;

    constructor() {
        // i don't want zero to be first ID of candidate
        idCounter = 1;
    }

    /* --------------------- check candidate is valid or not -------------------- */
    function isValidCandidate(uint _candidateId) internal view returns (bool) {
        if (bytes(candidates[_candidateId].name).length == 0) {
            revert CandidateNotFound(_candidateId);
        }

        return true;
    }

    /* ---------------------------- adding candidate ---------------------------- */
    function addCandidate(string memory _name) external {
        candidates[idCounter] = Candidate({
            id: idCounter,
            name: _name,
            voteCount: 0 // new candidate, default is 0
        });

        // insert to array
        candidateList.push(candidates[idCounter]);

        // emit event
        emit Add(idCounter, _name);

        // increasing id
        idCounter++;
    }

    /* --------------------------------- do vote -------------------------------- */
    function doVote(uint _candidateId) external {
        if (isAlreadyVoted[msg.sender]) {
            revert AlreadyVoted(msg.sender);
        }

        isValidCandidate(_candidateId);

        candidates[_candidateId].voteCount += 1;
        isAlreadyVoted[msg.sender] = true;
        emit Vote(msg.sender, _candidateId);
    }

    /* ----------------------- total votes for a candidate ---------------------- */
    function countVotes(uint _candidateId) public view returns (uint) {
        // isValidCandidate(_candidateId);
        isValidCandidate(_candidateId);

        return candidates[_candidateId].voteCount;
    }

    function declareWinner() public {
        uint highest = 0;
        uint winner;

        for (uint i = 1; i < candidateList.length; i++) {
            if (candidates[i].voteCount > highest) {
                highest = candidates[i].voteCount;
                winner = i;
            }
        }

        emit Winner(candidates[winner]);
    }
}
