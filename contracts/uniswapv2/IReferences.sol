// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";

interface IReferences {


    function rewardUpper(address ref,address token,uint256 upperFeeReal,uint256 amount,address _sweeper) external  returns (uint256) ;
    function getReferAmount(address _user, uint256 amount) external view returns (uint256 upperFeeReal,uint256 upperFeeTotal);
    function withdraw(address token) external ;



}
