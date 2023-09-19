import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@material-ui/core";
import "./App.css";
import Video from "./components/Video";
import AddVideo from "./components/AddVideo";

function App() {
  const [videos, setVideos] = useState([]);
  const [order, setOrder] = useState("desc");

  
  const fetchVideos = useCallback(async () => {
    const response = await fetch(`http://localhost:5000/?order=${order}`);
    if (response.ok) {
      const data = await response.json();
      setVideos(data);
    } else {
      console.error("Failed to fetch videos.");
    }
  }, [order]);

  useEffect(() => {
    fetchVideos();
  }, [order, fetchVideos]);
  const handleDelete = async (videoToDelete) => {
    const response = await fetch(`http://localhost:5000/${videoToDelete.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoToDelete.id)
      );
    } else {
      console.error("Video could not be deleted.");
    }
  };

  const handleUpVote = (videoToUpVote) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoToUpVote.id
          ? { ...video, rating: video.rating + 1 }
          : video
      )
    );
  };

  const handleDownVote = (videoToDownVote) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoToDownVote.id
          ? { ...video, rating: video.rating - 1 }
          : video
      )
    );
  };

  const handleAddVideo = (video) => {
    const newVideo = { ...video, id: Date.now() };
    setVideos((prevVideos) => [...prevVideos, newVideo]);
  };

  const handleToggleOrder = async () => {
    setOrder(order === "asc" ? "desc" : "asc");
    await fetchVideos();
  };
  return (
    <div className="App container">
      <div className="mb-3">
        <Button color="primary" variant="contained" onClick={handleToggleOrder}>
          Toggle Order
        </Button>
        <AddVideo onAdd={handleAddVideo} />
      </div>
      <div className="row">
        {videos.map((video) => (
          <Video
            key={video.id}
            video={video}
            onDelete={handleDelete}
            onUpVote={handleUpVote}
            onDownVote={handleDownVote}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
