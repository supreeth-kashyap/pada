import React, { useRef, useState, useCallback } from 'react';
import './UploadField.css';
import { FormLabel } from '../FormLabel';
import { Icon } from '../Icon';
import { Button } from '../Button';

export interface UploadedFile {
  id: string;
  file: File;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadFieldProps {
  label?: string;
  description?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  onUpload?: (files: File[]) => Promise<void> | void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const UploadField: React.FC<UploadFieldProps> = ({
  label,
  description,
  error,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  files: controlledFiles,
  onFilesChange,
  onUpload,
  disabled = false,
  required = false,
  className = ''
}) => {
  const id = React.useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isControlled = controlledFiles !== undefined;
  const files = isControlled ? controlledFiles : internalFiles;
  const hasError = !!error;

  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles: File[] = Array.from(fileList);
    
    // Check max files limit
    if (maxFiles && files.length + newFiles.length > maxFiles) {
      return;
    }

    const validatedFiles: UploadedFile[] = newFiles
      .map(file => {
        const error = validateFile(file);
        return {
          id: generateFileId(),
          file,
          status: error ? 'error' : undefined,
          error
        } as UploadedFile;
      })
      .filter((uploadedFile, index) => {
        if (uploadedFile.error) {
          return true; // Keep error files to show error message
        }
        return true;
      });

    const updatedFiles = multiple ? [...files, ...validatedFiles] : validatedFiles;

    if (!isControlled) {
      setInternalFiles(updatedFiles);
    }
    onFilesChange?.(updatedFiles);

    // Auto-upload if onUpload is provided
    if (onUpload && validatedFiles.some(f => !f.error)) {
      setIsUploading(true);
      const filesToUpload = validatedFiles.filter(f => !f.error).map(f => f.file);
      try {
        await onUpload(filesToUpload);
        // Update status to success
        const successFiles = updatedFiles.map(f => 
          validatedFiles.some(vf => vf.id === f.id) && !f.error
            ? { ...f, status: 'success' as const }
            : f
        );
        if (!isControlled) {
          setInternalFiles(successFiles);
        }
        onFilesChange?.(successFiles);
      } catch (err) {
        // Update status to error
        const errorFiles = updatedFiles.map(f => 
          validatedFiles.some(vf => vf.id === f.id)
            ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : 'Upload failed' }
            : f
        );
        if (!isControlled) {
          setInternalFiles(errorFiles);
        }
        onFilesChange?.(errorFiles);
      } finally {
        setIsUploading(false);
      }
    }
  }, [files, multiple, maxFiles, maxSize, isControlled, onFilesChange, onUpload]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    if (!isControlled) {
      setInternalFiles(updatedFiles);
    }
    onFilesChange?.(updatedFiles);
  };

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <div className={`upload-field-wrapper ${className}`.trim()}>
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      )}

      <div
        className={`upload-field-container ${isDragging ? 'upload-field-container--dragging' : ''} ${hasError ? 'upload-field-container--error' : ''} ${disabled ? 'upload-field-container--disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="upload-field-input"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : description ? `${id}-description` : undefined}
        />

        <div className="upload-field-dropzone">
          {files.length === 0 ? (
            <>
              <Icon name="upload_2" size="md" color="Icy" className="upload-field-icon" />
              <div className="upload-field-content">
                <p className="upload-field-text">
                  Drag and drop or click to upload files
                </p>
                {accept && (
                  <p className="upload-field-hint">Supported type(s): {accept}</p>
                )}
                {maxSize && (
                  <p className="upload-field-hint">Max size: {formatFileSize(maxSize)}</p>
                )}
                {maxFiles && (
                  <p className="upload-field-hint">Max count: {maxFiles}</p>
                )}
              </div>
            </>
          ) : (
            <div className="upload-field-content upload-field-content--with-files">
              <Icon name="upload_2" size="md" color="Icy" className="upload-field-icon" />
              <p className="upload-field-text">
                Drag and drop or click to upload files
              </p>
              {accept && (
                <p className="upload-field-hint">Supported type(s): {accept}</p>
              )}
              {maxSize && (
                <p className="upload-field-hint">Max size: {formatFileSize(maxSize)}</p>
              )}
              {maxFiles && (
                <p className="upload-field-hint">Max count: {maxFiles}</p>
              )}
            </div>
          )}

          {files.length > 0 && (
            <div className="upload-field-files" onClick={(e) => e.stopPropagation()}>
              {files.map((file) => (
                <div key={file.id} className={`upload-field-file ${file.status ? `upload-field-file--${file.status}` : ''}`}>
                  {file.status === 'success' ? (
                    <Icon name="tick_1" size="sm" color="Green" />
                  ) : file.status === 'error' ? (
                    <Icon name="upload_fail" size="sm" color="Red" />
                  ) : (
                    <Icon name="attachment_1" size="sm" color="Icy" />
                  )}
                  <div className="upload-field-file-info">
                    <div className="upload-field-file-header">
                      <span className="upload-field-file-name">{file.file.name}</span>
                      <span className="upload-field-file-size">{formatFileSize(file.file.size)}</span>
                    </div>
                    {file.error && (
                      <span className="upload-field-file-error">{file.error}</span>
                    )}
                    {file.progress !== undefined && file.progress < 100 && (
                      <div className="upload-field-progress">
                        <div 
                          className="upload-field-progress-bar" 
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="upload-field-file-actions">
                    <button
                      type="button"
                      className="upload-field-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle view action
                      }}
                      aria-label={`View ${file.file.name}`}
                    >
                      View
                    </button>
                    {!disabled && (
                      <button
                        type="button"
                        className="upload-field-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file.id);
                        }}
                        aria-label={`Remove ${file.file.name}`}
                      >
                        <Icon name="delete" size="xs" color="Icy" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasError && (
            <p id={`${id}-error`} className="upload-field-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
