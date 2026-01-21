import { Contract, createContract, createContracts, isString } from "@jonloucks/contracts-ts";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";

function smoke() : void {
  const contract: Contract<string> = createContract({
    name: "MyContract",
    test: isString
  });
  const contracts = createContracts();
  validateContracts(contracts);
  using _usingContracts = contracts.open();
  contracts.bind(contract, () => "test string");
  const value: string = contracts.enforce(contract);
  console.log(contract.name, value);
}

smoke();