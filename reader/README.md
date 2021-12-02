# Ty's Postboard Protocol

- [Query](./query)
- [Socket](./socket)

Ty's Postboard Protocol allows you to create Bitcoin transactions that ascribe a name to a person who is writing a post, and also track the posts written by that same user ID.

## Blockchain Data Protocol

Any **Bitcoin SV** transaction where the **first output** contains the fields from the below table complies with Ty's Postboard Protocol, provided that a private key belonging to the address from field 3 has signed **at least one of the inputs** to the transaction. If no funds are in the address, an r-puzzle can be used to achieve a valid input signature.

PUSHDATA | Field
---------|---------------------------------
0        | \`OP_0\` (see [this](https://bitcoinsv.io/2019/07/27/the-return-of-op_return-roadmap-to-genesis-part-4/))
1        | \`OP_RETURN\`
2        | Protocol Namespace Address (\`1Fc6HY6Ln6UTTTrjuQsk6BbopX1ZtF2XHh\`)
3        | Sender ID, which is a base58-encoded BSV address whose private key signed at least one of the inputs of this BSV transaction
4        | The action to take (see below)

### Send Message

When field 4 is `sendmsg` then field 5 is the string representing the message, not to exceed 512 bytes.

### Set Name

When field 4 is `setname` then field 5 is the string representing the user's new name, not to exceed 30 bytes.

## Usage

The documents are stored in the MongoDB Bridge Database in the following format:

### Collection: `messages`

- **userID**: The Bitcoin SV address from field 3 which signed the message transaction
- **_id**: The TXID of the transaction
- **message**: The content that was sent in the message

### Collection: `names`

- **_id**: The Bitcoin SV address from field 3 which represents this user identity
- **name**: The screen name for the user
- **currentTXID**: The TXID of the currently-active naming transaction
- **previousVersions**: An array of objects representing previous names of this user. Each object contains `currentTXID` and `name`, and newer names are at the end of the array.
