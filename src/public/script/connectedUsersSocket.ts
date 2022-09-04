let socket = io.connect("https://localhost:3000",  { withCredentials: true })

let userList = document.getElementById("connected")
let h1 = document.querySelector('h1')
let messengerLayout = document.querySelector('.chat')
let visioLayout = document.querySelector('.visio')

socket.on("notConnected", () => {
    window.location.replace("/")
})

// fetch('/ssl',myInit)
//     .then((response) => {
//         response.body.getReader().read().then(rep => {
//             return console.log(new TextDecoder().decode(rep.value.buffer))
//         })
//     })
            // Buffer.alloc(JSON.stringify(json));
let socket = io.connect("https://localhost:3000", {
    withCredentials: true
})
    // {
    //     transports: ["socket", "polling"],
    //     // rememberUpgrade: true,
    //     upgrade: true
    // //     // secure: true,
    // //     withCredentials: true,
    // //     ca: ssl.cert
    // })

socket.on("close", () => {
    socket.io.opts.transports = ["polling", "websocket"];
})



socket.on("connect", () => {
     h1.setAttribute("data-my-id", socket.id)
});

let allUsers = document.querySelectorAll('.user')
roomList(allUsers)

let other = []
socket.on('newUser', (user: { socketId: string; name: string }) => {
    if (user.socketId !== socket.id && !other.includes(user.socketId)) {
        let pUser = document.createElement("p")
        pUser.innerText = user.name
        pUser.classList.add('user')
        pUser.setAttribute("id", user.socketId)
        let coList =  document.querySelector("#connected")
        coList.appendChild(pUser)
        other.push(user.socketId)
        let allUsers = document.querySelectorAll('.user')
        roomList(allUsers)
    }
})



socket.on('userDisconnect', (id: string) => {
    let removeUser = document.querySelector("p[id=\"" + id + "\"]")
    if (removeUser !== undefined) {
        removeUser.remove()
    }
    let allUsers = document.querySelectorAll('.user')
})

socket.on("connect_error", (err) => {
    socket.io.opts.transports = ["polling", "websocket"];
    console.log(err)
});

function roomList(allUsers: NodeList) {
    allUsers.forEach(eachUser => {
        eachUser.addEventListener("click", () => {
            let otherId = eachUser.id
            console.log(otherId, eachUser)
            socket.emit('changeRoom', otherId)
            let h2 = document.querySelector('h2')
            h2.innerText = eachUser.innerText
            h2.setAttribute("data-room-id", otherId)
        })
    })
}


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