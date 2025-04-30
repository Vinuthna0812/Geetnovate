import React from 'react';
import { HistoryItem } from '../App';

interface HistoryLogProps {
  history: HistoryItem[];
  onClose: () => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, onClose }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Activity History</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500">No history items yet</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between">
                <span className="font-medium">{item.action}</span>
                <span className="text-sm text-gray-500">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.details}</p>
              <div className="text-xs text-gray-400 mt-1">
                {item.userRole}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryLog;