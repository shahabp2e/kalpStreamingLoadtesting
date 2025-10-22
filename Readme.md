
Amoy:0xb14b874789683B176AF878A08857b924F6422FE2
 
Ethsepolia:0xc40d0CC7Ef552b124fE5B32627Fede2A450c3e39
 
arbitrumSepolia:0xecB1a08416235216df428ea9d973aC8627Dd70ac
 
opSepolia:0xBb2F6a44C3a555CE6C651f800170Ef952E418e05
 
Contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// not yet verified , 0xb14b874789683B176AF878A08857b924F6422FE2
contract StreamingTesting {

    uint256 public a = 0;
    event IncCounter1(uint256);
    function incCounter1() public {
        a = a + 1;
        emit IncCounter1(a);
    }

    uint256 public b = 0;
    event IncCounter2(uint256);
    function incCounter2() public {
        b = b + 1;
        emit IncCounter2(b);
    }

    uint256 public c = 0;
    event IncCounter3(uint256);
    function incCounter3() public {
        c = c + 1;
        emit IncCounter3(c);
    }

    uint256 public d = 0;
    event IncCounter4(uint256);
    function incCounter4() public {
        d = d + 1;
        emit IncCounter4(d);
    }

    uint256 public e = 0;
    event IncCounter5(uint256);
    function incCounter5() public {
        e = e + 1;
        emit IncCounter5(e);
    }

    uint256 public f = 0;
    event IncCounter6(uint256);
    function incCounter6() public {
        f = f + 1;
        emit IncCounter6(f);
    }

    uint256 public g = 0;
    event IncCounter7(uint256);
    function incCounter7() public {
        g = g + 1;
        emit IncCounter7(g);
    }

    uint256 public h = 0;
    event IncCounter8(uint256);
    function incCounter8() public {
        h = h + 1;
        emit IncCounter8(h);
    }

    uint256 public i = 0;
    event IncCounter9(uint256);
    function incCounter9() public {
        i = i + 1;
        emit IncCounter9(i);
    }

    uint256 public j = 0;
    event IncCounter10(uint256);
    function incCounter10() public {
        j = j + 1;
        emit IncCounter10(j);
    }

    uint256 public k = 0;
    event IncCounter11(uint256);
    function incCounter11() public {
        k = k + 1;
        emit IncCounter11(k);
    }

    uint256 public l = 0;
    event IncCounter12(uint256);
    function incCounter12() public {
        l = l + 1;
        emit IncCounter12(l);
    }

}
 

