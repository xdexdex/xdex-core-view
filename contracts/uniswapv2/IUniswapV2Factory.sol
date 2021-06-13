// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);


    function repurchaseTo() external view returns (address);

    function calcTotalFee(address pair,uint rootK,uint rootKLast,uint totalSupply) external view returns (uint256,address,uint256);
    
    function migrator() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;

    function setRepurchaseTo(address) external;
    function setFeeToSetter(address) external;
    function setMigrator(address) external;
    function rewardUpper(address ref,address token,uint256 uperFee,uint256 amount)external;
    function getReferAmount(address user, uint256 amount) external view returns (uint256 upperFeeReal,uint256 upperFeeTotal);

    function sortTokens(address tokenA, address tokenB) external view returns (address token0, address token1) ;

        // calculates the CREATE2 address for a pair without making any external calls
    function pairFor( address tokenA, address tokenB) external view returns (address pair) ;
    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(address pair,uint amountIn, uint reserveIn, uint reserveOut)  external view returns (uint amountOut) ;
    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(address pair,uint amountOut, uint reserveIn, uint reserveOut)  external view returns (uint amountIn);
    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(address pair, uint amountIn, address[] memory path)  external view returns (uint[] memory amounts) ;
    // performs chained getAmountIn calculations on any number of pairs
    function getAmountsIn(address pair, uint amountOut, address[] memory path)  external view returns (uint[] memory amounts);
}
interface IFeeCalcutor {
    function calcTotalFee(address pair,uint rootK,uint rootKLast,uint totalSupply) external view returns (uint256,uint256);
        // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(address pair,uint amountIn, uint reserveIn, uint reserveOut)  external view returns (uint amountOut) ;
    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(address pair,uint amountOut, uint reserveIn, uint reserveOut)  external view returns (uint amountIn);
    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(address pair, uint amountIn, address[] memory path)  external view returns (uint[] memory amounts) ;
    // performs chained getAmountIn calculations on any number of pairs
    function getAmountsIn(address pair, uint amountOut, address[] memory path)  external view returns (uint[] memory amounts);

}