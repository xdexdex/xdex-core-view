// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import './interface/IMasterChef.sol';
import './interface/IDDX.sol';
import './uniswapv2/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";



contract TokenLock is Ownable,ReentrancyGuard {
    using SafeMath for uint;
    using SafeERC20 for IERC20;

    uint256 constant MAX_LOCK = 1e5;
    uint256 public lockRate = 5e4;

    uint public period = 1728000;//=100*720*24

    struct UserInfo {
        uint256 amount;
        uint256 blockStart;
        uint256 blockEnd;
        uint256 accBlock;
        uint256 lastRewardBlock;
    }

    uint256 internal _totalSupply;
    mapping(address => UserInfo) public userInfo;
    address immutable public token;
    event GetReward(address account,address token, uint256 reward,uint256 currentAmount);
    constructor(address _token) public {
        token = _token;
    }

    function lockToken(address account, uint256 amount) public returns( uint256) {
        UserInfo storage user = userInfo[account];
        uint256 reward = getReward(account);
        uint256 beforeAmount = IERC20(token).balanceOf(address(this));
        TransferHelper.safeTransferFrom(token, msg.sender, address(this), amount);
        uint256 afterAmount = IERC20(token).balanceOf(address(this));

        uint256 _amount = afterAmount.sub(beforeAmount);

        _totalSupply = _totalSupply.add(_amount);
        user.blockStart = block.number;
        user.amount = user.amount.add(_amount);
        user.blockEnd = block.number.add(period);
        user.accBlock = user.amount.div(period);
        user.lastRewardBlock = block.number;
        
        return reward;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function calLockAmount(uint amount) public view returns (uint256) {
        return amount.mul(lockRate).div(MAX_LOCK);
    }

    function balanceOf(address account) public view returns (uint256) {
        UserInfo storage user = userInfo[account];
        return user.amount;
    }

    function getReward(address account) nonReentrant public  returns (uint){
        uint _amount = getUnlock(account);
        if (_amount == 0) {
            return 0;
        }
        UserInfo storage user = userInfo[account];
        if (_amount > user.amount) {
            _amount = user.amount;
        }
        user.amount = user.amount.sub(_amount);
        _totalSupply = _totalSupply.sub(_amount);
        TransferHelper.safeTransfer(token, account, _amount);
        emit GetReward(account,token,_amount,user.amount);
        user.lastRewardBlock = block.number;
        return _amount;
    }

    function getUnlock(address account) public view returns (uint256){
        UserInfo memory user = userInfo[account];
        if (user.amount == 0||block.number <= user.lastRewardBlock) {
            return 0;
        }
        uint _amount = user.accBlock.mul(block.number - user.lastRewardBlock);
        if (_amount > user.amount) {
            _amount = user.amount;
        }
        user.lastRewardBlock = block.number;
        return _amount;
    }

    function getOtherToken(address _token) external onlyOwner {
        require(_token != token, "no token");
        uint amount = IERC20(_token).balanceOf(address(this));
        TransferHelper.safeTransfer(_token, owner(), amount);
    }

    function setLockRate(uint256 _rate) public onlyOwner {
        require(_rate <= MAX_LOCK.div(2), "rate < max");
        lockRate = _rate;
    }

    function setPeriod(uint256 _period) public onlyOwner {
        period = _period;
    }

}