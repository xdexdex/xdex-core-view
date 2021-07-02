// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import './interface/IDDX.sol';
import './uniswapv2/interfaces/IUniswapV2Pair.sol';
import "./DelegateERC20.sol";
import  './uniswapv2/libraries/TransferHelper.sol';

contract Repurchase is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private _caller;

    address public constant USDT = 0xa71EdC38d189767582C38A3145b5873052c3e47a;
    address public constant DDX = 0x03654d22fB47e1806Fd92959dA0c8c187965feEE;
    address public constant DDX_USDT = 0x60889f526538d1246Fb750411C1b2E255d56e67E;
    address public constant blackHoleAddress = 0xbB597524cd334ecE51fd6C5Bff0889aF10AE3eB0;
    address public daoAddress = 0xc378d897bE9395Fbeac9D5e8761eFCD09c049eB0;
    address public emergencyAddress;
    uint256 public amountIn;
    event RepurchaseSwap(uint256 amountHalf,uint256 amountHole,uint256 amountDao);

    constructor (uint256 _amount, address _emergencyAddress) public {
        require(_amount > 0, "Amount must be greater than zero");
        require(_emergencyAddress != address(0), "Is zero address");
        amountIn = _amount;
        emergencyAddress = _emergencyAddress;
    }

    function setAmountIn(uint256 _newIn) public onlyOwner {
        amountIn = _newIn;
    }

    function setDaoAddress(address _daoAddress) public onlyOwner {
        daoAddress = _daoAddress;
    }

    function setEmergencyAddress(address _newAddress) public onlyOwner {
        require(_newAddress != address(0), "Is zero address");
        emergencyAddress = _newAddress;
    }

    function addCaller(address _newCaller) public onlyOwner returns (bool) {
        require(_newCaller != address(0), "NewCaller is the zero address");
        return EnumerableSet.add(_caller, _newCaller);
    }

    function delCaller(address _delCaller) public onlyOwner returns (bool) {
        require(_delCaller != address(0), "DelCaller is the zero address");
        return EnumerableSet.remove(_caller, _delCaller);
    }

    function getCallerLength() public view returns (uint256) {
        return EnumerableSet.length(_caller);
    }

    function isCaller(address _call) public view returns (bool) {
        return EnumerableSet.contains(_caller, _call);
    }

    function getCaller(uint256 _index) public view returns (address){
        require(_index <= getCallerLength() - 1, "index out of bounds");
        return EnumerableSet.at(_caller, _index);
    }
    function swapV() external view returns (uint256 amountOut){
        
        // require(IERC20(USDT).balanceOf(address(this)) >= amountIn, "Insufficient contract balance");
        uint256 amountHalf = amountIn.div(2);
        {
            (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(DDX_USDT).getReserves();
            uint256 amountInWithFee = amountHalf.mul(9975);
            amountOut = amountHalf.mul(9975).mul(reserve0) / reserve1.mul(10000).add(amountInWithFee);
            //IERC20(USDT).safeTransfer(DDX_USDT, amountHalf);
            // IUniswapV2Pair(DDX_USDT).swap(amountOut, 0, blackHoleAddress, new bytes(0));
        }
    }

    function swap() external onlyCaller returns (uint256 amountOut){
        require(IERC20(USDT).balanceOf(address(this)) >= amountIn, "Insufficient contract balance");
        uint256 amountHalf = amountIn.div(2);
        uint256 amountHole = 0;
        {
            (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(DDX_USDT).getReserves();
            uint256 amountInWithFee = amountHalf.mul(9975);
            amountOut = amountHalf.mul(9975).mul(reserve0) / reserve1.mul(10000).add(amountInWithFee);
            IERC20(USDT).safeTransfer(DDX_USDT, amountHalf);
            IUniswapV2Pair(DDX_USDT).swap(amountOut, 0, blackHoleAddress, new bytes(0));
            amountHole = amountOut;
        }

        {
            (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(DDX_USDT).getReserves();
            uint256 amountInWithFee = amountHalf.mul(9975);
            amountOut = amountHalf.mul(9975).mul(reserve0) / reserve1.mul(10000).add(amountInWithFee);
            IERC20(USDT).safeTransfer(DDX_USDT, amountHalf);
            IUniswapV2Pair(DDX_USDT).swap(amountOut, 0, daoAddress, new bytes(0));
    
        }
        emit RepurchaseSwap(amountHalf,amountHole,amountOut);
    }

    modifier onlyCaller() {
        require(isCaller(msg.sender), "Not the caller");
        _;
    }

    function emergencyWithdraw(address _token) public onlyOwner {
        require(IERC20(_token).balanceOf(address(this)) > 0, "Insufficient contract balance");
        IERC20(_token).transfer(emergencyAddress, IERC20(_token).balanceOf(address(this)));
    }

      // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyNative(uint256 amount) public onlyOwner {
        TransferHelper.safeTransferNative(msg.sender,amount)  ;
    }
}

