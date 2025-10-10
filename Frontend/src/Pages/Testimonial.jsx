import React, { useEffect, useState } from "react";
import ApiService from "../components/API/api-service";

const Testimonial = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await ApiService.getTestimonials();
        const list = resp?.data?.testimonials || [];
        setVideos(list);
      } catch (e) {
        setError("Failed to fetch testimonial videos");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="container-fluid m-auto py-14 flex flex-col justify-center items-center h-auto px-9 md:px-8 lg:px-16 overflow-hidden gap-4">
      <h2 className="text-4xl font-serif text-amber-900 mb-3">Testimonial</h2>
      {loading && <div className="text-lg text-gray-600">Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex flex-col md:flex-row gap-4 ">
        {videos.length === 0 && !loading && (
          <div className="text-gray-500">No testimonial videos found.</div>
        )}
        {videos.map((vid) => (
          <div key={vid._id} className="flex justify-center px-10 sm:px-0">
            <video
              src={vid.videoUrl}
              controls
              autoPlay
              muted
              loop
              className="w-full md:w-full h-[400px] rounded-lg"
            />
            {vid.description && (
              <div className="text-center text-sm text-gray-700 mt-2">
                {vid.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
