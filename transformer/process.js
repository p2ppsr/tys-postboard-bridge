module.exports = async (state, action) => {
  try {
    console.log(`[+] ${action.tx.h}`)

    // Transaction must contain correct protocol namespace
    if (action.out[0].s2 !== '1Fc6HY6Ln6UTTTrjuQsk6BbopX1ZtF2XHh') {
      throw new Error(
        'Transaction has invalid protocol namespace!'
      )
    }

    // Transactions where the key from s3 did not sign an input are invalid
    if (!(action.in.some(input => input.e.a === action.out[0].s3))) {
      throw new Error(
        'Postboard sender did not sign at least one input to the transaction!'
      )
    }

    const userID = action.out[0].s3

    if (action.out[0].s4 === 'setname') {
      const name = action.out[0].s5

      if (!name) {
        throw new Error('No name was given!')
      }

      if (name.length > 30) {
        throw new Error('Name too long!')
      }

      const [search] = await state.read({
        collection: 'names',
        find: {
          _id: userID
        }
      })
      if (search) {
        await state.update({
          collection: 'names',
          find: {
            _id: userID
          },
          map: x => ({
            ...x,
            name,
            currentTXID: action.tx.h,
            previousVersions: [
              ...x.previousVersions,
              {
                name: x.name,
                currentTXID: x.currentTXID
              }
            ]
          })
        })
      } else {
        await state.create({
          collection: 'names',
          data: {
            _id: userID,
            currentTXID: action.tx.h,
            name,
            previousVersions: []
          }
        })
      }
      if (action.live) {
        await state.create({
          collection: 'bridgeport_events',
          data: {
            _id: action.tx.h,
            name,
            type: 'name'
          }
        })
      }
    } else if (action.out[0].s4 === 'sendmsg') {
      const message = action.out[0].s5
      await state.create({
        collection: 'messages',
        data: {
          _id: action.tx.h,
          message,
          userID
        }
      })
      if (action.live) {
        await state.create({
          collection: 'bridgeport_events',
          data: {
            _id: action.tx.h,
            message,
            userID,
            type: 'message'
          }
        })
      }
    } else {
      throw new Error('Invalid protocol verb')
    }
  } catch (e) {
    console.error(`[!] ${action.tx.h}`)
    console.error(e)
  }
}
