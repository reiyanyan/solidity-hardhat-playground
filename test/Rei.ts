import { expect } from "chai";
import { ethers } from "hardhat";

describe("Rei", function () {
  let Rei: any;
  let rei: any;

  beforeEach(async function () {
    Rei = await ethers.getContractFactory("Rei");
    rei = await Rei.deploy();
  });

  /* -------- Skipping test for unlockTime, unnecessary for this example -------- */

  it("Should return empty string for initial value", async () => {
    const whoami = await rei.whoami();
    expect(whoami).to.equal("");
  });

  it("Set the value and ensure its changed", async function () {
    const VALUE = "halorei";
    const CHANGED_TO = `I am ${VALUE}`;

    const fun = await rei.changemeModified(VALUE);

    // ensure function called with argument/parameter
    expect(fun).to.emit(rei, "changemeModified").withArgs(VALUE);

    // ensure 'whoami' is changed
    const whoami = await rei.whoami();
    expect(whoami).to.equal(CHANGED_TO);
  });

  it("Set the value and ensure its NOT changed", async function () {
    const VALUE = "halorei";
    const CHANGED_TO = `I am ${VALUE}`;

    const fun = await rei.changemeNoModified(VALUE);

    // ensure function called with argument/parameter
    expect(fun).to.emit(rei, "changemeNoModified").withArgs(VALUE);

    // ensure 'whoami' is not changed -> cz calldata
    const whoami = await rei.whoami();
    expect(whoami).not.equal(CHANGED_TO);
    expect(whoami).to.equal(VALUE);
  });
});
