var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#chat-text").prop("disabled", !connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log("Connected to websocket: " + frame);
        stompClient.subscribe('/topic/messages', function(greeting) {
            showGreeting(JSON.parse(greeting.body).text);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected from websocket")
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function sendMessage() {
    stompClient.send("/app/chat", {}, JSON.stringify({'name': 'admin', 'text': $("#chat-text").val()}));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function() { connect(); });
    $("#disconnect").click(function() { disconnect(); });
    $("#send").click(function () {
        sendMessage();
        $("#chat-text").val("");
    });
});