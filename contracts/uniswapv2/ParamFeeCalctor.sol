// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.6.12;

import './interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';
import './libraries/Math.sol';
import './interfaces/IUniswapV2Pair.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParamFeeCalctor is IFeeCalcutor ,Ownable{
    using SafeMathUniswap  for uint256;

    struct FeeParams{
        uint256  feeTotal;
        uint256  feeBase;
        uint256  sita;
        uint256  repurchase;
    }

    mapping(address => FeeParams) public pairFeeParams;
    address public factory;
    constructor(address _factory) public {
        factory = _factory;
    }

    function setPairParams(address pair,uint256 _feeTotal,uint256 _feeBase,uint256 _sita,uint256 _repurchase) public onlyOwner{
       FeeParams storage fp=pairFeeParams[pair];
       fp.feeTotal = _feeTotal;
       fp.feeBase = _feeBase;
       fp.sita = _sita;
       fp.repurchase = _repurchase;
    }


    function calcTotalFee(address pair,uint rootK,uint rootKLast,uint totalSupply) external override view returns (uint256 liquidity,uint256 repurchaseAmount)
    {
        FeeParams storage fp=pairFeeParams[pair];
        if(fp.feeTotal>0){
            uint numerator = totalSupply.mul(rootK.sub(rootKLast));
            // uint denominator = rootK.mul(2).add(rootKLast);
            uint denominator = rootK.wdiv(fp.feeBase).wmul(fp.sita).add(rootKLast);
            liquidity = numerator / denominator;
            if (liquidity > 0) {
                repurchaseAmount = liquidity.wdiv(fp.feeBase).wmul(fp.repurchase);
            }
        }
    }

      // fetches and sorts the reserves for a pair
    function getReserves(address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = IUniswapV2Factory(factory).sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(IUniswapV2Factory(factory).pairFor(tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(address pair,uint amountIn, uint reserveIn, uint reserveOut) public view override returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        FeeParams storage fp=pairFeeParams[pair];
        if(fp.feeTotal>0){
            uint amountInWithFee = amountIn.mul(fp.feeTotal);//997-->998
            uint numerator = amountInWithFee.mul(reserveOut);
            uint denominator = reserveIn.mul(fp.feeBase).add(amountInWithFee);
            amountOut = numerator / denominator;
        }else{
            uint amountInWithFee = amountIn.mul(9975);//997-->998
            uint numerator = amountInWithFee.mul(reserveOut);
            uint denominator = reserveIn.mul(10000).add(amountInWithFee);
            amountOut = numerator / denominator;

        }
    }
    

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(address pair,uint amountOut, uint reserveIn, uint reserveOut)   public view override returns (uint amountIn) {
        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        FeeParams storage fp=pairFeeParams[pair];
        if(fp.feeTotal>0){
            uint numerator = reserveIn.mul(amountOut).mul(fp.feeBase);
            uint denominator = reserveOut.sub(amountOut).mul(fp.feeTotal);//997-->998
            amountIn = (numerator / denominator).add(1);
        }else{
            uint numerator = reserveIn.mul(amountOut).mul(10000);
            uint denominator = reserveOut.sub(amountOut).mul(9975);//997-->998
            amountIn = (numerator / denominator).add(1);
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
