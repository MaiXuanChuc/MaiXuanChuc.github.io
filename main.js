const socket = io('https://doanhenhungv4.herokuapp.com');


socket.on('Danh_dach_on_line', arrUserInfo => {
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Co_nguoi_dung_moi', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Ai-do-vua-ngat-ket-noi', peerId => {
        $(`#${peerId}`).remove();
    });
});


function openStream() {
    const cofig = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(cofig);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

openStream()
    .then(stream => playStream('localStream', stream));

const peer = new Peer({ key: 'peerjs', host: 'mypeer1303.herokuapp.com', secure: true, port: 443 });
// const peer = new Peer( {host: 'mypeer1303.herokuapp.com', port: 443});

peer.on('open', id => {
    socket.emit('camera_pi');
    socket.on('them_phan_tu_dau', arrUserInfo =>{
        if (arrUserInfo === undefined || arrUserInfo.length == 0)
        {
           const username = "Camera-Pi"
           socket.emit('Nguoi_dung_dang_ky', { ten: username, peerId: id });
        }
        else{
            $('#btnSignUp').click(() => {
                const username = $('#texUsername').val();
                socket.emit('Nguoi_dung_dang_ky', { ten: username, peerId: id });
            });
        }

    });

});
//Caller
$('#btnCall').click(() => {
   const id = $('#remoteId').val();
       openStream()
        .then(stream => {
            //playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('localStream', remoteStream));
        });
});

peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

$('#ulUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    openStream()
        .then(stream => {
            //playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('localStream', remoteStream));
        });
});
