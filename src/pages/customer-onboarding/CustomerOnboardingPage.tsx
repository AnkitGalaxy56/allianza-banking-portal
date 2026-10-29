import { useState } from 'react';
import {
  Alert, Box, Button, Divider, MenuItem, Paper, Snackbar, Stack, Step, StepLabel,
  Stepper, TextField, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton,
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';

const steps = ['Personal Details', 'Address Details', 'Employment', 'Documents'];
type FormData = Record<string, string>;
const initialForm: FormData = {
  leadId: '', customerNumber: '', pan: '', fullName: '', dob: '', age: '', fatherName: '', motherName: '',
  email: '', customerType: '', aadhaar: '', ckyc: '', gender: '', mobile: '', maritalStatus: '', alternateContact: '', occupation: '',
  residentialStatus: '', residentialType: '', flat: '', street: '', landmark: '', city: '', state: '', pinCode: '',
  employmentType: '', designation: '', employerName: '', employerCode: '', joiningDate: '', retirementDate: '', qualification: '', employerEmail: '', location: '',
};
type UploadedDocument = { id: number; name: string; fileName: string; expiryDate: string; remarks: string; file?: File };
const personalFields: [string, string, number?][] = [
  ['leadId','Lead ID'], ['customerNumber','Customer Number'], ['pan','PAN Card'], ['fullName','Full Name'], ['dob','Date of Birth'], ['age','Age'],
  ['fatherName','Father / Husband Name'], ['motherName',"Mother’s Name"], ['email','Email ID'], ['customerType','Customer Type'], ['aadhaar','Aadhaar Card'],
  ['ckyc','CKYC Regn'], ['gender','Gender'], ['mobile','Mobile No.'], ['maritalStatus','Marital Status'], ['alternateContact','Alternate Contact'], ['occupation','Occupation'],
];
function Field({ name, label, form, update, type = 'text', options }: { name: string; label: string; form: FormData; update: (key: string, value: string) => void; type?: string; options?: string[] }) {
  return <TextField fullWidth size="small" label={label} value={form[name] ?? ''} type={type} onChange={(e) => update(name, e.target.value)} select={Boolean(options)} InputLabelProps={type === 'date' ? { shrink: true } : undefined}>
    {options?.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
  </TextField>;
}
export default function CustomerOnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    { id: 1, name: 'Identity Proof', fileName: '', expiryDate: '', remarks: '' },
    { id: 2, name: 'Address Proof', fileName: '', expiryDate: '', remarks: '' },
  ]);
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const next = () => {
    if (step === 0 && (!form.fullName.trim() || !form.mobile.trim())) { setNotice('Please enter Full Name and Mobile No.'); return; }
    if (step < 3) setStep((current) => current + 1);
    else { setSaved(true); setNotice('Customer record saved successfully.'); }
  };
  const previous = () => setStep((current) => Math.max(0, current - 1));
  const cancel = () => { setForm(initialForm); setDocuments([{ id: 1, name: 'Identity Proof', fileName: '', expiryDate: '', remarks: '' }, { id: 2, name: 'Address Proof', fileName: '', expiryDate: '', remarks: '' }]); setStep(0); setSaved(false); setNotice('Form cleared.'); };
  const updateDoc = (id: number, key: keyof UploadedDocument, value: string | File) => setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, [key]: value, ...(key === 'file' && value instanceof File ? { fileName: value.name } : {}) } : doc));
  if (saved) return <Box>
    <PageHeader title="Customer Onboarding" subtitle="Individual customer registration" />
    <Paper variant="outlined" sx={{ maxWidth: 720, mx: 'auto', mt: 4, p: { xs: 3, md: 6 }, borderRadius: 3, textAlign: 'center' }}>
      <CheckCircleOutlineRoundedIcon color="success" sx={{ fontSize: 76, mb: 1 }} />
      <Typography variant="h4" fontWeight={800} gutterBottom>Record Saved Successfully</Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>The individual customer onboarding form has been completed.</Typography>
      {form.fullName && <Typography fontWeight={700} sx={{ mb: 3 }}>{form.fullName}</Typography>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button variant="contained" onClick={() => navigate('/user-management')}>View User Management</Button>
        <Button variant="outlined" onClick={() => { setForm(initialForm); setStep(0); setSaved(false); }}>Add Another Customer</Button>
      </Stack>
      <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>This screen currently demonstrates the onboarding workflow in the UI. Connect the save action to your customer API to persist records.</Alert>
    </Paper>
    <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')} message={notice} />
  </Box>;
  return <Box>
    <PageHeader title="Customer Onboarding" subtitle="Register an individual customer in four guided steps" />
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: .5 }}>Step {step + 1} of {steps.length} · {steps[step]}</Typography>
        <Stepper activeStep={step} alternativeLabel sx={{ mt: 2, '& .MuiStepLabel-label': { fontSize: { xs: 11, sm: 13 }, fontWeight: 600 } }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '190px minmax(0,1fr)' }, minHeight: 400 }}>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRight: { md: 1 }, borderBottom: { xs: 1, md: 0 }, borderColor: 'divider' }}>
          <Typography variant="overline" color="text.secondary" fontWeight={800}>Onboarding sections</Typography>
          <Stack spacing={.75} sx={{ mt: 1 }}>
            {steps.map((label, index) => <Button key={label} variant={step === index ? 'contained' : 'text'} color={step === index ? 'primary' : 'inherit'} onClick={() => setStep(index)} sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}>{label}</Button>)}
          </Stack>
        </Box>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {step === 0 && <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,minmax(0,1fr))' }, gap: 2 }}>
            {personalFields.map(([name, label]) => <Field key={name} name={name} label={label} form={form} update={update} type={name === 'dob' ? 'date' : 'text'} options={name === 'gender' ? ['Male','Female','Other'] : name === 'maritalStatus' ? ['Single','Married','Divorced','Widowed'] : name === 'customerType' ? ['Individual','Salaried','Self-employed'] : undefined} />)}
          </Box>}
          {step === 1 && <Box sx={{ maxWidth: 760, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))' }, gap: 2 }}>
            <Field name="residentialStatus" label="Residential Status" form={form} update={update} options={['Resident','Non-Resident','NRI']} />
            <Field name="residentialType" label="Residential Type" form={form} update={update} options={['Owned','Rented','Family Owned','Other']} />
            <Field name="flat" label="Flat / Building Name" form={form} update={update} />
            <Field name="street" label="Street / Road" form={form} update={update} />
            <Field name="landmark" label="Land Mark" form={form} update={update} />
            <Field name="city" label="City" form={form} update={update} />
            <Field name="state" label="State" form={form} update={update} />
            <Field name="pinCode" label="PinCode" form={form} update={update} />
          </Box>}
          {step === 2 && <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))' }, gap: 2, maxWidth: 850 }}>
            <Field name="employmentType" label="Employment Type" form={form} update={update} options={['Salaried','Self-employed','Business','Student','Retired','Unemployed']} />
            <Field name="qualification" label="Qualification" form={form} update={update} />
            <Field name="designation" label="Designation" form={form} update={update} />
            <Field name="employerEmail" label="Emp. Email ID" form={form} update={update} type="email" />
            <Field name="employerCode" label="Employer Code" form={form} update={update} />
            <Field name="employerName" label="Employer Name" form={form} update={update} />
            <Field name="joiningDate" label="Date of Joining" form={form} update={update} type="date" />
            <Field name="location" label="Location" form={form} update={update} />
            <Field name="retirementDate" label="Date of Retirement" form={form} update={update} type="date" />
          </Box>}
          {step === 3 && <>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Customer Documents</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Upload supporting documents, set expiry dates, and add remarks.</Typography>
            <TableContainer component={Paper} variant="outlined"><Table size="small" sx={{ minWidth: 680 }}>
              <TableHead><TableRow sx={{ bgcolor: 'grey.50' }}>{['Sr','Document Name','Document Upload','Expiry Date','Remarks','View / Delete'].map((h) => <TableCell key={h} sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>{h}</TableCell>)}</TableRow></TableHead>
              <TableBody>{documents.map((doc, index) => <TableRow key={doc.id}>
                <TableCell>{index + 1}</TableCell><TableCell sx={{ minWidth: 150 }}><TextField size="small" variant="standard" value={doc.name} onChange={(e) => updateDoc(doc.id,'name',e.target.value)} /></TableCell>
                <TableCell sx={{ minWidth: 180 }}><Button component="label" size="small" variant="outlined">Browse<input hidden type="file" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) updateDoc(doc.id,'file',file); }} /></Button><Typography variant="caption" display="block" noWrap sx={{ maxWidth: 170 }}>{doc.fileName || 'No file selected'}</Typography></TableCell>
                <TableCell><TextField size="small" type="date" value={doc.expiryDate} onChange={(e) => updateDoc(doc.id,'expiryDate',e.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: 145 }} /></TableCell>
                <TableCell><TextField size="small" value={doc.remarks} onChange={(e) => updateDoc(doc.id,'remarks',e.target.value)} /></TableCell>
                <TableCell><Stack direction="row"><IconButton size="small" disabled={!doc.fileName} title="View file" onClick={() => setNotice(`Selected file: ${doc.fileName}`)}><VisibilityOutlinedIcon fontSize="small" /></IconButton><IconButton size="small" onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))} title="Delete row"><DeleteOutlineRoundedIcon fontSize="small" /></IconButton></Stack></TableCell>
              </TableRow>)}</TableBody>
            </Table></TableContainer>
            <Button sx={{ mt: 1.5 }} onClick={() => setDocuments((current) => [...current, { id: Date.now(), name: '', fileName: '', expiryDate: '', remarks: '' }])}>+ Add Document</Button>
          </>}
        </Box>
      </Box>
      <Divider />
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2.5 }}>
        <Button color="inherit" variant="outlined" onClick={cancel}>Cancel</Button>
        {step > 0 && <Button variant="outlined" onClick={previous}>Previous</Button>}
        <Button variant="contained" onClick={next}>{step === 3 ? 'Submit & Finish' : 'Next'}</Button>
      </Stack>
    </Paper>
    <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={notice.includes('Please') ? 'warning' : 'info'} onClose={() => setNotice('')}>{notice}</Alert></Snackbar>
  </Box>;
}
