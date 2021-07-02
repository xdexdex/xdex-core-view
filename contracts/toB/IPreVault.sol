// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface IPreVault{
    function deposit(address token) external;
    function withdraw(address token,uint256 _amount)  external;
}