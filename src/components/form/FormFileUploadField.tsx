import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FilePreviewProps {
  file: File | null;
  existingUrl?: string;
  alt: string;
}

function FilePreview({ file, existingUrl, alt }: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string>();

  useEffect(() => {
    if (!file) {
      setObjectUrl(undefined);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const url = objectUrl ?? existingUrl;
  if (!url) return null;
  return (
    <Box component="img" src={url} alt={alt} sx={{ display: 'block', maxWidth: 180, maxHeight: 120, objectFit: 'contain', borderRadius: 1, border: 1, borderColor: 'divider', mt: 1.5 }} />
  );
}

export interface FormFileUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  existingPreviewUrl?: string;
  showImagePreview?: boolean;
}

/** Single-file upload. The form value becomes File | null; file upload/API logic stays in the page/service. */
export default function FormFileUploadField<T extends FieldValues>({
  name,
  control,
  label,
  accept = 'image/*,.pdf',
  maxSizeMB = 5,
  disabled,
  required,
  helperText,
  existingPreviewUrl,
  showImagePreview = true,
}: FormFileUploadFieldProps<T>) {
  const id = `field-${String(name).replace(/\./g, '-')}`;
  const [localError, setLocalError] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue: unknown = field.value;
        const file = typeof File !== 'undefined' && currentValue instanceof File ? currentValue : null;
        const storedUrl = typeof currentValue === 'string' && currentValue ? currentValue : existingPreviewUrl;
        const isImage = Boolean(file?.type.startsWith('image/')) || Boolean(!file && storedUrl && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(storedUrl));
        const errorText = localError || fieldState.error?.message;

        return (
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Typography component="label" htmlFor={id} variant="body2" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
              {label}{required ? ' *' : ''}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Button component="label" htmlFor={id} variant="outlined" startIcon={<CloudUploadOutlinedIcon />} disabled={disabled}>
                Choose file
                <Box
                  component="input"
                  id={id}
                  type="file"
                  accept={accept}
                  disabled={disabled}
                  sx={{ display: 'none' }}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const selected = event.target.files?.[0];
                    if (!selected) return;
                    if (selected.size > maxSizeMB * 1024 * 1024) {
                      setLocalError(`File size must be ${maxSizeMB} MB or less.`);
                      event.target.value = '';
                      return;
                    }
                    setLocalError('');
                    field.onChange(selected);
                    event.target.value = '';
                  }}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                {file?.name ?? (storedUrl ? 'Existing file selected' : `No file selected · max ${maxSizeMB} MB`)}
              </Typography>
              {(file || storedUrl) && (
                <Button
                  size="small"
                  color="inherit"
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  disabled={disabled}
                  onClick={() => {
                    field.onChange(null);
                    setLocalError('');
                  }}
                >
                  Remove
                </Button>
              )}
            </Stack>
            {errorText && <Alert severity="error" sx={{ mt: 1 }}>{errorText}</Alert>}
            {!errorText && helperText && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>{helperText}</Typography>}
            {showImagePreview && isImage && (
              <FilePreview file={file} existingUrl={file ? undefined : storedUrl} alt={`${label} preview`} />
            )}
            {file && !isImage && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <InsertDriveFileOutlinedIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">{(file.size / 1024).toFixed(1)} KB</Typography>
              </Stack>
            )}
          </Box>
        );
      }}
    />
  );
}
