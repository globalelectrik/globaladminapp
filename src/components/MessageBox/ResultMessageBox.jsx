import React from "react";

export default function ResultMessageBox({
  backendMessage,
  backendResultType,
  showResultMessageBox,
  setShowResultMessageBox,
}) {
  if (!showResultMessageBox) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white border border-gray-300 rounded-lg shadow-md w-full max-w-md p-5">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{backendMessage}</p>
          <button
            onClick={() => setShowResultMessageBox(false)}
            className="text-base font-bold ml-4 hover:opacity-70"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
