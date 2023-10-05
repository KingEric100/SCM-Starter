// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract website {
     bool public loggedIn;

    function login() public{
        loggedIn = true;
   }

   function logout() public {
    loggedIn = false; 
   }

}

