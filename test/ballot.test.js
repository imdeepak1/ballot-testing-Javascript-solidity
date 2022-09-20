const Ballot = artifacts.require("./Ballot.sol");
const proposalOne =
  "0x64656570616b0000000000000000000000000000000000000000000000000000";
const proposalTwo =
  "0x7368756268616d00000000000000000000000000000000000000000000000000";
const voter = {
  winner: 0,
  voted: true,
};
let ballotInstance;

contract("Ballot", function (accounts) {
  describe("Deployment", () => {
    before(
      "Smart contract shoult deployed properly and should return the list of accounts",
      async () => {
        try {
          ballotInstance = await Ballot.deployed();
        } catch (err) {
          assert.fail(err.message);
        }
      }
    );

    it("check proposal are add succesfully", async () => {
      try {
        const ballotProposalOne = await ballotInstance.proposals(0);
        const ballotProposalTwo = await ballotInstance.proposals(1);
        assert.equal(ballotProposalOne.name, proposalOne);
        assert.equal(ballotProposalTwo.name, proposalTwo);
      } catch (err) {
        assert.fail(err.message);
      }
    });
  });
  describe("Use Case", () => {
    it("Valid User Ragistration", async () => {
      try {
        const chairperson = await ballotInstance.chairperson.call();
        assert.equal(
          accounts[0],
          chairperson,
          "Only chairperson can give right to vote"
        );
        await ballotInstance.giveRightToVote(accounts[1], {
          from: accounts[0],
        });
        const userOne = await ballotInstance.voters(accounts[2]);
        assert.notEqual(voter.voted, userOne.voted, "Registration is invalid");
        await ballotInstance.giveRightToVote(accounts[2], {
          from: accounts[0],
        });
        const userTwo = await ballotInstance.voters(accounts[2]);
        assert.notEqual(voter.voted, userTwo.voted, "Registration is Valid");
      } catch (err) {
        assert.fail(err.message);
      }
    });
    it("Should NOT accept unauthorized registration", async () => {
      try {
        await ballotInstance.giveRightToVote(accounts[1], {
          from: accounts[3],
        });
      } catch (err) {
        assert(err.message.includes("Only chairperson can give right to vote"));
      }
    });
    it("User can not delegate itself", async () => {
      try {
        await ballotInstance.delegate(accounts[0], { from: accounts[0] });
      } catch (err) {
        assert(err.message.includes("Self-delegation is disallowed"));
      }
    });
    it("User can delegate his vote to the anyone", async () => {
      try {
        await ballotInstance.delegate(accounts[4], {
          from: accounts[3],
        });
        const address = await ballotInstance.voters(accounts[4]);
        assert.notEqual(voter.voted, address.voted, "User Delegated");
      } catch (err) {
        assert.fail(err.message);
      }
    });

    it("check user voted or not", async () => {
      try {
        await ballotInstance.vote(voter.winner, {
          from: accounts[1],
        });
        const voterOne = await ballotInstance.voters(accounts[1]);
        assert.equal(voter.voted, voterOne.voted, "Voting is done");
        await ballotInstance.vote(voter.winner, {
          from: accounts[2],
        });
        const voterTwo = await ballotInstance.voters(accounts[2]);
        assert.equal(voter.voted, voterTwo.voted, "Voting is done");
      } catch (err) {
        assert.fail(err.message);
      }
    });
    it("Should NOT accept unregistered user vote", async () => {
      try {
        await ballotInstance.vote(0, { from: accounts[5] });
      } catch (err) {
        assert(err.message.includes("Has no right to vote"));
      }
    });

    it("Should NOT vote again", async () => {
      try {
        await ballotInstance.vote(1, { from: accounts[1] });
      } catch (err) {
        assert(err.message.includes("Already voted"));
      }
    });

    it("Should NOT vote unknown entity", async () => {
      try {
        await ballotInstance.vote(4, { from: accounts[4] });
      } catch (err) {
        assert(err.message.includes("Has no right to vote"));
      }
    });

    it("Validate Winning Proposal", async () => {
      try {
        const result = await ballotInstance.winningProposal.call();
        assert.equal(
          voter.winner,
          result.toNumber(),
          "Winner is validated with the expected winner"
        );
      } catch (err) {
        assert.fail(err.message);
      }
    });

    it("Validate Winner Name", async () => {
      try {
        const result = await ballotInstance.winnerName.call();
        assert.equal(proposalOne, result);
      } catch (err) {
        assert.fail(err.message);
      }
    });
  });
});
