# Prize-Bond
> Prize Bond Admin Dashboard 

![preview](packages/prizebond-adminfrontend/public/assets/preview.png)
## Developed By

- [@OPTIMUSFOX](https://www.github.com/OptimusFoxPvt)
## What is this project?
We have created a decentralized redeemable, ever lasting, prize bond system. This system will use Ethereum as a form of money.

In this system, a user can buy a prize bond which the user will own on their own address. The user can redeem their own prize bond to get back the amount of money the prize bond is worth.

If the user wishes to wait for the lottery to be drawn. they can. The lottery will have 3 winners and there will be 3 different prizes, 1st prize, 2nd prize and 3rd prize. winners can redeem their prizes whenever they want. The winners are generated totally randomly.

## Why we used ERC1155?
We chose the openzeppelin ERC1155 standard for creating a prize bond for our project due to its ability to create multiple copies of a same token. It is a Non fungible token.


Since, in ERC1155, we have an ID of a NFT which points to another mapping and in that mapping we have an address pointing to uint. Similarly, in our prize bond contract, we have a mapping which is the ID of the prize bond, and which points to another mapping where the key is the number of copies and that copy points to a struct where we have stored the details of the owner.

## Functions Descriptions
### buyPB()
In this function, the user will enter the name of the prize bond they want to buy, for example, 500, then simultaneously they will have to send the contract 500 wei or the required amount set by the Owner of the contract to buy the prize bond.

### claimRewards()
This function takes in the prize bond amount and the number of draw they won in. Then, if the user has actually won the prize bond, they will get the amount of wei they won transferred in their account.

### redeem()
 This function takes in the prize bond amount and the bondId which the user must know in order to redeem their prize bond. Then, the prize bond will be transferred to the contract and the user will get the amount transferred back in to their account.

### setWinningAmount() 
The purpose of this function is to start the prize bond. Only the owner of this contract can call this function, BondPrize, drawNumber, WinningAmount1, WinningAmount2, and WinningAmount3. These arguments will be stored in a mapping for further and future use.

