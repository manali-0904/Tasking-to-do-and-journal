import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Modal from "react-modal";
import JournalCard from "../components/JournalCard";
Modal.setAppElement("#root");

function Journal() {
  const [journal] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const navigate = useNavigate();

  const openJournal = (entry) => {
    setSelectedJournal(entry);
    setIsModalOpen(true);
  };


const Journal = () => {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch("/api/journals");
        const data = await res.json();
        setJournals(data);
      } catch (err) {
        console.error("Error fetching journals:", err);
      }
    };
    fetchJournals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Journal ✨</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {journals.map((journal) => (
          <JournalCard key={journal._id} journal={journal} />
        ))}
      </div>
    </div>
  );
};

  return (
    
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">My Journal</h1>

        {/* New Entry Button */}
        <button onClick={() => navigate("/journal/new")} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
>
  ✍️ New Journal Entry
</button>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journal.map((entry) => (
            <div
              key={entry.id}
              onClick={() => openJournal(entry)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg"
            >
              <h3 className="font-bold">{entry.date}</h3>
              <p
                className="text-gray-600 mt-1"
                dangerouslySetInnerHTML={{
                  __html: entry.morning.slice(0, 50) + "...",
                }}
              />
              <p
                className="text-gray-600 mt-1"
                dangerouslySetInnerHTML={{
                  __html: entry.night.slice(0, 50) + "...",
                }}
              />
              {entry.image && (
                <img
                  src={entry.image}
                  alt="thumb"
                  className="mt-2 h-24 w-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>

        {/* Modal View */}
        {selectedJournal && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedJournal.date}</h2>
            <h3 className="font-semibold">🌅 Morning Goals</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedJournal.morning }} />

            <h3 className="font-semibold mt-4">🌙 Night Gratitude</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedJournal.night }} />

            {selectedJournal.image && (
              <img src={selectedJournal.image} alt="journal" className="mt-4 rounded" />
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Close
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Journal;