curl --location 'http://143.110.186.152:3001/webhooks' \
--header 'Content-Type: application/json' \
--data '{
    "name": "aakash Streaming Load Testing Amoy 5",
    "contractAddress": "0xb14b874789683B176AF878A08857b924F6422FE2",
    "eventFilters": "regex",
    "eventsSignature": ["IncCounter5(uint256)"],
    "eventsReceiveUrl": "http://165.22.220.84:6005/amoy/dagRuns",
    "abiEncoded": "W3siYW5vbnltb3VzIjpmYWxzZSwiaW5wdXRzIjpbeyJpbmRleGVkIjpmYWxzZSwiaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwibmFtZSI6IkluY0NvdW50ZXIxIiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjEwIiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjExIiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjEyIiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjIiLCJ0eXBlIjoiZXZlbnQifSx7ImFub255bW91cyI6ZmFsc2UsImlucHV0cyI6W3siaW5kZXhlZCI6ZmFsc2UsImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sIm5hbWUiOiJJbmNDb3VudGVyMyIsInR5cGUiOiJldmVudCJ9LHsiYW5vbnltb3VzIjpmYWxzZSwiaW5wdXRzIjpbeyJpbmRleGVkIjpmYWxzZSwiaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwibmFtZSI6IkluY0NvdW50ZXI0IiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjUiLCJ0eXBlIjoiZXZlbnQifSx7ImFub255bW91cyI6ZmFsc2UsImlucHV0cyI6W3siaW5kZXhlZCI6ZmFsc2UsImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sIm5hbWUiOiJJbmNDb3VudGVyNiIsInR5cGUiOiJldmVudCJ9LHsiYW5vbnltb3VzIjpmYWxzZSwiaW5wdXRzIjpbeyJpbmRleGVkIjpmYWxzZSwiaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwibmFtZSI6IkluY0NvdW50ZXI3IiwidHlwZSI6ImV2ZW50In0seyJhbm9ueW1vdXMiOmZhbHNlLCJpbnB1dHMiOlt7ImluZGV4ZWQiOmZhbHNlLCJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiSW5jQ291bnRlcjgiLCJ0eXBlIjoiZXZlbnQifSx7ImFub255bW91cyI6ZmFsc2UsImlucHV0cyI6W3siaW5kZXhlZCI6ZmFsc2UsImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sIm5hbWUiOiJJbmNDb3VudGVyOSIsInR5cGUiOiJldmVudCJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImEiLCJvdXRwdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJzdGF0ZU11dGFiaWxpdHkiOiJ2aWV3IiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiYiIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJjIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwic3RhdGVNdXRhYmlsaXR5IjoidmlldyIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImQiLCJvdXRwdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJzdGF0ZU11dGFiaWxpdHkiOiJ2aWV3IiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiZSIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJmIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwic3RhdGVNdXRhYmlsaXR5IjoidmlldyIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImciLCJvdXRwdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJzdGF0ZU11dGFiaWxpdHkiOiJ2aWV3IiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiaCIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJpIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwic3RhdGVNdXRhYmlsaXR5IjoidmlldyIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImluY0NvdW50ZXIxIiwib3V0cHV0cyI6W10sInN0YXRlTXV0YWJpbGl0eSI6Im5vbnBheWFibGUiLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJpbmNDb3VudGVyMTAiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImluY0NvdW50ZXIxMSIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiaW5jQ291bnRlcjEyIiwib3V0cHV0cyI6W10sInN0YXRlTXV0YWJpbGl0eSI6Im5vbnBheWFibGUiLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJpbmNDb3VudGVyMiIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiaW5jQ291bnRlcjMiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImluY0NvdW50ZXI0Iiwib3V0cHV0cyI6W10sInN0YXRlTXV0YWJpbGl0eSI6Im5vbnBheWFibGUiLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJpbmNDb3VudGVyNSIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiaW5jQ291bnRlcjYiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImluY0NvdW50ZXI3Iiwib3V0cHV0cyI6W10sInN0YXRlTXV0YWJpbGl0eSI6Im5vbnBheWFibGUiLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJpbmNDb3VudGVyOCIsIm91dHB1dHMiOltdLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiaW5jQ291bnRlcjkiLCJvdXRwdXRzIjpbXSwic3RhdGVNdXRhYmlsaXR5Ijoibm9ucGF5YWJsZSIsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbXSwibmFtZSI6ImoiLCJvdXRwdXRzIjpbeyJpbnRlcm5hbFR5cGUiOiJ1aW50MjU2IiwibmFtZSI6IiIsInR5cGUiOiJ1aW50MjU2In1dLCJzdGF0ZU11dGFiaWxpdHkiOiJ2aWV3IiwidHlwZSI6ImZ1bmN0aW9uIn0seyJpbnB1dHMiOltdLCJuYW1lIjoiayIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6InVpbnQyNTYiLCJuYW1lIjoiIiwidHlwZSI6InVpbnQyNTYifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImlucHV0cyI6W10sIm5hbWUiOiJsIiwib3V0cHV0cyI6W3siaW50ZXJuYWxUeXBlIjoidWludDI1NiIsIm5hbWUiOiIiLCJ0eXBlIjoidWludDI1NiJ9XSwic3RhdGVNdXRhYmlsaXR5IjoidmlldyIsInR5cGUiOiJmdW5jdGlvbiJ9XQ==",
    "secret": "Basic YWRtaW46YWRtaW4=",
    "rpcURL": "https://mainnet.infura.io/v3/your-project-id",
    "chainId": "80002"
}'

- 0xb14b874789683B176AF878A08857b924F6422FE2 'amoy'
- 0xc40d0CC7Ef552b124fE5B32627Fede2A450c3e39 'sepolia'
- 0xecB1a08416235216df428ea9d973aC8627Dd70ac 'arbitrum'
- 0xBb2F6a44C3a555CE6C651f800170Ef952E418e05 'op sepolia'
- 0x084eB9dbC37CA0968C24B21F82d7cC0d09dE1ee3 'avalanche fuji'
 
 
Response for Increment1: "subscriptionId":"429cabd7-98a9-4986-8904-84886dc65cb7"
 
Response for Increment2:"subscriptionId":"bb38be35-62d9-4ccc-aa0a-72a7c3562516"

Response for Increment3:"subscriptionId":"68baf237-16c9-433b-a584-17d823d33611"

Response for Increment4:"subscriptionId":"a5294864-2c13-45d6-943d-93564525930b"

Response for Increment5:"subscriptionId":"f8a40303-2082-4262-b487-50f0c4c165e6"

Response for Increment6:"subscriptionId":"f51f3300-cdb0-434e-9055-f0da8611d2c3"

Response for Increment7:"subscriptionId":"8f5b5c49-afe8-4aaf-925b-a514aebf5cad"

Response for Increment8:"subscriptionId":"00b2c316-ce6a-4f5d-9419-4402eee6f6f4"

Response for Increment9:"subscriptionId":"5c93d66f-aa00-4c8c-b201-0f7950154a51"

Response for Increment10:"subscriptionId":"ff931607-8e34-499f-9307-2be65248980e"


name and eventSignature and url needs to be changed for 80002 for IncCounter2, IncCounter3, IncCounter4 .. IncCounter10 

fuji



