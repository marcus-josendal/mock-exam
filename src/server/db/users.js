const users = new Map()

function getUser(id) {
    return users.get(id)
}

function verifyUser(id, password) {
    const user = getUser(id)

    return user === undefined ? false : user.password === password
}

function createUser(id, password) {
    if(getUser(id) !== undefined) {
        return false
    }

    const user = {
        id: id,
        password: password
    }

    users.set(id, user)
    return true
}

function resetAllUsers(){
    users.clear();
}

module.exports = { verifyUser, createUser, getUser, resetAllUsers }
