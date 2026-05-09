using System.Collections.Concurrent;
using CreativeProgram.Models;

namespace CreativeProgram.DataService
{
    // Look at 40:37
    public class SharedDb
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new ConcurrentDictionary<string, UserConnection>();

        public ConcurrentDictionary<string, UserConnection> connections => _connections;
    }
}
