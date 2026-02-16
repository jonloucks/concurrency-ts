import { Contract, createContract, createContracts } from "@jonloucks/contracts-ts";
import { isString } from "@jonloucks/contracts-ts/api/Types";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";
import assert from "node:assert";

function smoke() : void {
  const contract: Contract<string> = createContract({
    name: "MyContract",
    test: isString
  });
  const contracts = createContracts();
  validateContracts(contracts);
  using usingContracts = contracts.open();
  assert(usingContracts);
  contracts.bind(contract, () => "test string");
  const value: string = contracts.enforce(contract);
  console.log(contract.name, value);
}

smoke();