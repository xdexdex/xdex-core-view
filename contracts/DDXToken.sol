// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "./DelegateERC20.sol";
import './interface/IDDX.sol';
import './interface/IFeeCollector.sol';


contract DDXToken is DelegateERC20, Ownable,IDDX {
    uint256 private constant preMineSupply = 57500000 * 1e18; 
    uint256 private constant maxSupply =    250000000 * 1e18;     // the total supply

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private _feeWhiteList;
    EnumerableSet.AddressSet private _minters;

    address public feeCollector;

    constructor() public ERC20("DDXToken", "DDX"){
        _mint(msg.sender, preMineSupply);
    }

    function setFeeCollector(address _feeCollector) public onlyOwner {
        require(_feeCollector != address(this));
        feeCollector = _feeCollector;
    }


    function _transfer(address sender, address recipient, uint256 amount) internal override virtual {
        if(feeCollector!=address(0x0) && !isFeeWhitelist(msg.sender)){ 
            uint256 fee = IFeeCollector(feeCollector).transfer(sender,recipient,amount);
            if(fee>0){
                super._transfer(sender, IFeeCollector(feeCollector).getFeeTo(), fee);        
                amount = amount.sub(fee);
            }
        }
        super._transfer(sender, recipient, amount);
        _moveDelegates(_delegates[sender], _delegates[recipient], amount);
    }

    // mint with max supply
    function mint(address _to, uint256 _amount) external onlyMinter override  returns (bool) {
        require (_amount.add(totalSupply()) <= maxSupply) ;
        _mint(_to, _amount);
        return true;
    }

    function addMinter(address _addMinter) public onlyOwner returns (bool) {
        require(_addMinter != address(0), "DDXToken: _addMinter is the zero address");
        return EnumerableSet.add(_minters, _addMinter);
    }

    function delMinter(address _delMinter) public onlyOwner returns (bool) {
        require(_delMinter != address(0), "DDXToken: _delMinter is the zero address");
        return EnumerableSet.remove(_minters, _delMinter);
    }

    function getMinterLength() public view returns (uint256) {
        return EnumerableSet.length(_minters);
    }

    function isMinter(address account) public view returns (bool) {
        return EnumerableSet.contains(_minters, account);
    }

    function getMinter(uint256 _index) public view onlyOwner returns (address){
        require(_index <= getMinterLength() - 1, "DDXToken: index out of bounds");
        return EnumerableSet.at(_minters, _index);
    }

    // modifier for mint function
    modifier onlyMinter() {
        require(isMinter(msg.sender), "caller is not the minter");
        _;
    }


    // Only address in whitelist can transfer without fee
    function addFeeWhitelist(address _add) public onlyOwner returns (bool) {
        require(_add != address(0), "DDXToken: address is the zero address");
        return EnumerableSet.add(_feeWhiteList, _add);
    }

    function delFeeWhitelist(address _del) public onlyOwner returns (bool) {
        require(_del != address(0), "DDXToken: address is the zero address");
        return EnumerableSet.remove(_feeWhiteList, _del);
    }

    function getFeeWhitelistLength() public view returns (uint256) {
        return EnumerableSet.length(_feeWhiteList);
    }

    function isFeeWhitelist(address _address) public view returns (bool) {
        return EnumerableSet.contains(_feeWhiteList, _address);
    }

    function getFeeWhitelist(uint256 _index) public view returns (address){
        require(_index <= getFeeWhitelistLength() - 1, "DDXToken: index out of bounds");
        return EnumerableSet.at(_feeWhiteList, _index);
    }
}
