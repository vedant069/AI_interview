import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';

interface ResumeUploadProps {
  onResumeUpload: (text: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);
    
    try {
      const resumeText = await ApiService.uploadResume(file);
      setUploadedFile(file.name);
      onResumeUpload(resumeText);
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      setError(error.response?.data?.error || 'Failed to upload resume');
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
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${uploadedFile 
            ? 'border-green-500 bg-green-50' 
            : error 
              ? 'border-red-300 bg-red-50'
              : isDragActive 
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-teal-200 hover:border-yellow-400 bg-white/50'
          }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-yellow-400 animate-spin" />
            <p className="mt-2 text-sm text-teal-600">
              Uploading your resume...
            </p>
          </div>
        ) : uploadedFile ? (
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
            <Upload className="mx-auto h-12 w-12 text-teal-400" />
            <p className="mt-2 text-sm text-teal-600">
              {isDragActive
                ? 'Drop your resume here...'
                : 'Drag & drop your resume, or click to select'}
            </p>
            <p className="text-xs text-teal-500 mt-1">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
};