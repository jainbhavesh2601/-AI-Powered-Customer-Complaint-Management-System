import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateComplaintData } from '../store/complaintSlice';

const CopilotChat = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Ready to process new complaints. You can paste the raw email from the customer, or upload a PDF of the complaint report. I will extract the data and run the initial risk assessment.' }
  ]);
  
  const dispatch = useDispatch();
  const currentData = useSelector((state) => state.complaint.data);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for the hidden file input

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Text Chat
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', userText);
      formData.append('current_state', JSON.stringify(currentData));

      const response = await axios.post('http://localhost:8000/api/ai/process', formData);
      dispatch(updateComplaintData(response.data.data));
      setMessages(prev => [...prev, { role: 'ai', text: "Complaint parsed successfully. Form updated." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error connecting to the backend." }]);
    }
    setLoading(false);
  };

  // Handle PDF/File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMessages(prev => [...prev, { role: 'user', text: `📎 Uploaded Document: ${file.name}` }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', 'Please extract the complaint details from this document.');
      formData.append('current_state', JSON.stringify(currentData));

      const response = await axios.post('http://localhost:8000/api/ai/process', formData);
      dispatch(updateComplaintData(response.data.data));
      
      setMessages(prev => [...prev, { role: 'ai', text: `PDF analysis complete. I've successfully extracted the details from ${file.name} and updated the form.` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error processing the document." }]);
    }
    
    setLoading(false);
    event.target.value = null; // Reset input so you can upload the same file again if needed
  };

  return (
    <div className="w-1/2 h-full bg-gray-50 flex flex-col border-l relative">
      
      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-indigo-900 flex items-center">
          <span className="mr-2">🔬</span> AIVOA Copilot
        </h2>
        <p className="text-sm text-gray-500 mt-1">Drop complaint files or paste text below.</p>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-lg shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-lg rounded-bl-none text-gray-500 text-sm italic shadow-sm">
              Analyzing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t mt-auto">
        <div className="flex items-center bg-gray-50 border rounded-lg p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.txt" 
          />
          
          {/* Attachment Button */}
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="p-2 text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none"
            title="Upload PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message or upload a PDF..."
            className="flex-1 bg-transparent p-2 outline-none text-sm"
            disabled={loading}
          />
          
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()} 
            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
};

export default CopilotChat;