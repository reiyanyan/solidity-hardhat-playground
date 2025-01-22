import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Task2 Contract", function () {
  let Task2: any;
  let task2: any;
  let tempAddr: string;

  beforeEach(async function () {
    // generate dummy address
    const dummySigners: HardhatEthersSigner[] = await ethers.getSigners();
    const { address } = dummySigners[0];
    tempAddr = address;

    Task2 = await ethers.getContractFactory("Task2");
    task2 = await Task2.deploy();
    await task2.waitForDeployment();
  });

  it("Should add a member", async function () {
    // add
    const addMember = await task2.addMember(tempAddr, "Rei", 0);
    expect(addMember).to.emit(task2, "addMember").withArgs(tempAddr);
  });

  it.skip("Debug get all member", async () => {
    await task2.addMember(tempAddr, "Rei", 0);
    console.log("insert -> check all", tempAddr, await task2.getAllMembers());
  });

  it("Do check member is available", async () => {
    // add
    const addMember = await task2.addMember(tempAddr, "Rei", 0);
    expect(addMember).to.emit(task2, "addMember").withArgs(tempAddr, "Rei", 0);

    // check
    const isMember = await task2.isMember(tempAddr);
    expect(isMember).to.be.true;
  });

  it("Should remove a member", async function () {
    // add
    const addMember = await task2.addMember(tempAddr, "Rei", 0);
    expect(addMember).to.emit(task2, "addMember").withArgs(tempAddr, "Rei", 0);

    // ensure remove member is called
    const removeMember = await task2.removeMember(tempAddr);
    expect(removeMember).to.emit(task2, "removeMember").withArgs(tempAddr);
  });

  it("Should update a member", async function () {
    // add
    const addMember = await task2.addMember(tempAddr, "Rei", 0);
    expect(addMember).to.emit(task2, "addMember").withArgs(tempAddr, "Rei", 0);

    // update
    const update = await task2.updateMember(tempAddr, "Rei+1", 100, 1);
    expect(update).to.emit(task2, "updateMember").withArgs(tempAddr);

    // get
    const member = await task2.getMember(tempAddr);
    expect(member.name).to.equal("Rei+1");
    expect(member.memberType).to.equal(1);
    expect(member.balance).to.equal(100);
  });

  // debug -> remove '.skip' to test
  it.skip("Debug get all member", async () => {
    await task2.addMember(tempAddr, "Rei", 0);
    console.log("insert -> check all", tempAddr, await task2.getAllMembers());

    await task2.removeMember(tempAddr);
    console.log("delete -> check all", tempAddr, await task2.getAllMembers());
  });

  it("Should return false for non-members", async function () {
    // add
    const addMember = await task2.addMember(tempAddr, "Rei", 0);
    expect(addMember).to.emit(task2, "addMember").withArgs(tempAddr, "Rei", 0);

    // delete
    const removeMember = await task2.removeMember(tempAddr);
    expect(removeMember).to.emit(task2, "removeMember").withArgs(tempAddr);

    const isMember = await task2.isMember(tempAddr);
    expect(isMember).to.be.false;
  });
});
