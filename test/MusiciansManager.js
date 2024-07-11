const MusiciansManager = artifacts.require("./MusiciansManager");

contract("MusiciansManager", (accounts) => {
  // 1 eme test should add a musician rahma
  it("Vous devriez ajouter un musicien.", async function () {
    const Contract = await MusiciansManager.deployed();
    const result = await Contract.addMusician(
      "0xea6bd606e616ea0a31048594cb75ab1b468da9e4",
      "rahma",
      { from: accounts[0] }
    );

    // Vérifie que l'événement a été émis avec le bon nom d'artiste
    assert.equal(
      result.logs[0].args._artistName,
      "rahma",
      " Not equal to rahma "
    );
  });

  ////// 2 eme test should not add a musicien if it already exists
  it("Vous ne devriez pas ajouter un musicien s'il existe déjà.", async function () {
    const Contract = await MusiciansManager.deployed();
    let err = null;
    try {
      await Contract.addMusician(
        "0xea6bd606e616ea0a31048594cb75ab1b468da9e4",
        "rahma2",
        { from: accounts[0] }
      );
    } catch (error) {
      err = error;
    }
    assert.ok(err instanceof Error);
  });

  //////3eme test should add a track
  it("Vous devriez ajouter une piste.", async function () {
    const Contract = await MusiciansManager.deployed();
    const result = await Contract.addTrack(
      "0xea6bd606e616ea0a31048594cb75ab1b468da9e4",
      "trackTitre",
      345,
      { from: accounts[0] }
    );
    assert.equal(
      result.logs[0].args._title,
      "trackTitre",
      " Not equal to trackTitre"
    );
  });
  /////////4eme test should not add a track to an unkown artist
  it("Vous ne devriez pas ajouter une piste à un artiste inconnu", async function () {
    const Contract = await MusiciansManager.deployed();
    let err = null;
    try {
      await Contract.addTrack(
        "0x523dFd870A576f2fFb416e22F8FF906816bDdb25",
        "track11",
        345,
        { from: accounts[0] }
      );
    } catch (error) {
      err = error;
    }
    assert.ok(err instanceof Error);
  });

  //////5 eme  test should get the trcks of an artist
  /// adresse de musicien
  it("Vous devriez obtenir les pistes d'un artiste.", async function () {
    const Contract = await MusiciansManager.deployed();
    const result = await Contract.getTracks(
      "0xea6bd606e616ea0a31048594cb75ab1b468da9e4",

      { from: accounts[0] }
    );

    assert.ok(Array.isArray(result.logs[0].args._tracks));
  });

  //debut rahma ( il faut ajouter pptx)
  ///// 6 eme test should only allow owner to remove musician
  it("Seul le propriétaire devrait être autorisé à supprimer un musicien.", async function () {
    const Contract = await MusiciansManager.deployed();
    let err = null;
    try {
      await Contract.removeMusician(
        "0xea6bd606e616ea0a31048594cb75ab1b468da9e4",
        { from: accounts[1] }
      );
    } catch (error) {
      err = error;
    }
    assert.ok(err instanceof Error);
  });

  ///////7 eme test should retrieve tracks for an existing musician
  it("Vous devriez récupérer les pistes d'un musicien existant", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[1];

    // Ajouter un musicien avec des pistes
    await Contract.addMusician(musicianAddress, "Existing Musician", {
      from: accounts[0],
    });
    await Contract.addTrack(musicianAddress, "Track 1", 180, {
      from: accounts[0],
    });
    await Contract.addTrack(musicianAddress, "Track 2", 240, {
      from: accounts[0],
    });

    // Récupérer les pistes du musicien
    const result = await Contract.getTracks(musicianAddress, {
      from: accounts[0],
    });

    // Vérifier que le tableau de pistes n'est pas vide
    assert.ok(
      result.logs[0].args._tracks.length > 0,
      "Tracks not retrieved for musician"
    );
  });

  ////////8eme test should return empty array for tracks of non-existent musician
  it("Vous devriez renvoyer un tableau vide pour les pistes d'un musicien inexistant.", async function () {
    const Contract = await MusiciansManager.deployed();
    const nonExistentMusicianAddress =
      "0x1234567890123456789012345678901234567890";

    // Récupérer les pistes d'un musicien inexistant
    const result = await Contract.getTracks(nonExistentMusicianAddress, {
      from: accounts[0],
    });

    // Vérifier que le tableau de pistes est vide
    assert.equal(
      result.logs[0].args._tracks.length,
      0,
      "Tracks array not empty"
    );
  });

  /////// 9eme test should allow only owner to call onlyOwner function
  it("Seul le propriétaire devrait être autorisé à appeler la fonction onlyOwner.", async function () {
    const Contract = await MusiciansManager.deployed();

    // Appel de la fonction restreinte à l'owner avec un compte non-owner
    let err = null;
    try {
      await Contract.onlyOwnerFunction({ from: accounts[1] });
    } catch (error) {
      err = error;
    }

    // Vérification qu'une erreur a été levée
    assert.ok(err instanceof Error);
  });

  /////10eme test should add a track for an existing musician
  it("Vous devriez ajouter une piste pour un musicien existant.", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[3];
    const artistName = "Existing Musician";

    // Ajouter un musicien
    await Contract.addMusician(musicianAddress, artistName, {
      from: accounts[0],
    });

    // Ajouter une nouvelle piste pour le musicien existant
    const title = "New Track";
    const duration = 200;
    await Contract.addTrack(musicianAddress, title, duration, {
      from: accounts[0],
    });

    // Récupérer les pistes du musicien
    const result = await Contract.getTracks(musicianAddress, {
      from: accounts[0],
    });

    // Vérifier que la piste a été ajoutée avec succès
    assert.equal(
      result.logs[0].args._tracks.length,
      1,
      "Track not added successfully"
    );
    assert.equal(
      result.logs[0].args._tracks[0]._title,
      title,
      "Track title mismatch"
    );
    assert.equal(
      result.logs[0].args._tracks[0]._duration,
      duration,
      "Track duration mismatch"
    );
  });

  ////////11eme test should not remove a non-existent musician
  it("Vous ne devriez pas supprimer un musicien qui n'existe pas.", async function () {
    const Contract = await MusiciansManager.deployed();
    const nonExistentMusicianAddress =
      "0x1234567890123456789012345678901234567890";

    // Tentative de suppression d'un musicien inexistant
    let err = null;
    try {
      await Contract.removeMusician(nonExistentMusicianAddress, {
        from: accounts[0],
      });
    } catch (error) {
      err = error;
    }

    // Vérification qu'une erreur a été levée
    assert.ok(err instanceof Error);
  });

  //////12eme test should only allow owner to remove musician
  it("Seul le propriétaire devrait être autorisé à supprimer un musicien.", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[5];
    const artistName = "Musician to Remove";

    // Ajouter un musicien
    await Contract.addMusician(musicianAddress, artistName, {
      from: accounts[0],
    });

    // Tentative de suppression du musicien par un compte non-owner
    let err = null;
    try {
      await Contract.removeMusician(musicianAddress, { from: accounts[1] });
    } catch (error) {
      err = error;
    }

    // Vérification qu'une erreur a été levée
    assert.ok(err instanceof Error);
  });

  /////////13eme test should add multiple tracks for a musician
  it("Vous devriez ajouter plusieurs pistes pour un musicien.", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[7];
    const artistName = "Musician with Multiple Tracks";
    const track1Title = "Track 1";
    const track1Duration = 180;
    const track2Title = "Track 2";
    const track2Duration = 240;

    // Ajouter un musicien
    await Contract.addMusician(musicianAddress, artistName, {
      from: accounts[0],
    });

    // Ajouter plusieurs pistes pour le musicien
    await Contract.addTrack(musicianAddress, track1Title, track1Duration, {
      from: accounts[0],
    });
    await Contract.addTrack(musicianAddress, track2Title, track2Duration, {
      from: accounts[0],
    });

    // Récupérer les pistes du musicien
    const result = await Contract.getTracks(musicianAddress, {
      from: accounts[0],
    });

    // Vérifier que les pistes ont été ajoutées avec succès
    assert.equal(
      result.logs[0].args._tracks.length,
      2,
      "Tracks not added successfully"
    );
  });

  ////////14eme test should return empty array for tracks of musician without adding any
  it("Vous devriez renvoyer un tableau vide pour les pistes d'un musicien sans en ajouter.", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[8];
    const artistName = "Musician Without Tracks";

    // Ajouter un musicien sans ajouter de pistes
    await Contract.addMusician(musicianAddress, artistName, {
      from: accounts[0],
    });

    // Récupérer les pistes du musicien
    const result = await Contract.getTracks(musicianAddress, {
      from: accounts[0],
    });

    // Vérifier que le tableau de pistes est vide
    assert.equal(
      result.logs[0].args._tracks.length,
      0,
      "Tracks array not empty"
    );
  });

  /////////15eme test should allow only owner to call owner-only function
  it("Seul le propriétaire devrait être autorisé à appeler une fonction réservée au propriétaire.", async function () {
    const Contract = await MusiciansManager.deployed();
    const nonOwner = accounts[1];

    // Tentative d'appeler une fonction réservée au propriétaire avec un compte non propriétaire
    let err = null;
    try {
      await Contract.onlyOwnerFunction({ from: nonOwner });
    } catch (error) {
      err = error;
    }

    // Vérification qu'une erreur a été levée
    assert.ok(
      err instanceof Error,
      "Function should only be callable by owner"
    );
  });

  ////////16eme test  should fail to retrieve information of unknown musician
  it("La tentative de récupération d'informations sur un musicien inconnu devrait échouer.", async function () {
    const Contract = await MusiciansManager.deployed();
    const unknownAddress = accounts[4];

    // Tentative de récupération des informations d'un musicien inconnu
    let err = null;
    try {
      await Contract.getMusicianInfo(unknownAddress, { from: accounts[0] });
    } catch (error) {
      err = error;
    }

    // Vérification qu'une erreur a été levée
    assert.ok(
      err instanceof Error,
      "Retrieving information of unknown musician should fail"
    );
  });

  //////17eme test should allow musician to add multiple tracks
  it("Le musicien devrait être autorisé à ajouter plusieurs pistes.", async function () {
    const Contract = await MusiciansManager.deployed();
    const musicianAddress = accounts[9];
    const artistName = "Musician with Tracks";

    // Ajouter un musicien
    await Contract.addMusician(musicianAddress, artistName, {
      from: accounts[0],
    });

    // Ajouter plusieurs pistes pour le musicien
    await Contract.addTrack(musicianAddress, "Track 1", 180, {
      from: accounts[0],
    });
    await Contract.addTrack(musicianAddress, "Track 2", 240, {
      from: accounts[0],
    });
    await Contract.addTrack(musicianAddress, "Track 3", 200, {
      from: accounts[0],
    });

    // Récupérer les pistes du musicien
    const result = await Contract.getTracks(musicianAddress, {
      from: accounts[0],
    });

    // Vérifier que les pistes ont été ajoutées avec succès
    assert.equal(
      result.logs[0].args._tracks.length,
      3,
      "Tracks not added successfully"
    );
  });

  //fin rahma
});
