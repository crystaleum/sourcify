import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import dotenv from "dotenv";
import ContractCallDecoder from "../build/index.js";
import QmRFjbs2fEEQnAKaZzZKqWArJTta76GaWsD4PRbHuoY41S from "./QmRFjbs2fEEQnAKaZzZKqWArJTta76GaWsD4PRbHuoY41S.js";
dotenv.config();

chai.use(chaiAsPromised);

describe("Contract Call Decoder", function () {
  it("should extract the IPFS hash from the bytecode", async () => {
    const byteCode =
      "0x608060405234801561001057600080fd5b506004361061004c5760003560e01c80637bd703e81461005157806390b98a11146100a957806396e4ee3d1461010f578063f8b2cb4f1461015b575b600080fd5b6100936004803603602081101561006757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101b3565b6040518082815260200191505060405180910390f35b6100f5600480360360408110156100bf57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506101cf565b604051808215151515815260200191505060405180910390f35b6101456004803603604081101561012557600080fd5b810190808035906020019092919080359060200190929190505050610328565b6040518082815260200191505060405180910390f35b61019d6004803603602081101561017157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610335565b6040518082815260200191505060405180910390f35b60006101c86101c183610335565b6002610328565b9050919050565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156102205760009050610322565b816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190505b92915050565b6000818302905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea2646970667358221220711ac087831068bd33b58ebff95a8cdb23734e3a7a5c3c30fdb0d01e2b73c1ae64736f6c63430006020033";
    const expectedIpfsHash = "QmVxASRDQqUpxSvipxzHmnN2CqXjXvEDKGUTJn7ss9ioM7";
    const resultedIpfsHash = await ContractCallDecoder.decodeMetadataHash(
      byteCode
    );
    chai.expect(resultedIpfsHash).to.equal(expectedIpfsHash);
  });

  it("should fetch the metadata file from IPFS", async () => {
    const metadataHash = "QmRFjbs2fEEQnAKaZzZKqWArJTta76GaWsD4PRbHuoY41S";
    const expectedOutput = QmRFjbs2fEEQnAKaZzZKqWArJTta76GaWsD4PRbHuoY41S;
    const decoder = new ContractCallDecoder();
    const metadata = await decoder.fetchMetadataWithHash(metadataHash);
    chai.expect(expectedOutput).to.deep.equal(metadata);
  });

  it("should fail to fetch incorrect metadata hash from IPFS", async () => {
    const metadataHash = "abcdef";
    const decoder = new ContractCallDecoder();
    return chai
      .expect(decoder.fetchMetadataWithHash(metadataHash))
      .be.rejectedWith(Error);
  });

  it("should timeout to fetch non-existent hash from IPFS in 5sec", async () => {
    const metadataHash = "QmRFjbs2fEEQnAKaZzZKqWArJTta76GaWsD4PRbHuoY4as";
    const decoder = new ContractCallDecoder(undefined, undefined, 5000);
    return chai
      .expect(decoder.fetchMetadataWithHash(metadataHash))
      .be.rejectedWith(Error);
  }).timeout(10000);
});