module.exports = async (state, action) => {
  try {
    console.log(`[-] ${action.tx.h}`)
    const [search] = await state.read({
      collection: 'messages',
      find: {
        _id: action.tx.h
      }
    })
    if (search) {
      await state.delete({
        collection: 'messages',
        find: {
          _id: action.tx.h
        }
      })
    } else {
      const [nameSearch] = await state.read({
        collection: 'names',
        find: {
          currentTXID: action.tx.h
        }
      })
      if (!nameSearch) {
        throw new Error('Trying to delete something that does not exist')
      }
      if (nameSearch.previousVersions.length === 0) {
        await state.delete({
          collection: 'names',
          find: {
            currentTXID: action.tx.h
          }
        })
      } else {
        const previousVersion = nameSearch.previousVersions.pop()
        await state.update({
          collection: 'names',
          find: {
            currentTXID: action.tx.h
          },
          map: x => ({
            ...x,
            currentTXID: previousVersion.currentTXID,
            name: previousVersion.name,
            previousVersions: nameSearch.previousVersions
          })
        })
      }
    }
    if (action.live) {
      await state.delete({
        collection: 'bridgeport_events',
        find: { _id: action.tx.h }
      })
    }
  } catch (e) {
    console.error(`[!] ${action.tx.h}`)
    console.error(e)
  }
}
