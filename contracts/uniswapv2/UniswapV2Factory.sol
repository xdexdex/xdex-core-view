// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.6.12;

import './interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';
import './libraries/Math.sol';
import './interfaces/IUniswapV2Pair.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import './interfaces/IReferences.sol';
import "@openzeppelin/contracts/math/SafeMath.sol";
import  './libraries/TransferHelper.sol';
contract UniswapV2Factory is IUniswapV2Factory ,Ownable{
    address public override feeTo;
    address public override repurchaseTo;
    // using SafeMath for uint256;
    address public override feeToSetter;
    address public override migrator;
    using SafeMathUniswap  for uint;

    mapping(address => mapping(address => address)) public override getPair;
    mapping(address => IFeeCalcutor) public pairFeeCalculators;
    address[] public override allPairs;

    address public refers;
    uint256 public referRatio;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter,address _refers,uint256 _referRatio) public {
        feeToSetter = _feeToSetter;
        refers = _refers;
        referRatio = _referRatio;
    }

    function allPairsLength() external override view returns (uint) {
        return allPairs.length;
    }

    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }

    function calcTotalFee(address pair,uint rootK,uint rootKLast,uint totalSupply) external override view returns (uint256 liquidity,address repurchase,uint256 repurchaseAmount)
    {
        repurchase =  repurchaseTo ;
        IFeeCalcutor calc = pairFeeCalculators[pair];
        if(address(calc)==address(0x0)){
            uint numerator = totalSupply.mul(rootK.sub(rootKLast));
            // uint denominator = rootK.mul(2).add(rootKLast);
            uint denominator = rootK.wdiv(3).wmul(2).add(rootKLast);
            liquidity = numerator / denominator;
            if (liquidity > 0) {
                if(repurchase!=address(0)){
                    repurchaseAmount = liquidity.wdiv(15).wmul(14);
                }
            }
        }else{
           (liquidity,repurchaseAmount) = calc.calcTotalFee(pair,rootK,rootKLast,totalSupply);
        }
    }

    function setPairCalculator(address pair,address calc) public onlyOwner{
        pairFeeCalculators[pair]=IFeeCalcutor(calc);
    }

    function setRefers(address _refers,uint256 _referRatio) public onlyOwner{
        refers = _refers;
        referRatio = _referRatio;
    }

    function getReferAmount(address _user, uint256 amount) public override view returns (uint256 upperFeeReal,uint256 upperFeeTotal){
        return IReferences(refers).getReferAmount(_user, amount.wdiv(10000).wmul(referRatio));
    }

    function rewardUpper(address ref,address token,uint256 upperFeeReal,uint256 upperFeeTotal) public override  {
        if(refers!=address(0x0)){
            TransferHelper.safeTransfer(token,refers,upperFeeReal);
            IReferences(refers).rewardUpper(ref,token,upperFeeReal,upperFeeTotal,feeTo);
        }
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        UniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setRepurchaseTo(address _repurchaseTo) external override {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        repurchaseTo = _repurchaseTo;
    }

    function setMigrator(address _migrator) external override {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        migrator = _migrator;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(_feeToSetter != address(0), "_feeToSetter address cannot be 0");
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) public override view returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }


        // calculates the CREATE2 address for a pair without making any external calls
    function pairFor( address tokenA, address tokenB) public override view returns (address pair) {
        return getPair[tokenA][tokenB];

    }


      // fetches and sorts the reserves for a pair
    function getReserves(address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pairFor(tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(address pair,uint amountIn, uint reserveIn, uint reserveOut) public view override returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        IFeeCalcutor calc = pairFeeCalculators[pair];
        if(address(calc)==address(0x0)){
            uint amountInWithFee = amountIn.mul(9975);//997-->998
            uint numerator = amountInWithFee.mul(reserveOut);
            uint denominator = reserveIn.mul(10000).add(amountInWithFee);
            amountOut = numerator / denominator;
        }else{
            return calc.getAmountOut(pair,amountIn,reserveIn,reserveOut);
        }
    }
    

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(address pair,uint amountOut, uint reserveIn, uint reserveOut)   public view override returns (uint amountIn) {
        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        IFeeCalcutor calc = pairFeeCalculators[pair];
        if(address(calc)==address(0x0)){
            uint numerator = reserveIn.mul(amountOut).mul(10000);
            uint denominator = reserveOut.sub(amountOut).mul(9975);//997-->998
            amountIn = (numerator / denominator).add(1);
        }else{
            return calc.getAmountIn(pair,amountOut,reserveIn,reserveOut);
        }
    }

    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(address pair,uint amountIn, address[] memory path)  public view  override returns (uint[] memory amounts) {
        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves( path[i], path[i + 1]);
            amounts[i + 1] = getAmountOut(pair,amounts[i], reserveIn, reserveOut);
        }
    }

    // performs chained getAmountIn calculations on any number of pairs
    function getAmountsIn(address pair,uint amountOut, address[] memory path)  public view  override returns (uint[] memory amounts) {
        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves( path[i - 1], path[i]);
            amounts[i - 1] = getAmountIn(pair,amounts[i], reserveIn, reserveOut);
        }
    }

    

}
