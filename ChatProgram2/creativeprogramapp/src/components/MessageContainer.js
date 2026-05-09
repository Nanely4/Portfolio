const MessageContainer = ({messages}) => {
    return (
    <div>
        {
            messages.map((msg, index) =>
            <table>
                <tr key={index}>
                    <td>{msg.username}: {msg.msg}</td>
                </tr>
            </table>)
        }
    </div>
    );
}

export default MessageContainer;