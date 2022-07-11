// const socket = io.connect();
let roomID;
window.onload = function () {
    roomID = location.pathname.substring(location.pathname.length - 4);
}

// socket.on("joined Room", () => {
//     console.log("Joined")
// })

function addTask() {
    let obj = {
        newTask: document.querySelector('#item').value,
        roomID: roomID
    }
    console.log(obj);
    axios({
        method: "post",
        url: location.protocol + '//' + location.host + '/data/new',
        data: obj
    }).then((res) => {
        console.log(res);
        location.reload();   // reload the same page 
    })
}

