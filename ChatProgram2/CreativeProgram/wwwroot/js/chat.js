"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.invoke("UserNewAnnouncement", user).catch(function (err) {
    return console.error(err.toString());
});

connection.on("NewUserAnnouncement", function (user) {
    https://localhost:7206/
    var li = document.createElement("li");
    document.getElementsbyId("messagesList").appendChil(li);

    li.textContent = `${user} has appeared in chat`;
});

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {https://localhost:7206/
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
     });

    connection.invoke("SendPrivateMessage", user, message).catch(function (err) {
         return console.error(err.toString());
     });

    connection.invoke("SendRequiredWords", user).catch(function (err) {
        return console.error(err.toString());
    })
    event.preventDefault();
});