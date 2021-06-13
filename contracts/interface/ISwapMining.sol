// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface ISwapMining {
    function swap(address account, address input, address output, uint256 amount) external returns (bool);
    event SwapMining(address pair,address user,uint256 amount,uint256 quantity);
    event ShareToSuper(address pair,address user,address superUser,uint256 shareAmount,uint256 quantity);
    event ReferenceUpdate(address user,address lastReference,address changeReference);
    event TakerWithdraw(address pair,address to,uint256 reward);
}
