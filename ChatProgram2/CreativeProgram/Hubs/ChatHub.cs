using CreativeProgram.DataService;
using CreativeProgram.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging.Abstractions;
using System.Collections.Concurrent;

namespace CreativeProgram.Hubs
{
    public class ChatHub : Hub
    {
        private string[] wordList;
        static string[] requiredWords = new string[3];
        private string message;
        static List<string> story = new List<string>();
        private readonly SharedDb _shared;
        public ChatHub(SharedDb shared) => _shared = shared;
        private readonly ConcurrentDictionary<string, List<string>> _chatRooms = new ConcurrentDictionary<string, List<string>>();

        private void InitializeRequiredWords()
        {
            try
            {
                // Attempt to read lines from "wordList.txt"
                wordList = File.ReadAllLines("wordList.txt");
            }
            catch (Exception ex)
            {
                // Handle file-related exceptions
                // For example, log the error or provide a default word list
                Console.WriteLine($"Error reading word list file: {ex.Message}");
                // Provide a default word list or rethrow the exception
                // throw; // Rethrow the exception if you want to handle it elsewhere
                wordList = new string[0]; // Provide an empty word list as a fallback
            }

            // Ensure wordList is not null before attempting to use it
            if (wordList == null || wordList.Length == 0)
            {
                // Handle the case where the word list is empty or not available
                Console.WriteLine("Word list is empty or not available.");
                return;
            }
            // Get 3 random words from wordList
            Random rnd = new Random();
            for (int i = 0; i < 3; i++)
            {
                requiredWords[i] = wordList[rnd.Next(0, wordList.Length)];
                Console.WriteLine(requiredWords[i]);
            }

            string message = "Here are the words you have to include into your message: ";
            foreach (var word in requiredWords)
            {
                message += word + " ";
            }
            Console.WriteLine("I've been called.");
        }

        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined");
        }

        public async Task StartGame(UserConnection conn)
        {
            await Clients.All.SendAsync("ButtonGameStartedClicked");
            InitializeRequiredWords();
            await Clients.All.SendAsync("ReceiveSpecificMessage", "admin", $"Here is the list of words: => {string.Join(", ", requiredWords)}.");
        }

        public async Task SendGameStarted(UserConnection conn)
        {
            await Clients.Group(conn.ChatRoom).SendAsync("ReceiveStartGame", "admin", $"{conn.Username} has started the game, please make your way into Game Room.");
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            _shared.connections[Context.ConnectionId] = conn;

            await Clients.Group(conn.ChatRoom).SendAsync("JoinSpecificChatRoom", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
            //await Clients.Group(conn.ChatRoom).SendAsync("ReceiveSpecificMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}");

            // Add the user to the chat room
            _chatRooms.AddOrUpdate(conn.ChatRoom, new List<string> { conn.Username }, (key, existingUsers) =>
            {
                existingUsers.Add(conn.Username);
                return existingUsers;
            });

            await Clients.Group(conn.ChatRoom).SendAsync("UsersInChatRoom", _chatRooms[conn.ChatRoom]);

            // Send the message with required words to the specified user
            /*            await Clients.Group(conn.ChatRoom).SendAsync("WordListAcquired", requiredWords);*/
            //await Clients.Group(conn.ChatRoom).SendAsync("WordListAcquired", message);

            //await Clients.Group(conn.ChatRoom).SendAsync("JoinSpecificChatRoom", "admin", $"These are the words: {requiredWords}");
        }

        public async Task SendMessage(string msg)
        {
            string[] parsed = msg.Split(' ', ',', '.', '!', '?'); // parse the msg to be sent into an array
            for (int i = 0; i < parsed.Length; i++)
            {
                parsed[i] = parsed[i].ToLower();
            }

            foreach (String word in parsed) { // debugging
                word.ToLower();
            }

            bool valid = true;

            foreach (string word in requiredWords)
            {
                if (!parsed.Contains(word))
                {
                    valid = false;
                }
            }

            Console.WriteLine(valid);
            // is messsage sender is not equal to the user who is supposed to be typing, send back 
            if (_shared.connections.TryGetValue(Context.ConnectionId, out UserConnection conn))
            {
                if (valid)
                {
                    story.Add(msg); // add to the master list of the story
                    foreach (string item in story)
                    {
                        Console.WriteLine(item);
                    }
                    await Clients.Group(conn.ChatRoom).SendAsync("ReceiveSpecificMessage", conn.Username, msg);
                    //// Adds valid message into our story messages for export
                    /////**implementation for export function changes**
                    await Clients.Group(conn.ChatRoom).SendAsync("ReceiveCorrectMessages", conn.Username, msg);
                    //////
                    InitializeRequiredWords();
                    await Clients.All.SendAsync("ReceiveSpecificMessage", "admin", $"Here is the  of words: => {string.Join(", ", requiredWords)}.");
                }
                else
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("ReceiveSpecificMessage", conn.Username, $"Please use the actual words. Case insensitive.=> {string.Join(", ", requiredWords)}.");
                }
            }
        }

        public async Task<List<string>> GetUsersInChatRoom(UserConnection conn)
        {
            if (_chatRooms.TryGetValue(conn.ChatRoom, out List<string> users))
            {
                return users;
            }

            return new List<string>();
        }


        // Method to get a random connected user
        public async Task<List<string>> GetRandomUser(UserConnection conn) 
        {
            // Get the list of usernames from the connected users
            List<string> connectedUserNames = _shared.connections.Values.Select(connection => connection.Username).ToList();
            Console.Write("Hello");
            Console.WriteLine(connectedUserNames);
            Console.WriteLine($"{connectedUserNames.Count} users");

            await Clients.Group(conn.ChatRoom).SendAsync("RandomUserCalledTwo", connectedUserNames);

            if (connectedUserNames.Count == 0)
            {
                await Clients.Group(conn.ChatRoom).SendAsync("RandomUserCalled", "admin", "No users available to pick from.");
                return [];
            }

            return connectedUserNames;

            // Select a random username
            Random random = new Random();
            string randomUserName = connectedUserNames[random.Next(connectedUserNames.Count)];

            // Send the randomly selected username to the group
            await Clients.Group(conn.ChatRoom).SendAsync("RandomUserCalled", "admin", $"Random user picked: {randomUserName}");
        }
    }
}