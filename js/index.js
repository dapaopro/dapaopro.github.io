function showAirdrop() {
    $(".Airdrop").css("display", "flex");
    $(".Mint").css("display", "none");
    $(".Tab-Airdrop").css("color", "#FFFFFF");
    $(".Tab-Mint").css("color", "#BBBBBB");
}
function showMint() {
    $(".Mint").css("display", "flex");
    $(".Airdrop").css("display", "none");
    $(".Tab-Airdrop").css("color", "#BBBBBB");
    $(".Tab-Mint").css("color", "#FFFFFF");
    $(".nft-holder").text(NFTHolder);
    getInfo();
}

var myWallet = {

}

function connetWallet(cb) {
    if (!Web3.givenProvider) {
        showToast("未发现钱包");
        return;
    }
    const web3 = new Web3(Web3.givenProvider);
    web3.eth.getChainId().then((res, error) => {
        if (ChainId != res) {
            showToast(ChainIdError);
            return;
        }
        myWallet.chainId = res;
        web3.eth.requestAccounts().then((res, error) => {
            myWallet.account = res[0];
            if (cb) {
                cb();
            }
        });
    });
}

function claim() {
    if (!myWallet.account) {
        connetWallet(function () {
            _claim();
        });
        return;
    }
    _claim();
}

function _claim() {
    var receiver = $("#receiver").val();
    if (!receiver) {
        showToast("请输入领取地址");
        return;
    }
    showLoading();
    const web3 = new Web3(Web3.givenProvider);
    var claimContract = new web3.eth.Contract(Claim_Abi, ClaimContract);
    claimContract.methods.claim(receiver).send({ from: myWallet.account }, function (error, res) {
        hideLoading();
        console.log("error", error);
        if (error) {
            showToast(error.message);
            return;
        }
        showToast("领取成功");
        console.log("res", res);
    });
}

function getInfo() {
    if (!myWallet.account) {
        connetWallet(function () {
            _getInfo();
        });
        return;
    }
    _getInfo();
}

function _getInfo() {
    balanceOf(ZeroAddress, function (balance) {
        $(".zero-balance").text(balance);
    });
    balanceOf(FinanceAddress, function (balance) {
        $(".finance-balance").text(balance);
    });
    balanceOf(NFTContract, function (balance) {
        $(".pool-balance").text(balance);
    });
    _getUserInfo();
}

function balanceOf(address, cb) {
    const web3 = new Web3(Web3.givenProvider);
    var tokenContract = new web3.eth.Contract(Claim_Abi, ClaimContract);
    tokenContract.methods.balanceOf(address).call(function (error, balance) {
        cb(parseShowBalance(balance));
    });
}

function parseShowBalance(balance) {
    return Web3.utils.fromWei(balance, "ether");
};

function _getUserInfo() {
    const web3 = new Web3(Web3.givenProvider);
    var nftContract = new web3.eth.Contract(NFT_Abi, NFTContract);
    nftContract.methods.getUserInfo(myWallet.account).call(function (error, userInfo) {
        console.log("userInfo", userInfo);
        // var pending = parseShowBalance(userInfo[7]);
        var pending = userInfo[7];
        $('.pending-reward').text(pending);
    });
}

function deposit() {
    if (!myWallet.account) {
        connetWallet(function () {
            _deposit();
        });
        return;
    }
    _deposit();
}

function _deposit() {
    var nftId = $("#nftId").val();
    if (!nftId) {
        showToast("请输入 NFT tokenId");
        return;
    }
    showLoading();
    const web3 = new Web3(Web3.givenProvider);
    var nftContract = new web3.eth.Contract(NFT_Abi, NFTContract);
    nftContract.methods.deposit(1, nftId).send({ from: myWallet.account }, function (error, res) {
        hideLoading();
        console.log("error", error);
        if (error) {
            showToast(error.message);
            return;
        }
        showToast("质押成功");
        getInfo();
    });
}

function cancel() {
    if (!myWallet.account) {
        connetWallet(function () {
            _cancel();
        });
        return;
    }
    _cancel();
}

function _cancel() {
    showLoading();
    const web3 = new Web3(Web3.givenProvider);
    var nftContract = new web3.eth.Contract(NFT_Abi, NFTContract);
    nftContract.methods.emWithdraw().send({ from: myWallet.account }, function (error, res) {
        hideLoading();
        console.log("error", error);
        if (error) {
            showToast(error.message);
            return;
        }
        showToast("已取消挖矿");
        getInfo();
    });
}

function harvest() {
    if (!myWallet.account) {
        connetWallet(function () {
            _harvest();
        });
        return;
    }
    _harvest();
}

function _harvest() {
    showLoading();
    const web3 = new Web3(Web3.givenProvider);
    var nftContract = new web3.eth.Contract(NFT_Abi, NFTContract);
    nftContract.methods.getRewards().send({ from: myWallet.account }, function (error, res) {
        hideLoading();
        console.log("error", error);
        if (error) {
            showToast(error.message);
            return;
        }
        showToast("已领取收益");
        getInfo();
    });
}

function showToast(msg) {
    $('.toast-body').text(msg);
    $('.toast').css("display", "flex");
    setTimeout(() => {
        $('.toast').css("display", "none");
    }, 5000);
}

function showLoading() {
    $(".Loading").css("display", "flex");
}

function hideLoading() {
    $(".Loading").css("display", "none");
}

$(function () {
    showAirdrop();
});