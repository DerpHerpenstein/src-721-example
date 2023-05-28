# SRC-PFP Composable Profile Picture Specification

Please note: SRC-PFP is a bleeding edge specification. 

In order to provide a high quality vibrant visuals to stamps, a specification is needed that can 

## Introduction

SRC-PFP transactions must conform to these **required** fields or a Bitcoin Stamp Number will not be created, the transaction will not be considered a valid SRC-PFP transaction, and they will not appear in the Bitcoin Stamps Protocol index / API. Fields labeled optional can be omitted.

### DEPLOY
```
{
        "p": "src-pfp",
        "v": 1,
        "op": "deploy",
        "name": "Collection Name",      // The display name of the collection
        "symbol": "SYM",                // the symbol for the collection
        "description": "Description",
        "unique": true,                 // determines if a set of traits must be unique to be valid
        "root": "a1b2...e8d9"           // merkle root for a permissioned mint [optional]
        "type": "data:image/png;base64",// mime type of the images used in traits t0-tx
        "image-rendering":"pixelated",  // css property to ensure images are displayed properly [optional]
        "viewbox": "0 0 160 160",       // viewbox to properly see  traits t0-tx
        "max": 2500,                    // maximum number of mints
        "lim": 1,                       // limit per mint
        "t0": ["A12430899936789156000", "A9676658320305385000"],    // up to x layers of traits containing transparency
        "t1": ["A17140023175661332000", "A6689685157378600000"],    // can be stacked on top of eachother to form a final image
        ...
        "tx": ["A12240402677681132000", "A4332886198473102000"]
}
```
### MINT
```
{
    "p": "src-pfp",
    "op": "mint",
    "symbol": "SYM",
    "ts":[0,1,...,y]    // an array with x length wherein each item
                        // represents the index of the trait to use
                        // from the deploy mechanism
}
```
### TRANSFER and USE

SRC-PFP transactions are valid counterparty assets and can be use as such.

## SRC-PFP Token Requirements

1. Tokens must be 1-5 characters in length.
2. Allowed characters:
   a. Any word character (alphanumeric characters and underscores)
   b. Special characters: ~!@#$%^&*()_+=<>?
   c. Most printable emojis in U+1F300 to U+1F5FF
3. Disallowed characters:
   a. Non-printable Unicode characters
   b. Quotation marks: " ` '
   c. Special characters not present in 2c
4. Only numeric values are allowed in the "max", "lim" fields
5. Other Qualifications:
    - CP Asset must be locked, and multisig dust assigned to qualified burn address For more details on "KeyBurn" see: https://github.com/mikeinspace/stamps/blob/main/Key-Burn.md
    - CP Asset for deploy muse be value 1, nondivisible
    - CP Asset value for mint must be less than or equal to lim
    - not case sensitive DOGE=doge
    - max lim amount: uint64_max 18,446,744,073,709,551,615 (**commaas not allowed**, here for readability only)
    - json strings are not order sensitive
    - json strings are not case sensitive


**INVALID** tokens will not be created in the Bitcoin Stamps Protocol index or API, and the transaction will not be considered a valid SRC-PFP transaction. Any further modifications to the standard must be designed around backwards compatibility.


## Allowed Unicode Chars

Emoji_Presentation: This property includes all characters that are defined as emojis and have a distinct emoji-style appearance. These characters are intended to be displayed as colorful pictographs, rather than black-and-white text symbols. Examples include face emojis (😀, 😂, 😊), objects (🚗, 🌍, 🍕), and symbols (❤️, 🚫, ⏰).

Emoji_Modifier_Base: This property consists of characters that can be modified by emoji modifiers, such as skin tone modifiers. These characters usually represent human-like figures (e.g., 👩, 👨, 🤳) and can be combined with emoji modifiers to represent variations in skin tone or other attributes.

Emoji_Modifier: This property contains characters that can be used to modify the appearance of other emojis, particularly the ones classified as Emoji_Modifier_Base. The most common example is the skin tone modifiers (🏻, 🏼, 🏽, 🏾, 🏿) that can be applied to human-like emojis to represent different skin tones.


## Excluded Unicode Chars

These chars are excluded from the allowed chars list because they are not printable, and are not allowed in the tick field. Tokens with these chars will not be created in Bitcoin Stamps Protocol index or API, and the transaction will not be considered a valid SRC-20 transaction.

Emoji_Component: Characters that are used to create more complex emojis, such as skin tone modifiers and hair components. These characters are not emojis on their own but can be used with other emojis.

Extended_Pictographic: This includes additional pictographic characters not covered by Emoji_Presentation but can still be considered emojis.
