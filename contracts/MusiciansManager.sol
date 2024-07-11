// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MusiciansManager {
    ////pour envoyer les information vers frend-end
    event musicianCreated(string _artistName);
    event trackAdded(string _artistName, string _title);
    event getTheTracks(Track[] _tracks);
    //event MusicianRemoved(address indexed musicianAddress);

    struct Track {
        string _title;
        uint _duration;
    }

    struct Musician {
        string _artistName;
        Track[] _tracks;
    }

    mapping(address => Musician) Musicians;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function addMusician(
        address _musicianAddress,
        string memory _artistName
    ) external onlyOwner {
        require(
            bytes(Musicians[_musicianAddress]._artistName).length == 0,
            "This musician has already been created"
        );
        Musicians[_musicianAddress]._artistName = _artistName;
        emit musicianCreated(_artistName);
    }

   
    function addTrack(
        address _musicianAddress,
        string memory _title,
        uint _duration
    ) external onlyOwner {
        require(
            bytes(Musicians[_musicianAddress]._artistName).length > 0,
            "This musician doest not exist"
        );
        Track memory thisTrack = Track(_title, _duration);

        Musicians[_musicianAddress]._tracks.push(thisTrack);
        emit trackAdded(Musicians[_musicianAddress]._artistName, _title);
    }

    function getTracks(address _musicianAddress) external {
        emit getTheTracks(Musicians[_musicianAddress]._tracks);
    }

    // debut rahma

    // fin rahma
}
