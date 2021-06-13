// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import './interface/IFeeCollector.sol';


contract DDXFeeCollector is IFeeCollector, Ownable {

    using SafeMath for uint;
    address public token;
    address public feeTo;

    constructor(address _token,address _feeTo) public {
        token = _token;
        feeTo = _feeTo;
    }

    function setFeeTo(address _feeTo)  public onlyOwner {
        feeTo = _feeTo;
    }

    function getFeeTo()external override view returns (address){
        return feeTo;
    }

    function transfer(address from, address to, uint256 amount) override external returns (uint256){
        return amount.div(100);
    }

    function getFeeAmount(uint amount) override external returns(uint256){
        return amount.div(100);
    }

}
