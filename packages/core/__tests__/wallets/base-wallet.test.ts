import { BaseWallet } from "../../src/wallets/base-wallet";
import { Wallet, WalletState } from "../../src/types";
import { Chain } from "@chain-registry/v2-types";

class TestWallet extends BaseWallet {
  async init(): Promise<void> {
    this.walletState = WalletState.Disconnected;
  }
  async connect(chainId: Chain['chainId']): Promise<void> {
    this.walletState = WalletState.Connected;
  }
  async disconnect(chainId: Chain['chainId']): Promise<void> {
    this.walletState = WalletState.Disconnected;
  }
  async getAccount(chainId: Chain['chainId']): Promise<any> {
    return { address: "test-address" };
  }
  async getOfflineSigner(chainId: Chain['chainId']): Promise<any> {
    return {};
  }
  async addSuggestChain(chainId: Chain['chainId']): Promise<void> { }
  async getProvider(chainId: Chain['chainId']): Promise<any> {
    return {};
  }
}

describe("BaseWallet", () => {
  let wallet: TestWallet;

  beforeEach(() => {
    wallet = new TestWallet({ name: "Test Wallet", prettyName: "Test Wallet", mode: 'extension' });
  });

  it("should initialize wallet", async () => {
    await wallet.init();
    expect(wallet.walletState).toBe(WalletState.Disconnected);
  });

  it("should connect to a chain", async () => {
    await wallet.connect("test-chain-id");
    expect(wallet.walletState).toBe(WalletState.Connected);
  });

  it("should disconnect from a chain", async () => {
    await wallet.disconnect("test-chain-id");
    expect(wallet.walletState).toBe(WalletState.Disconnected);
  });

  it("should set and retrieve chain map", () => {
    const chains: Chain[] = [{ chainId: "test-chain-id", chainName: "Test Chain" } as Chain];
    wallet.setChainMap(chains);
    const chain = wallet.getChainById("test-chain-id");
    expect(chain.chainName).toBe("Test Chain");
  });

  it("should set and retrieve asset lists", () => {
    const assetLists = [{ assets: [] }] as any;
    wallet.setAssetLists(assetLists);
    expect(wallet.assetLists).toEqual(assetLists);
  });

  it("should get account", async () => {
    const account = await wallet.getAccount("test-chain-id");
    expect(account.address).toBe("test-address");
  });
});