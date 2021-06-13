// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IFeeCollector {
    function transfer(address from, address to, uint256 amount) external returns (uint256);
    function getFeeTo()external view returns(address);
    function getFeeAmount(uint256 amount) external returns(uint256);
}
