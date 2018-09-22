const HashStore = artifacts.require("./HashStore.sol");

contract("HashStore", accounts => {

    it("It should get the correct account as source when asked for stored hash", async () => {
        const hashStore = await HashStore.deployed();

        await hashStore.storeHash("123", {from: accounts[0]});

        const source = await hashStore.getSourceFromHash.call("123");

        assert.equal(source, accounts[0], "Wrong source");
    });

    it("It should get zero as source when ask for not stored hash", async () => {
        const hashStore = await HashStore.deployed();

        const source = await hashStore.getSourceFromHash.call("1234");

        assert.equal(source, 0, "Wrong source");
    });

    it("It should throw exception when store hash twice", async () => {
        const hashStore = await HashStore.deployed();

        let isThrown = false;
        try {
            await hashStore.storeHash("123456", {from: accounts[0]});
            await hashStore.storeHash("123456", {from: accounts[0]});
        }
        catch (e) {
            isThrown = true;
        }

        assert.equal(isThrown, true, "No exception thrown")
    });
});
