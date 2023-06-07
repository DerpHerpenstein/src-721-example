const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')
const tinysecp = require('tiny-secp256k1');

const {ECPairFactory} = require("ecpair")
const ECPair = ECPairFactory(tinysecp);

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
    return(signature)
}


// this will only if the list of token trait arrays is predetermined


let trait_arrays = [  [1,2,3,4],  [2,3,4,1],  [3,4,1,2],  [3,4,1,2],  [4,1,2,3]  ]

// encode each array
let encoded_arrays = trait_arrays.map(trait => signArray(btoa(JSON.stringify(trait+"salt"))))

// generate leaves
let leaves = encoded_arrays.map(arr => keccak256(arr))
// generate tree with pairs sorted

let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
// generate root

let rootHash = merkleTree.getRoot().toString('hex')


console.log(rootHash, merkleTree.toString())



// prove a trait is a valid part of the tree

let hashed_signed_trait = keccak256(encoded_arrays[0])
let proof = merkleTree.getHexProof(hashed_signed_trait)
console.log(proof)

// Check proof
let v = merkleTree.verify(proof, hashed_signed_trait, rootHash)

// should return true
console.log(v) 



// prove that the trait is signed by the creator
var signature = encoded_arrays[0]
var message = btoa(JSON.stringify(trait_arrays[0]))

// should return true
console.log(bitcoinMessage.verify(message, address, signature))


// it is important to do both of these proofs
// 1. will ensure the creator and/or others cannot alter the collection or mint unchecked
// 2. will ensure the asset is deemed valid by the creator