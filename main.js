const socket = io('https://doanhenhungv3.herokuapp.com/');

$('#div-chat').hide();

let customConfig;



socket.on('Danh_dach_on_line',arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten,peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);      
    });

    socket.on('Co_nguoi_dung_moi',user => {
        const { ten,peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Ai-do-vua-ngat-ket-noi',peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('Dang_ky_bat_thanh',()=> alert('vui long chon username khac!'));

function openStream(){
    const cofig = { audio: false, video: true};
    return navigator.mediaDevices.getUserMedia(cofig);
}

function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

openStream()
.then(stream => playStream('localStream',stream));

const peer = new Peer({key: 'peerjs',host: 'my-peer1412.herokuapp.com',
	secure:true,
	port: 443
	//config: customConfig
}); 


	peer.on('open',id=>{
    $('#my-peer').append(id);
    $('#btnSignUp').click(()=> {
        const username =$('#texUsername').val();
        socket.emit('Nguoi_dung_dang_ky',{ ten: username, peerId: id});
    });
});
//Caller
$('#btnCall').click(()=>{
    const id =$('#remoteId').val();
    openStream()
    .then(stream =>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
    });
});

peer.on('call',call =>{
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
    } );
});

$('#ulUser').on('click','li',function(){
    const id = $(this).attr('id');
    openStream()
    .then(stream =>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
    });
});
