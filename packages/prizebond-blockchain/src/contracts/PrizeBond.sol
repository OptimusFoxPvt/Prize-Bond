// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "./PrizeBondToken.sol";
import "hardhat/console.sol";
/*
    @ Prize Bond System.
*/
contract PrizeBond is PrizeBondToken {
    /////////////////////////////////////////////////////////////////////////
    /// State Variables
    /////////////////////////////////////////////////////////////////////////
    /* wins array for tracking Draw numbers. 
    they are used to keep track of the number of wins, the number of draws that has occured. 
    */
    /////////////////////////////////////////////////////////////////////////
    /// Structs
    /////////////////////////////////////////////////////////////////////////
    /*user struct contains information about who owns the prize bond.
    Information such as the address of the owner of the prize bond.
    The ID of the prize bond.
    and the amount of the bond. 
    */
    struct user {
        address userAddress;
        uint256 bondId;
        uint256 bondSeries;
        uint256 bondAmount;
    }
    /*
    DrawWinners struct contains information about who is the winner of the draw.
    Draw can be 1,2,3... and each draw will have 3 winners. 
    winner1 will get 1st prize
    winner2 will have 2nd prize
    winner3 will have 3rd prize
    similarly we have 3 bools for three winners. these bools will act as flags so that a person
    who has claimed their winnings cannot claim again because the bool/flag will be raised.
    */
    struct DrawWinners {
        address winner1;
        address winner2;
        address winner3;
        bool drawstatus;
        bool[3] isTrue;
    }
    struct _setPB {
        uint256 prizeBondType;
        uint256 totalDraw;
        uint256 winningAmount1;
        uint256 winningAmount2;
        uint256 winningAmount3;
        uint256 drawnumber;
        uint256 maxSupply;
        uint256 bondSeries;
        uint256 count;
    }
    /*
    WinningAmount struct contains information about the prizes of the prize bond.
    suppose we have to start a prize bond, we will set the first prize, second prize, and third prize here.
    Also, we will raise the bool/flag to true so that once set, owner cannot set again. 
    */
    /////////////////////////////////////////////////////////////////////////
    // Mappings
    /////////////////////////////////////////////////////////////////////////
    //Pointing the Prize Bond ID to an array of uint which will contain the redeemed bonds.
    mapping(uint256 => mapping(uint256 => uint256[])) private _redeemedBonds;
    //Pointing the Prize Bond ID to another mapping where the number of copies is pointing to the user struct.
    mapping(uint256 => mapping(uint256 => user)) private _prizeBond;
    //Pointing the prize bond ID to another mapping where the draw number is pointing to the DrawWinners mapping.
    mapping(uint256 => mapping(uint256 => mapping(uint256 => DrawWinners ))) private _winners;
    //Pointing the Prize Bond ID to the total supply of a specific price bond copy that can be minted
    mapping(uint256 => uint256) private _maxSupplyPB;
    /////////////////////////////////////////////////////////////////////////
    mapping (uint256 => mapping (uint256 => _setPB)) private _setpb;
    //events
    /////////////////////////////////////////////////////////////////////////
    event PrizeBondAdded(
        uint256 prizeBondType,
        uint256 bondSeries,
        uint256 totalDraw,
        uint256 winningAmount1,
        uint256 winningAmount2,
        uint256 winningAmount3
    );
    event BuyPrizeBond(
        address indexed prizebondOwner,
        uint256 prizeBondType,
        uint256 bonndSeries,
        uint256 _redeemedId,
        uint256 totalcount,
        uint256 bondId
    );
    event Draw(
        uint256 prizeBondType,
        uint256 bondSeries,
        uint256 drawNumer,
        uint256 WinnerId1,
        uint256 WinnerId2,
        uint256 WinnerId3,
        address indexed winner1,
        address indexed winner2,
        address indexed winner3
    );
    event Claimreward(
        address indexed prizebondclaimer,
        uint256 prizeBondType,
        uint256 bondSeries,
        uint256 drawNumber,
        uint256 prizeCalimed
    );
    event Redeemed(
        address indexed prizebondOwner,
        uint256 prizeBondType,
        uint256 bondId
    );
    event SetWinning(
        uint256 prizeBondType,
        uint256 bondSeries,
        uint256 price1,
        uint256 price2,
        uint256 price3
    );
    /////////////////////////////////////////////////////////////////////////
    /// AddPB
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: Allows the onwer to add the prize bond id or price
     * Requirements:
     *
     * - Owner can only add the prize bond id
     * - If the admin wishes to add the 500 prize bond id then the user must deposit 500 wei to get that prize bond and vice versa
     * @param: _prizeBondType: the amount of Prize bond admin wants to add such as 500,700, or 1000
     * @param: _totalDraw: the number of draws that can be done, it will be on monthly basis such as 12 input means it will be for 1 year
     */
    function setPB(
        uint256 _prizeBondType,
        uint256 _totalDraw,
        uint256 _winningAmount1,
        uint256 _winningAmount2,
        uint256 _winningAmount3,
        uint256 _maxSupply,
        uint256 _bondSeries
    ) public onlyOwner {
        require( (_setpb[_prizeBondType][_bondSeries].prizeBondType !=  _prizeBondType) &&  _setpb[_prizeBondType][_bondSeries].bondSeries != _bondSeries, "This Series is Already Added");
        uint _drawnumber = 0;
        _setpb[_prizeBondType][_bondSeries]= _setPB( 
        _prizeBondType,
        _totalDraw,
        _winningAmount1,
        _winningAmount2,
        _winningAmount3,
         _drawnumber,
         _maxSupply,
         _bondSeries,
         0);
        emit PrizeBondAdded(
            _prizeBondType,
            _bondSeries,
            _totalDraw,
            _winningAmount1,
            _winningAmount2,
            _winningAmount3
        );
    }
    function getAddedPb(uint256 _bondtype, uint256 _bondSeries) public view onlyOwner returns(_setPB memory) {
        return _setpb[_bondtype][_bondSeries];
    }
    function getWinners(uint256 _bondtype, uint256 _bondSeries,uint256 _drawnumber) public view returns(DrawWinners memory) {
        return _winners[_bondtype][_bondSeries][_drawnumber];
    }
    function gettotalbonds(uint256 _bondtype) public view returns(uint256){
        return totalSupply(_bondtype);
    }
    function _buyPB(
        address _owner,
        uint256 _Bondtype,
        uint256 _bondSeries,
        uint256 _redeemedId,
        uint256 _bondId
    ) internal virtual {
         uint256 totalcount = _setpb[_Bondtype][_bondSeries].count;
        if (_redeemedId > 0) {
            _redeemedId--;
            _bondId = _redeemedBonds[_Bondtype][_bondSeries][_redeemedId];
            _safeTransferFrom(
                address(this),
                _msgSender(),
                _Bondtype,
                1,
                "0x0"
            );
            _prizeBond[_Bondtype][_bondId] = user(
                _msgSender(),
                _bondId,
                _bondSeries,
                _Bondtype
            );
            payable(_owner).transfer(msg.value);
            _redeemedBonds[_Bondtype][_bondSeries].pop();
        } else {
            require(
                totalcount + 1 <= _setpb[_Bondtype][_bondSeries].maxSupply,
                "Supply limit exceed"
            );
            _bondId = _bondId + totalcount;
            _mint(_msgSender(), _Bondtype, 1, " ");
                _prizeBond[_Bondtype][_bondId] = user(
                _msgSender(),
                _bondId,
                _bondSeries,
                _Bondtype
            );
            console.log("total count",  _bondId);
            payable(_owner).transfer(msg.value);
            _setpb[_Bondtype][_bondSeries].count++;
            totalcount++;
             // _setpb[_Bondtype].bondSeries++;
        }
        emit BuyPrizeBond(
            _msgSender(),
            _Bondtype,
            _bondSeries,
            _redeemedId,
            totalcount,
            _bondId
        );
    }
    function getbuyPB(uint256 _bondtype, uint _bondid) public view returns(user memory) {
        return _prizeBond[_bondtype][_bondid];
    }
    /////////////////////////////////////////////////////////////////////////
    /// BuyPB
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: Allows the user to buy the prize bond
     * Requirements:
     *
     * - Owner can not buy the prize bond
     * - If the user wishes to buy the 500 prize bond. The user must deposit 500 wei
     * - If the user wishes to buy the 700 prize bond. The user must deposit 700 wei
     * - If the user wishes to buy the 1000 prize bond. The user must deposit 1000 wei
     * - The supply limit must not go beyond 100
     * @param: _BondPrize: the amount of Prize bond user wants to buy such as 500,700, or 1000
     */
    function buyPB(uint256 _Bondtype, uint256 _bondSeries) public payable {
        require(_setpb[_Bondtype][_bondSeries].bondSeries == _bondSeries, "This Prize Bond with this series is not issued Yet");
        require(msg.value == _Bondtype, "Invalid Price ");
        address _owner = owner();
        require(_msgSender() != _owner, "Owner can't buy Bond");
        //uint256 totalcount = totalSupply(_Bondtype);
        uint256 _redeemedId = _redeemedBonds[_Bondtype][_bondSeries].length;  
        uint256 _bondId=_setpb[_Bondtype][_bondSeries].bondSeries;
        _buyPB(_owner, _Bondtype, _bondSeries ,_redeemedId, _bondId);
    }
   /////////////////////////////////////////////////////////////////////////
    /// random
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: generates a random number for the specfic prize bonds
     * @param: None
     * @returns: 3 numbers that will be within the range of specific bond prize bond that are sold.
     */
    function _random(uint256 _bondType, uint256 _bondseries)
        internal
        view
        returns (
            uint256 random1,
            uint256 random2,
            uint256 random3
        )
    {
        uint256 bondSupply = _setpb[_bondType][_bondseries].count;
        uint256 _bondId =_setpb[_bondType][_bondseries].bondSeries;
        random1 =uint256(keccak256(abi.encodePacked(block.timestamp +1 ,block.difficulty + 1,_msgSender() ))) % bondSupply;
        random2 =uint256(keccak256(abi.encodePacked(block.timestamp + 5,block.difficulty + 4,_msgSender() ))) %bondSupply;
        random3 =uint256(keccak256(abi.encodePacked(block.timestamp+5, block.difficulty + 5,_msgSender())))%bondSupply;
        console.log("random1",random1);
        console.log("random2",random2);
        console.log("random3",random3);
        console.log("winner 1",random1+_bondId);
        console.log("winner 2",random2 +_bondId);
        console.log("winner 3",random3+ _bondId);
        return (random1 + _bondId , random2 + _bondId, random3 + _bondId);
    }
    /////////////////////////////////////////////////////////////////////////
    /// draw
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: Draws any prize bond type. Only the owner can draw. The owner must deposit the winning amount to the contract.
     * Requirements:
     *
     * - Only Owner can call this function
     * - The owner must also deposit the prize money
     * @param: None
     */
    function luckyDraw(uint256 _bondType,uint256 _bondSeries )
        public
        payable
        onlyOwner
    {
        address _owner = owner();
        _setpb[_bondType][_bondSeries].drawnumber +=1;
        _setPB memory _price = _setpb[_bondType][_bondSeries];
        uint256 Drawnumber = _price.drawnumber;
        require( Drawnumber <= _price.totalDraw, " Maximum draw limit exceed");
       (uint256 prize1, uint256 prize2, uint256 prize3) = (_price.winningAmount1 ,_price.winningAmount2, _price.winningAmount3);
        uint256 priceamount = prize1 +   prize2 + prize3;
        require(msg.value == priceamount, "You must deposit the Total prize money");
        uint256 bondtype = _bondType;
        uint256 bondseries = _bondSeries;
        uint256 _Drawnumber = _price.drawnumber;
        (uint256 random1, uint256 random2, uint256 random3) = _random(bondtype, bondseries);
        setWinnersaddress(bondtype,bondseries,Drawnumber );
        DrawWinners memory _Winners = _winners[bondtype][bondseries][Drawnumber];
        if (_Winners.winner1 == address(this)) {
            payable(_owner).transfer(prize1);
        }
        if (_Winners.winner2 == address(this)) {
            payable(_owner).transfer(prize2);
        }
        if (_Winners.winner3 == address(this)) {
            payable(_owner).transfer(prize3);
        }
        _winners[bondtype][bondseries][Drawnumber].drawstatus = true;
        emit Draw(bondtype,bondseries,_Drawnumber,random1,random2,random3,_Winners.winner1,_Winners.winner2 ,_Winners.winner3);
    }
    function setWinnersaddress(uint256 _bondType,uint256 _bondSeries,uint256 _drawnumber) internal {
        (uint256 random1, uint256 random2, uint256 random3) = _random(_bondType, _bondSeries);
         _winners[_bondType][_bondSeries][_drawnumber].winner1 = _prizeBond[_bondType][
            random1
        ].userAddress;
        _winners[_bondType][_bondSeries][_drawnumber].winner2 = _prizeBond[_bondType][
            random2
        ].userAddress;
        _winners[_bondType][_bondSeries][_drawnumber].winner3 = _prizeBond[_bondType][
            random3
        ].userAddress;
    }
    /////////////////////////////////////////////////////////////////////////
    /// claimRewards
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: the winner of the draw can claim their winnings.
     * @param: _BondPrize: the winner must enter the prize bond ID
     * @param: wins: the winner must enter the draw number is which they won
     */
    function claimRewards(uint256 _bondtype, uint256 _bondSeries, uint256 _drawnumber) public {
        DrawWinners memory _withdrawwinner = _winners[_bondtype][_bondSeries][_drawnumber];
        _setPB memory _price = _setpb[_bondtype][_bondSeries];
        require(_price.drawnumber == _drawnumber, "Draw ID invalid");
        require(
            _withdrawwinner.drawstatus == true,
            "This draw is not Drawn Yet!"
        );
        (uint256 prize1,uint256 prize2,uint256 prize3) = (_price.winningAmount1,_price.winningAmount2,_price.winningAmount3);
        require(
                (_msgSender() == _withdrawwinner.winner1 ||
                _msgSender() == _withdrawwinner.winner2 ||
                _msgSender() == _withdrawwinner.winner3),
            "You are not the Winner"
        );
        if (_msgSender() == _withdrawwinner.winner1) {
            require(
                _withdrawwinner.isTrue[0] == false,
                "You have already claimed your reward"
            );
            _winners[_bondtype][_bondSeries][_drawnumber].isTrue[0]= true;
            payable(_msgSender()).transfer(prize1);
            emit Claimreward(_msgSender(),_bondSeries, _bondtype, _drawnumber, prize1);
        }
        if (_msgSender() == _withdrawwinner.winner2) {
            require(
                _withdrawwinner.isTrue[1] == false,
                "You have already claimed your reward"
            );
            _winners[_bondtype][_bondSeries][_drawnumber].isTrue[1] = true;
            payable(_msgSender()).transfer(prize2);
            emit Claimreward(_msgSender(),_bondSeries, _bondtype, _drawnumber, prize2);
        }
        if (_msgSender() == _withdrawwinner.winner3) {
            require(
                _withdrawwinner.isTrue[2] == false,
                "You have already claimed your reward"
            );
            _winners[_bondtype][_bondSeries][_drawnumber].isTrue[2] = true;
            payable(_msgSender()).transfer(prize3);
            emit Claimreward(_msgSender(),_bondSeries,_bondtype, _drawnumber, prize3);
        }
    }
     /////////////////////////////////////////////////////////////////////////
    /// redeem
    /////////////////////////////////////////////////////////////////////////
    /*
     * @dev: The user can redeem their prize bonds and get the same amount back.
     * Requirements:
     *
     * - Only the bond owner can call this function
     * - The user must enter the existing bond Price such as 500, 700, 1000
     * - The user must enter the valid bond ID
     * @param: _BondPrize: the winner must enter the prize bond
     * @param: _BondId: the winner must enter the prize bond ID
     */
    function redeem(uint256 _Bondtype,uint256 _bondSeries,uint256 _BondId) public {
        address bondOwner = _prizeBond[_Bondtype][_BondId].userAddress;
        require(_msgSender() == bondOwner);
        uint256 bondPrize = _prizeBond[_Bondtype][_BondId].bondAmount;
        require(bondPrize == _Bondtype, "invalid Bond Price");
     //   require(bondOwner==_prizeBond[_Bondtype][_BondId].userAddress,"you are not the bond owner");
        uint256 bondId = _prizeBond[_Bondtype][_BondId].bondId;
        require(bondId == _BondId, "Invaild Bond Id ");
        _safeTransferFrom(_msgSender(), address(this), _Bondtype, 1, "0x0");
        _prizeBond[_Bondtype][_BondId].userAddress = address(this);
        _redeemedBonds[_Bondtype][_bondSeries].push(_BondId);
        emit Redeemed(_msgSender(), _Bondtype, _BondId);
    }
    function getRedeemedIds(uint256 _bondType,uint256 _bondSeries) public view returns(uint256[] memory){
        return   _redeemedBonds[_bondType][_bondSeries];
    }
    function deposit() public payable onlyOwner {}
    function withdrawOwner() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}