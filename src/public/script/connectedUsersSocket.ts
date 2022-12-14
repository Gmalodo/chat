let socket = io.connect("https://localhost:3000",  { withCredentials: true })

let userList = document.getElementById("connected")
let h1 = document.querySelector('h1')
let messengerLayout = document.querySelector('.chat')
let visioLayout = document.querySelector('.visio')

socket.on("notConnected", () => {
    window.location.replace("/")
})

socket.on('thisIsYourId', (id: string) => {
    h1.setAttribute("data-my-id", id)
    let allUsers = document.querySelectorAll('.user')
    allUsers.forEach(eachUser => {
        eachUser.addEventListener("click", () => {
            visioLayout.classList.add('hidden')
            messengerLayout.classList.remove('hidden')
            let other = eachUser.getAttribute('data-room') ? eachUser.getAttribute('data-room') : eachUser.getAttribute('id')
            socket.emit('changeRoom', id, other)
            let h2 = document.querySelector('h2')
            h2.innerText = eachUser.innerText
        })
    })
})

socket.on('newUser', (user: { socketId: string; name: string }) => {
    let me = h1.getAttribute("data-my-id")
    let other = []
    if (user.socketId !== me && !other.includes(user.socketId)) {
        let pUser = document.createElement("p")
        pUser.innerText = user.name
        pUser.classList.add('user')
        pUser.setAttribute("id", user.socketId)
        userList.appendChild(pUser)
        other.push(user.socketId)
    }
    let allUsers = document.querySelectorAll('.user')

    allUsers.forEach(eachUser => {
        eachUser.addEventListener("click", () => {
            messengerLayout.classList.remove('hidden')
            let otherId = eachUser.getAttribute('data-room') ? eachUser.getAttribute('data-room') : eachUser.id
            console.log(otherId)
            socket.emit('changeRoom', me, otherId)
            let h2 = document.querySelector('h2')
            h2.innerText = eachUser.innerText
            h2.setAttribute("data-room-id", otherId)
        })
    })
})


socket.on('userDisconnect', (id: string) => {
    let removeUser = document.querySelector("p[id=\""+id+"\"]")
    if (removeUser !== undefined){
        removeUser.remove()
    }
})

socket.on("connect_error", () => {
    setTimeout(() => {
        socket.connect("https://localhost:3000",  { withCredentials: true });
    }, 1000);
});