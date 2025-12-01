import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const enhance = async (scale) => {
    if (!image) return alert("Upload an image first!");
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("image", image);
    form.append("scale", scale);

    try {
      const res = await fetch("/api/enhance", { method: "POST", body: form });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      alert("Enhance failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `HD-image.jpg`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">TUNZY SHOP HD</h1>

      <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        {/* Logo */}
        <img src="/tunzy-logo.jpg" alt="TUNZY SHOP HD" className="w-32 mb-4 rounded" />

        {/* Upload */}
        <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />

        {/* Preview */}
        {preview && <img src={preview} className="mb-4 rounded-lg shadow max-w-full" />}

        {/* Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <button onClick={() => enhance(2)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            2X HD
          </button>
          <button onClick={() => enhance(4)} className="px-4 py-2 bg-green-600 text-white rounded-lg">
            4X HD
          </button>
          <button onClick={() => enhance(8)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            8X HD
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-700 font-medium mb-4">Enhancing image...</p>}

        {/* Result */}
        {result && (
          <div className="flex flex-col items-center">
            <p className="font-semibold mb-2">HD Result:</p>
            <img src={result} className="rounded-lg shadow max-w-full mb-2" />
            <button onClick={downloadImage} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
              Download HD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
