# Ty's Postboard Protocol

- [Query](./query)
- [Socket](./socket)

The Hello World Protocol (HWP) is a simple but surprisingly powerful protocol that allows you to send messages and track them on the Bitcoin SV blockchain. This Bridgeport state machine tracks these HWP messages, serving them to anyone who requests them.

We keep track the message senders, and digital signatures ensure that no one can forge a message without authorization.

## Blockchain Data Protocol

Any **Bitcoin SV** transaction where the **first output** contains the fields from the below table complies with the Hello World Protocol, provided that a private key belonging to the address from field 3 has signed **at least one of the inputs** to the transaction. If no funds are in the address, an r-puzzle can be used to achieve a valid input signature.

PUSHDATA | Field
---------|---------------------------------
0        | \`OP_0\` (see [this](https://bitcoinsv.io/2019/07/27/the-return-of-op_return-roadmap-to-genesis-part-4/))
1        | \`OP_RETURN\`
2        | Protocol Namespace Address (\`1Fc6HY6Ln6UTTTrjuQsk6BbopX1ZtF2XHh\`)
3        | Sender ID, which is a base58-encoded BSV address whose private key signed at least one of the inputs of this BSV transaction
4        | The action to take (see below)

### Send Message

When field 4 is `sendmsg` then ...

### Set Name

When field 4 is `setname` then ...

## Usage

When you create a transaction using the protocol, the HWP Bridgeport state machine will collect it and aggregate it into the HWP Bridge database, where it will be made available along with all other HWP messages. When you write queries against this dataset, the documents are in the following format:

- **sender**: The Bitcoin SV address from field 3 which signed the HWP message transaction
- **_id**: The TXID of the HWP transaction
- **message**: The content that was sent in the HWP message