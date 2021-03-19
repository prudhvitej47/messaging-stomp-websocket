var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#chat-text").prop("disabled", !connected);
    $("#disconnect").prop("disabled", !connected);
    $("#username").prop("disabled", connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    if (!$("#username").val()) {
        $("#username").addClass("is-invalid");
    } else {
        $("#username").removeClass("is-invalid");
        var socket = new SockJS('/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            setConnected(true);
            console.log("Connected to websocket: " + frame);
            stompClient.subscribe('/topic/messages', function (greeting) {
                var msg = JSON.parse(greeting.body);
                showGreeting(msg.from, msg.text);
            });
        });
    }
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected from websocket")
}

function showGreeting(from, message) {
    $("#greetings").append("<tr><td><b>" + from + "</b>: " + message + "</td></tr>");
}

function sendMessage() {
    stompClient.send("/app/chat", {}, JSON.stringify({'from': $("#username").val(), 'text': $("#chat-text").val()}));
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