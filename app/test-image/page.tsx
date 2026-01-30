export default function TestImagePage() {
  return (
    <div style={{ padding: 50, background: '#333', color: 'white', minHeight: '100vh' }}>
      <h1>Image Serving Test</h1>
      
      <div style={{ marginBottom: 50 }}>
        <h2>1. Known Existing Image</h2>
        <p>Path: <code>/team/Navya_Sharma.jpg</code></p>
        <p>This image DOES exist in <code>public/team/</code>.</p>
        <img 
          src="/team/Navya_Sharma.jpg" 
          alt="Navya - Should load" 
          style={{ width: 200, border: '5px solid green' }} 
        />
        <p>If this image loads (Green Border), the server is WORKING.</p>
        <p>If this fails, there is still a config/blocking issue.</p>
      </div>

      <div style={{ marginBottom: 50 }}>
        <h2>2. Known MISSING Image</h2>
        <p>Path: <code>/team/aparna.jpeg</code></p>
        <p>This image DOES NOT exist in <code>public/team/</code>.</p>
        <img 
          src="/team/aparna.jpeg" 
          alt="Aparna - Should fail" 
          style={{ width: 200, border: '5px solid red', minHeight: 100, background: '#555' }} 
        />
        <p>This image is EXPECTED to fail (404).</p>
      </div>

      <div>
        <h2>3. Unsupported Format (HEIC/DNG)</h2>
        <p>Path: <code>/team/Anubhav Kansal.DNG</code></p>
        <img 
           src="/team/Anubhav Kansal.DNG"
           alt="DNG - Should fail in browser"
           style={{ width: 200, border: '5px solid orange' }}
        />
        <p>Even if served, browsers often cannot display DNG/HEIC.</p>
      </div>
    </div>
  );
}
