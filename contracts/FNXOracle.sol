pragma solidity ^0.6.11;
pragma experimental ABIEncoderV2;

import "./interfaces/IBandOracleAggregator.sol";
import "./modules/Operator.sol";
import "./interfaces/IERC20.sol";
contract FNXOracle is Operator {
    IBandOracleAggregator internal aggregator;
    uint256 internal decimals = 1e10;
    mapping(uint256=>string) internal pricePairs;
    mapping(uint256 => uint256) private priceMap;
    
    constructor(IBandOracleAggregator _aggregator) public {
        aggregator = _aggregator;
    }
    function setIBandOracleAggregator(IBandOracleAggregator _aggregator) public onlyOwner{
        aggregator = _aggregator;
    }
    function setDecimals(uint256 newDecimals) public onlyOwner{
        decimals = newDecimals;
    }
        /**
      * @notice set price of an asset
      * @dev function to set price for an asset
      * @param asset Asset for which to set the price
      * @param pricePair the Asset's pricePair
      */    
    function setPriceBridge(address asset,string memory pricePair) public onlyOwner {
        pricePairs[uint256(asset)] = pricePair;

    }
    /**
      * @notice set price of an underlying
      * @dev function to set price for an underlying
      * @param underlying underlying for which to set the price
      * @param pricePair the underlying's pricePair
      */  
    function setUnderlyingPrice(uint256 underlying,string memory pricePair) public onlyOwner {
        require(underlying>0 , "underlying cannot be zero");
        pricePairs[underlying] = pricePair;

    }
    /**
  * @notice retrieves price of an asset
  * @dev function to get price for an asset
  * @param asset Asset for which to get the price
  * @return uint mantissa of asset price (scaled by 1e8) or zero if unset or contract paused
  */
    function getPrice(address asset) public view returns (uint256) {
        if(bytes(pricePairs[uint256(asset)]).length > 0){
            uint256 price = _getPrice(uint256(asset));
            if (asset != address(0)){
                IERC20 token = IERC20(asset);
                uint256 tokenDecimals = uint256(token.decimals());
                if (tokenDecimals < 18){
                    return price*(10**(18-tokenDecimals));  
                }else if (tokenDecimals > 18){
                    return price/(10**(18-tokenDecimals)); 
                }else{
                    return price;
                }
            }
            return price; 
        }else{
            return priceMap[uint256(asset)];
        }
    }
    function getUnderlyingPrice(uint256 underlying) public view returns (uint256) {
        if(bytes(pricePairs[underlying]).length > 0){
            return _getPrice(underlying);
        }else{
            return priceMap[underlying];
        }
        
    }
    function _getPrice(uint256 asset) internal view returns(uint256) {
        uint256[] memory rates;
        string[] memory pairs = new string[](1);
        pairs[0] = pricePairs[asset];
        rates = aggregator.getReferenceData(pairs);
        return rates[0]/decimals;
    }
        /**
      * @notice set price of an asset
      * @dev function to set price for an asset
      * @param asset Asset for which to set the price
      * @param price the Asset's price
      */    
    function setPrice(address asset,uint256 price) public onlyOperatorIndex(0) {
        priceMap[uint256(asset)] = price;

    }
    /**
      * @notice set price of an underlying
      * @dev function to set price for an underlying
      * @param underlying underlying for which to set the price
      * @param price the underlying's price
      */  
    function setUnderlyingPrice(uint256 underlying,uint256 price) public onlyOperatorIndex(0) {
        require(underlying>0 , "underlying cannot be zero");
        priceMap[underlying] = price;
    }
}