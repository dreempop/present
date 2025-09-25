'use client';
import { useState, useEffect } from 'react';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลรูป (เหมือนเดิม)
  const fetchImages = async () => {
    const res = await fetch('/api/gallery/list');
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description || !date) {
      alert('กรุณากรอกข้อมูลให้ครบและเลือกไฟล์');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('file', file);

    const res = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('อัปโหลดสำเร็จ');
      setTitle('');
      setDescription('');
      setDate('');
      setFile(null);
      fetchImages();
    } else {
      const err = await res.json();
      alert('เกิดข้อผิดพลาด: ' + err.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">อัปโหลดรูปภาพคลังภาพ</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="หัวข้อ"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border border-green-600 rounded px-3 py-2"
        />
        <textarea
          placeholder="คำอธิบาย"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full border border-green-600 rounded px-3 py-2 resize-none"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="w-full border border-green-600 rounded px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700 font-semibold"
        >
          {loading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
        </button>
      </form>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={img.public_url} alt={img.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-green-700">{img.title}</h3>
              <p className="text-sm text-green-800 mt-1">{img.description}</p>
              <p className="text-xs text-green-500 mt-2">📅 {img.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
