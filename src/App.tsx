import React, { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';
import { Poster } from './Poster';
import type { PosterData } from './Poster';

export default function App() {
  const posterRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<PosterData>({
    studentName: '',
    rank: '',
    examSubtitle: '૨૦૨૪-૨૫ નું ધોરણ ૧૦ નું પરિણામ',
    pr: '',
    grade: '',
    photoUrl: null,
    subjects: [
      { name: 'MATHS', marks: '' },
      { name: 'SCIENCE', marks: '' },
      { name: 'SOCIAL SCIENCE', marks: '' },
      { name: 'ENGLISH', marks: '' },
    ],
    phone: ''
  });

  const [scale, setScale] = useState(0.6);

  // Auto-resize poster to fit viewport height
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 1024;
      const availableHeight = isMobile ? window.innerHeight * 0.7 : window.innerHeight - 80;
      const originalHeight = 1120;
      const originalWidth = 800;

      const scaleByHeight = availableHeight / originalHeight;
      const scaleByWidth = (window.innerWidth - 40) / originalWidth; // Extra padding

      const newScale = Math.min(isMobile ? scaleByWidth : scaleByHeight, 1);
      setScale(newScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result && typeof event.target.result === 'string') {
          const base64Str = event.target.result;
          setData(prev => ({ ...prev, photoUrl: base64Str }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectChange = (index: number, field: 'name' | 'marks', value: string) => {
    const newSubjects = [...data.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      // The scale(${scale}) on the parent absolutely destroys html2canvas text kerning on macOS.
      // We must strip the scale entirely, let the DOM reflow to native 800x1120, capture, then restore.
      const scaleWrapper = document.getElementById('poster-scale-wrapper');
      let originalTransform = '';
      if (scaleWrapper) {
        originalTransform = scaleWrapper.style.transform;
        scaleWrapper.style.transform = 'scale(1)';
      }

      // 300ms delay to guarantee the browser repaints the unscaled font metrics
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        pixelRatio: 2, // High quality
        cacheBust: true, // Prevents Safari from using bad metrics for fonts
        style: {
          transform: 'none',
        }
      });

      if (scaleWrapper) {
        scaleWrapper.style.transform = originalTransform; // Restore 
      }

      const link = document.createElement('a');
      link.download = `SSV_Poster_${data.studentName.replace(/ /g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate poster", err);
      alert("Error generating poster. Please try again.");
    }
  };

  return (
    <div className="layout-wrapper">

      {/* Left Sidebar Form */}
      <div className="sidebar-form">
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Poster Generator</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>SSV Academy Result Posters</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Student Photo</label>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '20px', border: '2px dashed #d1d5db', borderRadius: '12px', cursor: 'pointer',
              backgroundColor: '#f9fafb', color: '#6b7280'
            }}>
              {data.photoUrl ? (
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={data.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ position: 'absolute', bottom: -10, right: -10, background: 'white', padding: 4, borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Upload size={16} />
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon size={32} style={{ marginBottom: 8 }} />
                  <span style={{ fontSize: '14px' }}>Click to upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Student Name</label>
              <input style={inputStyle} placeholder="e.g. FIRST LAST NAME" value={data.studentName} onChange={e => setData({ ...data, studentName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Rank / Title</label>
              <input style={inputStyle} placeholder="e.g. UNIVERSAL 1st" value={data.rank} onChange={e => setData({ ...data, rank: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Exam Subtitle</label>
            <input style={inputStyle} placeholder="e.g. ૨૦૨૪-૨૫ નું ધોરણ ૧૦ નું પરિણામ" value={data.examSubtitle} onChange={e => setData({ ...data, examSubtitle: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>PR</label>
              <input style={inputStyle} placeholder="e.g. 94.71" value={data.pr} onChange={e => setData({ ...data, pr: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Grade</label>
              <input style={inputStyle} placeholder="e.g. A2" value={data.grade} onChange={e => setData({ ...data, grade: e.target.value })} />
            </div>
          </div>

          <h3 style={{ fontSize: '16px', marginTop: '30px', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Subjects & Marks</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            {data.subjects.map((sub, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Subject {idx + 1}</label>
                  <input style={inputStyle} placeholder="e.g. MATHS" value={sub.name} onChange={e => handleSubjectChange(idx, 'name', e.target.value)} />
                </div>
                <div style={{ width: '120px' }}>
                  <label style={labelStyle}>Marks</label>
                  <input style={inputStyle} placeholder={`e.g. ${['98/100', '94/100', '91/100', '97/100'][idx % 4]}`} value={sub.marks} onChange={e => handleSubjectChange(idx, 'marks', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={labelStyle}>Phone Number(s) for Admission</label>
            <input style={inputStyle} placeholder="e.g. 9426828632, 9998983688" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
          </div>

        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <button
            onClick={downloadPoster}
            style={{
              width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.3)', marginBottom: '20px'
            }}>
            <Download size={20} />
            Download HD Poster
          </button>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            © 2026 Designed by <a href="https://uimitra.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Uimitra</a>
          </div>
        </div>
      </div>

      {/* Right Side Preview Area */}
      <div className="preview-area">

        {/* Scale Container to fit the 800x1120 poster appropriately */}
        <div
          id="poster-scale-wrapper"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.0s', // Removed transition so export reflow is instantaneous
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
          {/* Note: The ref is attached inside the scaling wrapper directly on the Poster to extract rendering data without transform issues. */}
          <div style={{ position: 'relative' }}>
            <Poster data={data} ref={posterRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '6px',
  fontSize: '13px',
  color: '#374151'
};
