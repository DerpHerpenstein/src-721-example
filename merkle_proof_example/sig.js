const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')
const tinysecp = require('tiny-secp256k1');

const {ECPairFactory} = require("ecpair")
const ECPair = ECPairFactory(tinysecp);

const parent = {
    "p": "src-721",
    "v": 1,
    "op": "deploy",
    "name": "Collection Name",      // The display name of the collection
    "symbol": "SYM",                // the symbol for the collection
    "description": "Description",
    "unique": true,                 // determines if a set of traits must be unique to be valid
    "supply": 4,           // merkle root for a permissioned mint [optional]
    "type": "data:image/png;base64",// mime type of the images used in traits t0-tx
    "image-rendering":"pixelated",  // css property to ensure images are displayed properly [optional]
    "viewbox": "0 0 160 160",       // viewbox to properly see  traits t0-tx
    "max": 2500,                    // maximum number of mints
    "lim": 1,                       // limit per mint
    "icon": "A16308540544056654000",// CP asset for a collection icon 
    // All t0-tx are optional if the reveal op is planned to be used
    "pubkey": "a1b2...e8d9"  ,       // pubkey for future ops such as reveal [optional]
    "t0": ["A12430899936789156000", "A9676658320305385000"],    // up to x layers of stamp traits (references by CP asset#) containing
    "t1": ["A17140023175661332000", "A6689685157378600000"],    // transparency can be stacked on top of eachother to form a final image
    // ...
    "tx": ["A12240402677681132000", "A4332886198473102000"]
}

const tokens = [
    {
        "p": "src-721",
        "op": "mint",
        "symbol": "SYM",
        "proof": "", 
        "ts":[1,2,3,4],
        "id": 1
    },
    {
        "p": "src-721",
        "op": "mint",
        "symbol": "SYM",
        "proof": "", 
        "ts":[2,3,4,1],
        "id": 2
    },
    {
        "p": "src-721",
        "op": "mint",
        "symbol": "SYM",
        "proof": "", 
        "ts":[3,4,1,2],
        "id": 3
    },
    {
        "p": "src-721",
        "op": "mint",
        "symbol": "SYM",
        "proof": "", 
        "ts":[4,1,2,3],
        "id": 4
    },
    

]

// You don't need to explicitly write ECPairInterface, but just to show
// that the keyPair implements the interface this example includes it.

// From WIF
function rng () {
    return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
  } // get a much more secure random
  
  const keyPair = ECPair.makeRandom({ rng: rng })
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
  console.log("address " + address) // 17wqX8P6kz6DrDRQfdJ9KeqUTRmgh1NzSk
  var publicKey = keyPair.publicKey.toString('hex')
  
  console.log("public key " + publicKey) // 0279bf075bae171835513be1056f224f94f3915f9999a3faea1194d97b54397219
  
  const privateKey = Buffer.from(keyPair.privateKey)
  console.log("private key WIF " + privateKey) 


function signArray(trait){
    const signature = bitcoinMessage.sign(trait, privateKey, keyPair.compressed)
    return(signature.toString("base64"))
}


// encode each array
let signatures = tokens.map(trait => signArray(btoa(JSON.stringify({ts: trait.ts, id: trait.id}))))

console.log(signatures)



// prove that the trait is signed by the creator
var signature = signatures[0]
var message = btoa(JSON.stringify({ts: tokens[0].ts, id: tokens[0].id}))

// should return true
console.log(bitcoinMessage.verify(message, address, signature))

// should return false

var address_2 = "1HsoLKovnGwkiDmoUF9rj2X78GPFczoUuk"

console.log(bitcoinMessage.verify(message, address_2, signature))
