import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import axios from "axios";
import "quill/dist/quill.snow.css";
import Sidebar from "../components/sidebar";

const ALL_EMOJIS = ["😀","😁","😅","😎","🤩","🥰","😇","🤔","😴","😡","😭","😃","🤗","😌"];

const JournalEntry = () => {
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [randomEmojis, setRandomEmojis] = useState([]);
  const [affirmation, setAffirmation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  // Random 5 emojis
  useEffect(() => {
    const shuffled = [...ALL_EMOJIS].sort(() => 0.5 - Math.random());
    setRandomEmojis(shuffled.slice(0, 5));
  }, []);

  // Mock affirmation
  useEffect(() => {
    const affirmations = [
      "I am capable of achieving my goals.",
      "Today is a fresh start.",
      "I am grateful for what I have.",
      "I radiate positivity and peace.",
      "Every step I take brings me closer to my dreams."
    ];
    setAffirmation(
      affirmations[Math.floor(Math.random() * affirmations.length)]
    );
  }, []);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your goals, gratitude, and tomorrow’s plans...",
        modules: {
          toolbar: "#journal-toolbar",
        },
      });
    }
  }, []);

  const toggleEmoji = (emoji) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
    } else if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  // Format image before preview (resize to max 400x400)
  const formatImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height *= maxSize / width;
            width = maxSize;
          } else {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    formatImage(file, (formattedUrl) => {
      setImagePreview(formattedUrl);
      setShowPreview(true);
    });
  }
};

  
  const handleSave = async () => {
    const content = quillInstance.current.root.innerHTML;
    const date = new Date().toISOString();

    let imageUrl = null;
    if (imagePreview) {
      // If you want to send the formatted image data URL, you can send imagePreview
      // Otherwise, upload the image file as before
      // Here, let's upload the file if present
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }
    }

    await axios.post("/api/journals", {
      content,
      imageUrl,
      date,
    });

    alert("Journal saved!");
  };
// ...existing code...
return (
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <div className="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <div className="flex-1 p-8">
      {/* Heading + Affirmation */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold">
          Journal - {new Date().toLocaleDateString()}
        </h1>
        <p className="italic text-purple-700 max-w-sm text-right">
          🌸 {affirmation}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left column (Mood + Journal stacked) */}
        <div className="col-span-2 space-y-8">
          {/* Mood Tracker */}
          <div className="bg-purple-100 rounded-xl p-4 shadow">
            <h2 className="font-semibold mb-2">Mood Tracker</h2>
            <div className="flex space-x-3 text-2xl">
              {randomEmojis.map((emoji) => (
                <span
                  key={emoji}
                  onClick={() => toggleEmoji(emoji)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedEmojis.includes(emoji)
                      ? "bg-purple-300"
                      : "bg-white"
                  }`}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Select up to 3 moods.</p>
          </div>

          {/* Journal (Quill editor inside beige block) */}
          <div className="bg-purple-100 rounded-xl p-4 shadow space-y-2">
            <h2 className="font-semibold mb-2">Today's Journal</h2>

            {/* Custom Toolbar above editor */}
            <div id="journal-toolbar" className="mb-2 flex flex-wrap gap-2">
              <select className="ql-header" defaultValue="">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="">Normal</option>
              </select>
              <button className="ql-bold"></button>
              <button className="ql-italic"></button>
              <button className="ql-underline"></button>
              <button className="ql-strike"></button>
              <button className="ql-list" value="ordered"></button>
              <button className="ql-list" value="bullet"></button>
              <button className="ql-link"></button>
              <select className="ql-color"></select>
              <select className="ql-background"></select>
              <button className="ql-clean"></button>
            </div>

            <div
              ref={editorRef}
              className="w-full h-60 p-3 rounded-md bg-white"
            ></div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Save Journal
          </button>
        </div>

        {/* Right column (Today's Picture) */}
        <div className="row-span-2 bg-blue-100 rounded-xl p-4 shadow flex flex-col items-center">
          <h2 className="font-semibold mb-2 text-base">Today's Picture 📸</h2>
          <div className="flex gap-2 mb-2">
            <label className="cursor-pointer bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs border border-blue-200 hover:bg-blue-100 transition">
              📤 select pic
              <input
                id="journal-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {showPreview && imagePreview && (
            <div className="w-full h-64 overflow-hidden rounded-md shadow-md flex items-center bg-white border border-blue-200">
              <img
                src={imagePreview}
                alt="Today's Picture"
                className="object-cover w-full h-full rounded"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};
export default JournalEntry
// ...existing code...