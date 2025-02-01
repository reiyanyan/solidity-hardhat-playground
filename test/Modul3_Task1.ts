import { ethers } from "hardhat";
import { expect } from "chai";
import { ContractFactory, Contract } from "ethers";

describe("Modul3_Task1 Contract", function () {
  let Modul3_Task1: ContractFactory;
  let modul3_Task1: Contract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    Modul3_Task1 = await ethers.getContractFactory("Modul3_Task1");
    [owner, addr1, addr2] = await ethers.getSigners();

    modul3_Task1 = await Modul3_Task1.deploy();

    await modul3_Task1.waitForDeployment();
  });

  it("Should add a candidate", async function () {
    await modul3_Task1.addCandidate("Alice");
    const candidate = await modul3_Task1.candidates(1);
    expect(candidate.name).to.equal("Alice");
    expect(candidate.voteCount).to.equal(0);
  });

  it("Should allow voting for a candidate", async function () {
    await modul3_Task1.addCandidate("Alice");
    await modul3_Task1.connect(addr1).doVote(1);
    const candidate = await modul3_Task1.candidates(1);
    expect(candidate.voteCount).to.equal(1);
  });

  it.skip("Should not allow double voting", async function () {
    await modul3_Task1.addCandidate("Alice");
    await modul3_Task1.connect(addr1).doVote(1);
    const test = await modul3_Task1.connect(addr1).doVote(1);
    // console.log(test);
    expect(test).to.be.revertedWithCustomError("AlreadyVoted");
  });

  it("Should count votes for a candidate", async function () {
    await modul3_Task1.addCandidate("Alice");
    await modul3_Task1.connect(addr1).doVote(1);
    const voteCount = await modul3_Task1.countVotes(1);
    expect(voteCount).to.equal(1);
  });

  it.skip("Should declare the winner", async function () {
    await modul3_Task1.addCandidate("Alice");
    await modul3_Task1.addCandidate("Bob");
    await modul3_Task1.connect(addr1).doVote(1);
    await modul3_Task1.connect(addr2).doVote(1);
    await modul3_Task1.connect(owner).doVote(2);

    const tx = await modul3_Task1.declareWinner();
    const receipt = await tx.wait();
    const winnerEvent = receipt.events?.find(
      (event) => event.event === "Winner"
    );
    const winner = winnerEvent?.args?.[0];

    expect(winner.name).to.equal("Alice");
    expect(winner.voteCount).to.equal(2);
  });

  it("Should revert if candidate not found", async function () {
    const test = await modul3_Task1.connect(addr1).doVote(33);
    // console.log(test);
    await expect(test).to.be.revertedWithCustomError("CandidateNotFound(33)");
  });
});
