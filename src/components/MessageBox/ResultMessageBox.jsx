import React from "react";

export default function ResultMessageBox({ backendMessage, backendResultType, showResultMessageBox, setShowResultMessageBox }) {
  
  if (!showResultMessageBox) return null; // Only render if the modal is visible


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`p-4 rounded-lg shadow-lg border w-96 bg-white`}>
        <div className="flex justify-between items-center">
          <p className="font-medium">{backendMessage}</p>
          <button
            onClick={() => setShowResultMessageBox(false)} 
            className="ml-4 text-lg font-bold focus:outline-none"
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}