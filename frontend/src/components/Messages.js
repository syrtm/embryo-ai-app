import React, { useState } from 'react';

// Kadın hastalar (doktor için gösterilecek kişiler)
const patientContacts = [
  { id: 1, name: 'Emma Thompson', role: 'Patient', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
  { id: 2, name: 'Sarah Johnson', role: 'Patient', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', online: false },
  { id: 3, name: 'Lisa Davis', role: 'Patient', avatar: 'https://randomuser.me/api/portraits/women/63.jpg', online: true },
  { id: 4, name: 'Emily Brown', role: 'Patient', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', online: true }
];

// Doktorlar (hasta için gösterilecek kişiler)
const doctorContacts = [
  { id: 101, name: 'Dr. Smith', role: 'IVF Specialist', avatar: '/doctor-avatar.jpg', online: true },
  { id: 102, name: 'Dr. Johnson', role: 'Embryologist', avatar: '/doctor-avatar-2.jpg', online: false }
];

// Başlangıçta her kişi için örnek mesajlar (İngilizce ve doktor gönderen olarak)
const initialMessages = {
  1: [
    { id: 1, senderId: 'doctor', senderName: 'Dr. Smith', content: 'Hello Emma, how are you feeling today?', timestamp: '09:00' },
    { id: 2, senderId: 'patient', senderName: 'Emma Thompson', content: "I am feeling good, thank you doctor.", timestamp: '09:01' }
  ],
  2: [
    { id: 1, senderId: 'doctor', senderName: 'Dr. Smith', content: 'Your results look very promising.', timestamp: '10:30' }
  ],
  3: [],
  4: []
};

function Messages({ userRole = 'doctor', doctorName = 'Dr. Smith' }) {
  // userRole prop'u ile role kontrolü (varsayılan: doktor)
  const contacts = userRole === 'doctor' ? patientContacts : doctorContacts;
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messagesByContact, setMessagesByContact] = useState(initialMessages);

  const currentMessages = selectedContact ? (messagesByContact[selectedContact.id] || []) : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    const updated = {
      ...messagesByContact,
      [selectedContact.id]: [
        ...(messagesByContact[selectedContact.id] || []),
        {
          id: Date.now(),
          senderId: userRole === 'doctor' ? 'doctor' : 'patient',
          senderName: userRole === 'doctor' ? doctorName : selectedContact.name,
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setMessagesByContact(updated);
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
                    </div>
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
                    {currentMessages.length === 0 && (
                      <div className="text-center text-gray-400">No messages yet.</div>
                    )}
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === (userRole === 'doctor' ? 'doctor' : 'patient') ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-lg rounded-lg px-4 py-2 ${
                            message.senderId === (userRole === 'doctor' ? 'doctor' : 'patient')
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.senderId === (userRole === 'doctor' ? 'doctor' : 'patient') ? 'text-red-100' : 'text-gray-500'}`}>
                            {message.senderName} • {message.timestamp}
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
