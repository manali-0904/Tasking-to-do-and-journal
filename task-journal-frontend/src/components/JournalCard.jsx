// src/components/JournalCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const JournalCard = ({ journal }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/journals/${journal._id}`)}
      className="bg-purple-200 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="font-semibold text-lg">{journal.title || "Untitled"}</h2>
      <p className="text-sm text-gray-600 truncate">
        {journal.content || "No content..."}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(journal.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default JournalCard;
