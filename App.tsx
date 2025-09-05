
import React, { useState, useEffect, useCallback } from 'react';
import type { ToastMessage } from './types';
import { AppSection, ToastType } from './types';
import { SubmitBatchForm, ClaimTokenForm, RetireTokenForm } from './components/ActionForms';

const sections = [AppSection.SUBMIT, AppSection.CLAIM, AppSection.RETIRE];

// Toast component defined locally
const Toast: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800";
  const typeClasses = {
    [ToastType.SUCCESS]: "text-green-500 dark:text-green-400",
    [ToastType.ERROR]: "text-red-500 dark:text-red-400",
    [ToastType.INFO]: "text-blue-500 dark:text-blue-400",
  };

  const Icon: React.FC<{ type: ToastType }> = ({ type }) => {
    switch(type) {
      case ToastType.SUCCESS: return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;
      case ToastType.ERROR: return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>;
      default: return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>;
    }
  }

  return (
    <div className={`${baseClasses} animate-fade-in-up`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 ${typeClasses[toast.type]}`}>
        <Icon type={toast.type} />
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <button type="button" onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.SUBMIT);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const renderContent = () => {
    const formProps = { addToast };
    switch (activeSection) {
      case AppSection.SUBMIT:
        return <SubmitBatchForm {...formProps} />;
      case AppSection.CLAIM:
        return <ClaimTokenForm {...formProps} />;
      case AppSection.RETIRE:
        return <RetireTokenForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
                PoWV<span className="text-brand-green">Tracker</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
                On-chain interface for the Proof of Waste Value protocol.
            </p>
        </header>

        <nav className="mb-10 flex justify-center">
          <div className="bg-gray-800 p-2 rounded-lg shadow-md flex space-x-2">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-green ${
                  activeSection === section
                    ? 'bg-brand-green text-white shadow'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>

      {/* Toast Container */}
      <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
