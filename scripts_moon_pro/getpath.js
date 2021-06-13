




function findPath(existNode,tokenTo,tokenEnd,pairs,paths){

    pairs.forEach( pair => {
        // if(!existPath.includes(pair.)){
            // var lastStep = existPath[existPath.length-1];
            var checkPath=existNode.slice(0,existNode.length);
            if(pair.token0==tokenTo&&!checkPath.includes(pair.token1)){
                checkPath.push(pair.token1);
                if(tokenEnd==pair.token1){
                    // console.log("find path :"+JSON.stringify(checkPath));
                    paths.push(checkPath);
                    return true;
                }
                return findPath(checkPath,pair.token1,tokenEnd,pairs,paths);
            }else if(pair.token1==tokenTo&&!checkPath.includes(pair.token0)){
                checkPath.push(pair.token0);
                if(tokenEnd==pair.token0){
                    // console.log("find path :"+JSON.stringify(checkPath));
                    paths.push(checkPath);
                    return true;
                }
                return findPath(checkPath,pair.token0,tokenEnd,pairs,paths);
            }
        // }
	})
    return false;

}
//token是经过排序的,
function sortPairs(pairs){
    var sortPairs = [];
    pairs.forEach( pair => {
		if(pair.token0>pair.token1){
			sortPairs.push({"token0":pair.token1,"token1":pair.token0,"reserve0":pair.reserve1,"reserve1":pair.reserve0});
		}
		else if(pair.token0<pair.token1){
			sortPairs.push({"token0":pair.token0,"token1":pair.token1,"reserve0":pair.reserve0,"reserve1":pair.reserve1});
		}
	})
    return sortPairs;
}
function calcPossiblePath(tokenBegin,tokenEnd,pairs){

	var startNodes=[];
    var paths=[];
    // pairs = sortPairs(pairs);

	pairs.forEach( pair => {
		if(pair.token0==tokenBegin&&pair.token1==tokenEnd){
			paths.push([pair.token0,pair.token1]);
		}
		else if(pair.token0==tokenBegin){
			startNodes.push(pair);
		}
	})
    
	startNodes.forEach((step0,idx)=>{
        // console.log(idx+":"+step0.token0+"==>"+step0.token1);
        var existNode=[tokenBegin];
        existNode.push(step0.token1);
        findPath(existNode,step0.token1,tokenEnd,pairs,paths);
	})

    return paths;
}

 function getAmountOut( amountIn,  reserveIn,  reserveOut){
    var amountInWithFee = amountIn*9975;
    var numerator = amountInWithFee*reserveOut;
    var denominator = reserveIn*10000+amountInWithFee;
    var amountOut = numerator / denominator;
    return amountOut;
}

function calcPairAmountOut(tokenIn,amountIn,pair){
    if(tokenIn == pair.token0){
        return getAmountOut(amountIn,pair.reserve0,pair.reserve1);
    }
    if(tokenIn == pair.token1){
        return getAmountOut(amountIn,pair.reserve1,pair.reserve0);
    }
    return -1;
}

function getPair(tokenA,tokenB,pairs){
    for(var i=0;i<pairs.length;i++){
        var pair = pairs[i];
        if(pair.token0==tokenA&&pair.token1==tokenB){
            return  pair;
        }
        if(pair.token0==tokenB&&pair.token1==tokenA){
            return pair;
        }
    }
    console.log("cannot found pair:",tokenA,tokenB);
    return undefined;
}

function getAmountsOut(amountIn,path,pairs){
    var amounts = [];
    amounts.push(amountIn);
    var amountOut = amountIn;
    for (var i = 0; i < path.length - 1; i++) {
        // (uint reserveIn, uint reserveOut) = getReserves(path[i], path[i + 1],pairs);
        var pair = getPair(path[i], path[i + 1],pairs);
        amountOut =  calcPairAmountOut(path[i],amounts[i], pair);
        if(amountOut<0)
        {
            return -1;
        }
        amounts.push(amountOut);
    }
    return amountOut;
}


function getAmountIn( amountOut,  reserveIn,  reserveOut){
    var numerator = reserveIn * amountOut * 10000;
    var denominator = (reserveOut-amountOut) * 9975;//997-->998
    amountIn = (numerator / denominator)+1;
    return amountIn;
}

function calcPairAmountIn(tokenOut,amountOut,pair){
    if(tokenOut == pair.token1){
        return getAmountIn(amountOut,pair.reserve0,pair.reserve1);
    }
    if(tokenOut == pair.token0){
        return getAmountIn(amountOut,pair.reserve1,pair.reserve0);
    }
    return -1;
}
function getAmountsIn(amountOut,path,pairs){
    var amounts = [];
    var amountIn = amounts[path.length - 1] = amountOut;
    for (var i = path.length - 1; i > 0; i--) {
        // (uint reserveIn, uint reserveOut) = getReserves(factory, path[i - 1], path[i]);
        var pair = getPair(path[i - 1], path[i],pairs);
        amountIn = calcPairAmountIn(path[i],amounts[i], pair);
        if(amountIn<0)
        {
            return -1;
        }
        amounts[i - 1] = amountIn;
    }
    return amountIn;
}

function quote( amountA, reserveA, reserveB) {
    return amountA * reserveB / reserveA;
}

function getMaxAmountOutPath(tokenBegin,tokenEnd,pairs,amountIn){
    var paths=calcPossiblePath(tokenBegin,tokenEnd,pairs);
    var maxOutputPath = [];
    var maxOutput = 0;
    if(!amountIn){
        amountIn = 100;
    }
    paths.forEach(path=>{
        var amountOut = getAmountsOut(amountIn,path,pairs);
        if(maxOutputPath.length==0){
            maxOutputPath = path;
            maxOutput = amountOut;
        }
        else if(amountOut>maxOutput){
            maxOutput = amountOut;
            maxOutputPath = path;
        }
        console.log("calcPathAmountout = "+amountOut+",path="+JSON.stringify(path));
    })
    return maxOutputPath;
}

function getShortPath(tokenBegin,tokenEnd,pairs){
    var paths=calcPossiblePath(tokenBegin,tokenEnd,pairs);
    var shortPath = [];
    paths.forEach(path=>{
        if(shortPath.length==0||shortPath.length>path.length){
            shortPath = path;
        }
    })
    return shortPath;
}




var pairs = [
	// {"token0":"0x01","token1":"0x02","reserve0":4587853815281367,"reserve1":27040315708223173583523},
    {"token0":"0x01","token1":"0x02","reserve0":100,"reserve1":100},
	{"token0":"0x02","token1":"0x03","reserve0":100,"reserve1":100},
	{"token0":"0x01","token1":"0x03","reserve0":100,"reserve1":400},
	{"token0":"0x03","token1":"0x04","reserve0":100,"reserve1":200},
	{"token0":"0x03","token1":"0x05","reserve0":100,"reserve1":200},
    {"token0":"0x04","token1":"0x06","reserve0":100,"reserve1":200},
	{"token0":"0x05","token1":"0x06","reserve0":100,"reserve1":500},
    
];

//先根据token名字排序
pairs = sortPairs(pairs);

//计算所有路径
calcPossiblePath("0x01","0x06",pairs);

//寻找最短路径
getShortPath("0x01","0x06",pairs)


//寻找最大输出路径
getMaxAmountOutPath("0x01","0x06",pairs)
