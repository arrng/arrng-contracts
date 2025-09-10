const { ethers } = require("hardhat")
const { expect } = require("chai")
const { keccak256 } = require("ethers/lib/utils")

describe("Arng Controller", function () {
  let owner
  let addr1
  let addr2
  let addr3
  let addr4
  let mockOracle
  let addrs

  let hhArrngController
  let hhMockERC20
  let hhMockERC721
  let hhMockConsumer

  const prerevealURI = "www.prereveal-uri.com"
  const revealedURI = "www.revealed-uri.com/"

  before(async function () {
    ;[owner, addr1, addr2, addr3, addr4, mockOracle, ...addrs] =
      await ethers.getSigners()

    const arrngController = await ethers.getContractFactory("ArrngController")
    hhArrngController = await arrngController.deploy(owner.address)

    const mockERC20 = await ethers.getContractFactory("MockERC20")
    const mockERC721 = await ethers.getContractFactory("MockERC721")
    hhMockERC20 = await mockERC20.deploy()
    hhMockERC721 = await mockERC721.deploy()

    const mockConsumer = await ethers.getContractFactory("MockConsumer")
    hhMockConsumer = await mockConsumer.deploy(
      100,
      prerevealURI,
      revealedURI,
      hhArrngController.address,
    )
  })

  context("ArrngController", function () {
    describe("Admin Functions", function () {
      before(async function () {})

      it("setENSReverseRegistrar - Non-owner cannot call", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            .setENSReverseRegistrar(addr3.address),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setENSReverseRegistrar - Owner can call", async () => {
        expect(await hhArrngController.ensReverseRegistrar()).to.equal(
          ethers.constants.AddressZero,
        )

        await expect(
          hhArrngController
            .connect(owner)
            .setENSReverseRegistrar(addr3.address),
        ).to.not.be.reverted

        expect(await hhArrngController.ensReverseRegistrar()).to.equal(
          addr3.address,
        )
      })

      it("setMinimumNativeToken - Non-owner cannot call", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            .setMinimumNativeToken(1000000000000000),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setMinimumNativeToken - Owner can call", async () => {
        expect(await hhArrngController.minimumNativeToken()).to.equal(0)

        await expect(
          hhArrngController
            .connect(owner)
            .setMinimumNativeToken(1000000000000000),
        ).to.not.be.reverted

        expect(await hhArrngController.minimumNativeToken()).to.equal(
          1000000000000000,
        )
      })

      it("setMaximumNumberOfNumbers - Non-owner cannot call", async () => {
        await expect(
          hhArrngController.connect(addr1).setMaximumNumberOfNumbers(5000),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setMaximumNumberOfNumbers - Owner can call", async () => {
        expect(await hhArrngController.maximumNumberOfNumbers()).to.equal(100)

        await expect(
          hhArrngController.connect(owner).setMaximumNumberOfNumbers(5000),
        ).to.not.be.reverted

        expect(await hhArrngController.maximumNumberOfNumbers()).to.equal(5000)
      })

      it("setMaximumRangeValue - Non-owner cannot call", async () => {
        await expect(
          hhArrngController.connect(addr1).setMaximumRangeValue(5000),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setMaximumRangeValue - Owner can call", async () => {
        expect(await hhArrngController.maximumRangeValue()).to.equal(1000000000)

        await expect(
          hhArrngController.connect(owner).setMaximumRangeValue(999999999),
        ).to.not.be.reverted

        expect(await hhArrngController.maximumRangeValue()).to.equal(999999999)
      })

      it("setOracleAddress - Non-owner cannot call", async () => {
        await expect(
          hhArrngController.connect(addr1).setOracleAddress(addr2.address),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setOracleAddress - Owner can call", async () => {
        expect(await hhArrngController.oracleAddress()).to.equal(
          ethers.constants.AddressZero,
        )

        await expect(
          hhArrngController.connect(owner).setOracleAddress(mockOracle.address),
        ).to.not.be.reverted

        expect(await hhArrngController.oracleAddress()).to.equal(
          mockOracle.address,
        )
      })

      it("setTreasuryAddress - Non-owner cannot call", async () => {
        await expect(
          hhArrngController.connect(addr1).setTreasuryAddress(addr4.address),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("setTreasuryAddress - Owner can call", async () => {
        expect(await hhArrngController.treasuryAddress()).to.equal(
          ethers.constants.AddressZero,
        )

        await expect(
          hhArrngController.connect(owner).setTreasuryAddress(addr4.address),
        ).to.not.be.reverted

        expect(await hhArrngController.treasuryAddress()).to.equal(
          addr4.address,
        )
      })
    })

    describe("Finance Functions", function () {
      before(async function () {
        await hhMockERC20.connect(owner).mint(hhArrngController.address, 1000)
        await hhMockERC721.connect(owner).safeMint20(owner.address)
        await hhMockERC721
          .connect(owner)
          ["safeTransferFrom(address,address,uint256)"](
            owner.address,
            hhArrngController.address,
            0,
          )
        await hhMockERC721
          .connect(owner)
          ["safeTransferFrom(address,address,uint256)"](
            owner.address,
            hhArrngController.address,
            1,
          )
        await hhMockERC721
          .connect(owner)
          ["safeTransferFrom(address,address,uint256)"](
            owner.address,
            hhArrngController.address,
            2,
          )
      })

      it("withdrawNativeToken - Non-owner cannot call", async () => {
        await expect(
          hhArrngController.connect(addr1).withdrawNativeToken(0),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("withdrawNativeToken - Owner can call", async () => {
        await expect(hhArrngController.connect(owner).withdrawNativeToken(0)).to
          .not.be.reverted
      })

      it("withdrawERC20 - Non-owner cannot call", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            .withdrawERC20(hhMockERC20.address, 1),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("withdrawERC20 - Owner can call", async () => {
        await expect(
          hhArrngController
            .connect(owner)
            .withdrawERC20(hhMockERC20.address, 1),
        ).to.not.be.reverted
      })

      it("withdrawERC721 - Non-owner cannot call", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            .withdrawERC721(hhMockERC721.address, [0, 1, 2]),
        ).to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("withdrawERC721 - Owner can call", async () => {
        await expect(
          hhArrngController
            .connect(owner)
            .withdrawERC721(hhMockERC721.address, [0, 1, 2]),
        ).to.not.be.reverted
      })
    })

    describe("Error States", function () {
      before(async function () {})

      it("Cannot get random numbers with insufficient native token", async () => {
        await expect(
          hhArrngController.connect(addr1)["requestRandomWords(uint256)"](2),
        ).to.be.revertedWith(
          "Insufficient token for gas, minimum is 1000000000000000. You may need more depending on the numbers requested and prevailing gas cost. All excess refunded, less txn fee.",
        )
      })

      it("Cannot request 0 numbers", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            ["requestRandomWords(uint256)"](0, { value: "1000000000000000" }),
        ).to.be.revertedWith("Must request more than 0 numbers")
      })

      it("Cannot request more than max amount of numbers", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            ["requestRandomWords(uint256)"](9999, {
              value: "1000000000000000",
            }),
        ).to.be.revertedWith("Request exceeds maximum number of numbers")
      })

      it("Cannot request an invalid number range", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            ["requestRandomNumbersInRange(uint256,uint256,uint256)"](1, 10, 9, {
              value: "1000000000000000",
            }),
        ).to.be.revertedWith("Invalid range")
      })

      it("Cannot request a too large a max number", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            ["requestRandomNumbersInRange(uint256,uint256,uint256)"](
              1,
              0,
              1000000001,
              { value: "1000000000000000" },
            ),
        ).to.be.revertedWith("Max value cannot exceed 999999999")
      })

      it("Cannot generate more unique numbers than available in the range", async () => {
        await expect(
          hhArrngController
            .connect(addr1)
            [
              "requestNonRepeatingRandomNumbersInRange(uint256,uint256,uint256)"
            ](11, 1, 10, {
              value: "1000000000000000",
            }),
        ).to.be.revertedWith(
          "Cannot generate more unique numbers than available in the range",
        )
      })
    })

    describe("Consumer", function () {
      before(async function () {
        await expect(
          hhMockConsumer.connect(addr1).safeMint(),
        ).to.not.be.reverted
        await expect(
          hhMockConsumer.connect(addr2).safeMint(),
        ).to.not.be.reverted
        await expect(
          hhMockConsumer.connect(addr3).safeMint(),
        ).to.not.be.reverted
      })

      it("Collection is at prereveal", async () => {
        expect(await hhMockConsumer.tokenURI(0)).to.equal(prerevealURI)
        expect(await hhMockConsumer.tokenURI(1)).to.equal(prerevealURI)
        expect(await hhMockConsumer.tokenURI(2)).to.equal(prerevealURI)
      })

      it("Can request randomness - refund to caller", async () => {
        await expect(
          hhMockConsumer.connect(owner).reveal({ value: "1000000000000000" }),
        ).to.not.be.reverted
      })

      it("Cannot receive randomness from non-oracle", async () => {
        // No service, mock response
        await expect(
          hhArrngController
            .connect(addr1)
            .serveRandomness(
              1,
              hhMockConsumer.address,
              ethers.constants.HashZero,
              0,
              [
                "62308597009000072040301731319126922416297638952066202699291105688555561071479",
              ],
              owner.address,
              "",
              "",
              0,
              { value: "990000000000000" },
            ),
        ).to.be.revertedWith("Oracle address only")
      })

      it("Can receive randomness", async () => {
        const initialBalance = await ethers.provider.getBalance(owner.address)

        // No service, mock response
        await expect(
          hhArrngController
            .connect(mockOracle)
            .serveRandomness(
              1,
              hhMockConsumer.address,
              ethers.constants.HashZero,
              0,
              [
                "62308597009000072040301731319126922416297638952066202699291105688555561071479",
              ],
              owner.address,
              "",
              "",
              0,
              { value: "990000000000000" },
            ),
        ).to.not.be.reverted

        const finalBalance = await ethers.provider.getBalance(owner.address)

        const balanceDifference = finalBalance.sub(initialBalance)

        expect(balanceDifference).to.equal("990000000000000")
      })

      it("Post-response processing complete", async () => {
        expect(await hhMockConsumer.offset()).to.equal(
          "62308597009000072040301731319126922416297638952066202699291105688555561071479",
        )

        expect(await hhMockConsumer.tokenURI(0)).to.equal(
          revealedURI + "79.json",
        )
        expect(await hhMockConsumer.tokenURI(1)).to.equal(
          revealedURI + "80.json",
        )
        expect(await hhMockConsumer.tokenURI(2)).to.equal(
          revealedURI + "81.json",
        )
      })

      it("Cannot receive randomness if already served", async () => {
        // No service, mock response
        await expect(
          hhArrngController
            .connect(mockOracle)
            .serveRandomness(
              1,
              hhMockConsumer.address,
              ethers.constants.HashZero,
              0,
              [
                "62308597009000072040301731319126922416297638952066202699291105688555561071479",
              ],
              owner.address,
              "",
              "",
              0,
              { value: "990000000000000" },
            ),
        ).to.be.revertedWith("Request already served")
      })
    })
  })
})
