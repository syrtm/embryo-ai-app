import React, { useState } from 'react';

function Messages() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data
  const contacts = [
    {
      id: 1,
      name: 'Dr. Smith',
      role: 'IVF Specialist',
      avatar: '/doctor-avatar.jpg',
      online: true,
      lastMessage: 'Your latest test results look promising.',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      role: 'Embryologist',
      avatar: '/doctor-avatar-2.jpg',
      online: false,
      lastMessage: "We'll discuss the analysis results tomorrow.",
      timestamp: 'Yesterday'
    },
    {
      id: 3,
      name: 'Nurse Williams',
      role: 'IVF Nurse',
      avatar: '/nurse-avatar.jpg',
      online: true,
      lastMessage: "Don't forget your appointment tomorrow at 9 AM.",
      timestamp: 'Yesterday'
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      content: 'Hello Sarah, how are you feeling today?',
      timestamp: '10:00 AM'
    },
    {
      id: 2,
      senderId: 'me',
      content: "Hi Dr. Smith, I'm feeling good. Just a bit nervous about the results.",
      timestamp: '10:05 AM'
    },
    {
      id: 3,
      senderId: 1,
      content: 'I understand. Your latest test results look promising. Would you like to schedule a video call to discuss them in detail?',
      timestamp: '10:30 AM'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 h-[calc(100vh-12rem)]">
            {/* Contacts List */}
            <div className="col-span-1 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 focus:outline-none ${
                      selectedContact?.id === contact.id ? 'bg-red-50' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full bg-gray-200"
                        />
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {contact.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{contact.timestamp}</p>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {contact.lastMessage}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-10 h-10 rounded-full bg-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedContact.name}
                        </h3>
                        <p className="text-sm text-gray-500">{selectedContact.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-lg rounded-lg px-4 py-2 ${
                            message.senderId === 'me'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === 'me'
                                ? 'text-red-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No conversation selected
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose a contact to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
