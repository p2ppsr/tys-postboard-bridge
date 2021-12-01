const _process = require('./process')

const fakeState = {
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}

describe('process', () => {
  it('Calls state.create with a message', async () => {
    await _process(fakeState, {
      tx: { h: 'mock_txid' },
      in: [{ e: { a: 'mock_addr' } }],
      out: [{
        s2: '1Fc6HY6Ln6UTTTrjuQsk6BbopX1ZtF2XHh',
        s3: 'mock_addr',
        s4: 'sendmsg',
        s5: 'hello'
      }]
    })
    expect(fakeState.create).toHaveBeenCalledWith({
      collection: 'messages',
      data: {
        userID: 'mock_addr',
        message: 'hello',
        _id: 'mock_txid'
      }
    })
  })
})
