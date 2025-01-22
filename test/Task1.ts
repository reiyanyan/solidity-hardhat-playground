import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Task 1", function () {
  let Task1: any;
  let task1: any;
  let tempAddr: string;

  beforeEach(async function () {
    // generate dummy address
    const dummySigners: HardhatEthersSigner[] = await ethers.getSigners();
    const { address } = dummySigners[0];
    tempAddr = address;

    Task1 = await ethers.getContractFactory("Task1");
    task1 = await Task1.deploy();

    await task1.waitForDeployment();
  });

  it("Should add a member", async () => {
    // ensure add member is called
    const addMember = await task1.addMember(tempAddr);
    expect(addMember).to.emit(task1, "addMember").withArgs(tempAddr);
  });

  // debug -> remove '.skip' to test
  it.skip("Debug get all member", async () => {
    await task1.addMember(tempAddr);
    console.log("insert -> check all", tempAddr, await task1.getAllMembers());
  });

  it("Do check member is available", async () => {
    // add
    const addMember = await task1.addMember(tempAddr);
    expect(addMember).to.emit(task1, "addMember").withArgs(tempAddr);

    // check
    const isMember = await task1.isMember(tempAddr);
    expect(isMember).to.be.true;
  });

  it("Should remove a member", async () => {
    // add
    const addMember = await task1.addMember(tempAddr);
    expect(addMember).to.emit(task1, "addMember").withArgs(tempAddr);

    // ensure remove member is called
    const removeMember = await task1.removeMember(tempAddr);
    expect(removeMember).to.emit(task1, "removeMember").withArgs(tempAddr);
  });

  // debug -> remove '.skip' to test
  it.skip("Debug get all member", async () => {
    await task1.addMember(tempAddr);
    console.log("insert -> check all", tempAddr, await task1.getAllMembers());

    await task1.removeMember(tempAddr);
    console.log("delete -> check all", tempAddr, await task1.getAllMembers());
  });

  /* --------- scenario member deleted can be used for unknown member --------- */
  it("Should return false when member not found", async () => {
    // add
    const addMember = await task1.addMember(tempAddr);
    expect(addMember).to.emit(task1, "addMember").withArgs(tempAddr);

    // delete
    const removeMember = await task1.removeMember(tempAddr);
    expect(removeMember).to.emit(task1, "removeMember").withArgs(tempAddr);

    // ensure member not found
    const member = await task1.isMember(tempAddr);
    expect(member).to.be.false;
  });
});
