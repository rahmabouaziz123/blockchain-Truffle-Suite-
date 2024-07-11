//module.exports = function(_deployer) {
// Use deployer to state migration tasks.
//};

const MusiciansManager = artifacts.require("MusiciansManager");

module.exports = function (deployer) {
  deployer.deploy(MusiciansManager);
};
