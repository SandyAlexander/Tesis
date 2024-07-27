import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './silabo.module.css'; // Importa el archivo de estilos

export default function Silabo() {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch documents on page load
    const fetchDocuments = async () => {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents);
    };
    
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('File uploaded successfully');
      setFile(null);
      router.reload(); // Reload the page to update the list of documents
    } else {
      alert('Error uploading file');
    }
  };

  const handleDownload = async (fileId: number) => {
    const res = await fetch(`/api/documents/${fileId}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file-${fileId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div> {/* Capa de fondo semi-transparente */}
      <div className={styles.content}>
        <h1 className={styles.title}>Upload Silabo</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.inputFile} type="file" accept=".pdf" onChange={handleFileChange} required />
          <button className={styles.uploadButton} type="submit">Upload</button>
        </form>
        <h2 className={styles.subtitle}>All Documents</h2> {/* Aplicar la clase subtitle */}
        <ul className={styles.documentsList}>
          {documents.map(doc => (
            <li className={styles.documentItem} key={doc.id}>
              <span className={styles.documentName}>{doc.filename}</span>
              <button className={styles.downloadButton} onClick={() => handleDownload(doc.id)}>Download</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
