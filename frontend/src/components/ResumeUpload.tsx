import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ResumeUploadProps {
  onResumeUpload: (text: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('resume', file);
    
    setUploading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFile(file.name);
      onResumeUpload(response.data.resumeText);
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setUploading(false);
    }
  }, [onResumeUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        uploadedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
      }`}
    >
      <input {...getInputProps()} />
      {uploadedFile ? (
        <div className="flex flex-col items-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="mt-2 text-sm text-green-600">
            Successfully uploaded: {uploadedFile}
          </p>
          <p className="text-xs text-green-500 mt-1">
            Click or drag to replace
          </p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {uploading
              ? 'Uploading...'
              : isDragActive
              ? 'Drop your resume here...'
              : 'Drag & drop your resume, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </>
      )}
    </div>
  );
};