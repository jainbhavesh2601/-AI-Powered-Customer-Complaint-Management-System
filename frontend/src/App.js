import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ComplaintForm from './components/ComplaintForm';
import CopilotChat from './components/CopilotChat';

function App() {
  return (
    <Provider store={store}>
      <div className="flex h-screen w-full font-inter">
        <ComplaintForm />
        <CopilotChat />
      </div>
    </Provider>
  );
}

export default App;