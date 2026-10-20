import React, { useRef, useState, useCallback } from 'react';
import './UploadField.css';
import { ControlLabel } from '../FormLabel/ControlLabel';
import { Icon } from '../Icon';

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
  /** Called by a file's View button. By default the file opens in a new tab. */
  onView?: (file: UploadedFile) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const validateFile = (file: File, maxSize: number | undefined): string | null => {
  if (maxSize && file.size > maxSize) {
    return `File size exceeds ${formatFileSize(maxSize)}`;
  }
  return null;
};

/** Opens a picked file in a new tab, for the default View action. */
const openFile = (file: File) => {
  const url = URL.createObjectURL(file);
  window.open(url, '_blank', 'noopener');
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

/**
 * A file picker with a drop zone. The zone is a real file input underneath, so keyboard users
 * Tab to it and press Space or Enter to browse; dropped and picked files list below with their
 * size, upload progress, status, and View and Remove actions.
 */
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
  onView,
  disabled = false,
  required = false,
  className = ''
}) => {
  const id = React.useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const isControlled = controlledFiles !== undefined;
  const files = isControlled ? controlledFiles : internalFiles;
  const hasError = !!error;

  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const hintsId = `${id}-hints`;
  const describedBy = [hasError ? `${id}-error` : null, description ? `${id}-description` : null, hintsId]
    .filter(Boolean)
    .join(' ');

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles: File[] = Array.from(fileList);
    
    // Check max files limit
    if (maxFiles && files.length + newFiles.length > maxFiles) {
      return;
    }

    const validatedFiles: UploadedFile[] = newFiles
      .map(file => {
        const error = validateFile(file, maxSize);
        return {
          id: generateFileId(),
          file,
          status: error ? 'error' : undefined,
          error
        } as UploadedFile;
      })
      .filter((uploadedFile) => {
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
        <ControlLabel htmlFor={id} required={required}>
          {label}
        </ControlLabel>
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
          aria-label={label ? undefined : 'Upload files'}
          aria-invalid={hasError}
          aria-required={required || undefined}
          aria-describedby={describedBy}
        />

        <div className="upload-field-dropzone">
          {files.length === 0 ? (
            <>
              <Icon name="upload_2" size={20} color="var(--pada-color-neutral-600)" className="upload-field-icon" />
              <div className="upload-field-content">
                <p className="upload-field-text">
                  Drag and drop or click to upload files
                </p>
                <Hints id={hintsId} accept={accept} maxSize={maxSize} maxFiles={maxFiles} />
              </div>
            </>
          ) : (
            <div className="upload-field-content upload-field-content--with-files">
              <Icon name="upload_2" size={20} color="var(--pada-color-neutral-600)" className="upload-field-icon" />
              <p className="upload-field-text">
                Drag and drop or click to upload files
              </p>
              <Hints id={hintsId} accept={accept} maxSize={maxSize} maxFiles={maxFiles} />
            </div>
          )}

          {files.length > 0 && (
            <div className="upload-field-files" role="list" aria-label="Files" onClick={(e) => e.stopPropagation()}>
              {files.map((file) => (
                <div
                  key={file.id}
                  role="listitem"
                  className={`upload-field-file ${file.status ? `upload-field-file--${file.status}` : ''}`}
                  data-status={file.status}
                >
                  {file.status === 'success' ? (
                    <Icon name="tick_1" size={16} color="var(--pada-color-green-600)" />
                  ) : file.status === 'error' ? (
                    <Icon name="upload_fail" size={16} color="var(--pada-color-red-600)" />
                  ) : (
                    <Icon name="attachment_1" size={16} color="var(--pada-color-neutral-600)" />
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
                      <div
                        className="upload-field-progress"
                        role="progressbar"
                        aria-label={`Uploading ${file.file.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(file.progress)}
                      >
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
                        if (onView) onView(file);
                        else openFile(file.file);
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
                        <Icon name="delete" size={12} color="var(--pada-color-neutral-600)" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {description && !hasError && (
            <p id={`${id}-description`} className="upload-field-hint upload-field-description">
              {description}
            </p>
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

/** Accept, size and count limits, which also describe the file input. */
function Hints({ id, accept, maxSize, maxFiles }: { id: string; accept?: string; maxSize?: number; maxFiles?: number }) {
  return (
    <span id={id} className="upload-field-hints">
      {accept && <span className="upload-field-hint">Supported type(s): {accept}</span>}
      {maxSize && <span className="upload-field-hint">Max size: {formatFileSize(maxSize)}</span>}
      {maxFiles && <span className="upload-field-hint">Max count: {maxFiles}</span>}
    </span>
  );
}
