import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const enhanceImage = async (scale) => {
    if (!image) return alert("Upload an image first");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("scale", scale);

    const res = await fetch("/api/enhance", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    setEnhancedImage(URL.createObjectURL(blob));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">TUNZY SHOP HD</h1>

      <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />

      <div className="flex gap-4 mb-6">
        <button onClick={() => enhanceImage(2)} className="px-6 py-2 bg-blue-500 text-white rounded">2x HD (Inshot)</button>
        <button onClick={() => enhanceImage(4)} className="px-6 py-2 bg-green-500 text-white rounded">4x HD (Wink)</button>
        <button onClick={() => enhanceImage(8)} className="px-6 py-2 bg-purple-500 text-white rounded">8x HD (Inshot+Wink)</button>
      </div>

      {loading && <p>Processing image...</p>}

      {enhancedImage && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Enhanced Image:</h2>
          <img src={enhancedImage} alt="Enhanced" className="max-w-full rounded shadow-lg" />
        </div>
      )}
    </div>
  );
}
