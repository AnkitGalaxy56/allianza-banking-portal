import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit, type SubmitHandler } from 'react-hook-form';

import FormTextField from '@/components/form/FormTextField';
import FormSelectField from '@/components/form/FormSelectField';
import FormLookupField from '@/components/form/FormLookupField';
import FormMultiLookupField from '@/components/form/FormMultiLookupField';
import type { BranchUser } from '@/types/branchUser';
import type { BranchUserFormValues } from '../schemas/branchUserSchema';
import {
  BRANCH_OPTIONS,
  TITLE_OPTIONS,
  USER_ROLE_OPTIONS,
  SYSTEM_ROLE_OPTIONS,
  TWO_FACTOR_DESIGNATION_OPTIONS,
  TWO_FACTOR_OPTIONS,
  AUTHENTICATION_OPTIONS,
} from '../data/branchUserOptions';

interface BranchUserFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingUser: BranchUser | null;
  formError: string;
  saving: boolean;
  control: Control<BranchUserFormValues>;
  errors: FieldErrors<BranchUserFormValues>;
  handleSubmit: UseFormHandleSubmit<BranchUserFormValues>;
  onSubmit: SubmitHandler<BranchUserFormValues>;
  themeName: string;
  readOnly?: boolean;
  verifying?: boolean;
  onAuthenticate?: () => void;
}

export default function BranchUserFormDialog({
  open,
  onClose,
  editingUser,
  formError,
  saving,
  control,
  errors,
  handleSubmit,
  onSubmit,
  themeName,
  readOnly = false,
  verifying = false,
  onAuthenticate,
}: BranchUserFormDialogProps) {
  return (
    <Dialog open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {verifying ? 'Verify User Master' : readOnly ? 'View User Master' : editingUser ? 'Edit User Master' : 'User Master'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {verifying ? 'Review the entered user details and authenticate this user.' : readOnly ? 'Read-only view of employee details and application permissions.' : editingUser ? 'Update employee details and application permissions.' : 'Create a bank user and configure their login and access.'}
          </Typography>
        </Box>
        <IconButton aria-label="Close form" onClick={onClose} disabled={saving} size="small">
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />
      <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <Box component="form" id="branch-user-form" noValidate onSubmit={readOnly ? (event) => event.preventDefault() : handleSubmit(onSubmit)}>
          <Grid container spacing={2.25}>
            {/* Employee ID, Email and Status */}
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="employeeId" control={control} label="Emp ID" placeholder="Enter employee ID" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="email" control={control} label="Email ID" placeholder="name@bank.example" type="email" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="status" control={control} label="Status" disabled size="small" />
            </Grid>

            {/* Employee Name uses the complete row, matching the PowerPoint layout. */}
            <Grid item xs={12}>
              <Box sx={{ minWidth: 0, width: '100%' }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>Employee Name</Typography>
                <Grid container spacing={1.25} alignItems="flex-start">
                  <Grid item xs={12} sm={2} md={1.5}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>Select Title</Typography>
                    <FormSelectField<BranchUserFormValues> name="title" control={control} label="Mr/Ms" placeholder="Select title" options={TITLE_OPTIONS} disabled={saving || readOnly} />
                  </Grid>
                  <Grid item xs={12} sm={10} md={3.5}>
                    <FormTextField<BranchUserFormValues> name="firstName" control={control} label="First Name" placeholder="First name" disabled={saving || readOnly} size="small" required />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3.5}>
                    <FormTextField<BranchUserFormValues> name="middleName" control={control} label="Middle Name" placeholder="Middle name (optional)" disabled={saving || readOnly} size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3.5}>
                    <FormTextField<BranchUserFormValues> name="lastName" control={control} label="Last Name" placeholder="Last name" disabled={saving || readOnly} size="small" required />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Login name is deliberately full width for comfortable entry. */}
            <Grid item xs={12}>
              <FormTextField<BranchUserFormValues> name="userName" control={control} label="User Name" placeholder="Enter username" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField<BranchUserFormValues> name="mobile" control={control} label="Mobile" placeholder="10-digit mobile number" type="tel" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField<BranchUserFormValues> name="displayName" control={control} label="Display Name" placeholder="Name shown in the portal" disabled={saving || readOnly} size="small" required />
            </Grid>

            {/* User Role and System Role stay aligned on the same row. */}
            <Grid item xs={12} md={6}>
              <FormLookupField<BranchUserFormValues> name="role" control={control} label="User Role" options={USER_ROLE_OPTIONS} disabled={saving || readOnly} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormLookupField<BranchUserFormValues> name="systemRole" control={control} label="System Role" options={SYSTEM_ROLE_OPTIONS} disabled={saving || readOnly} required />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormLookupField<BranchUserFormValues> name="branchId" control={control} label="Branch" options={BRANCH_OPTIONS} disabled={saving || readOnly} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormMultiLookupField<BranchUserFormValues> name="multiBranchAccess" control={control} label="Multi Branch Access" options={BRANCH_OPTIONS} disabled={saving || readOnly} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="dateOfBirth" control={control} label="Date of Birth" type="date" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormLookupField<BranchUserFormValues> name="twoFactorLogin" control={control} label="2FA Login" options={TWO_FACTOR_OPTIONS} disabled={saving || readOnly} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormLookupField<BranchUserFormValues> name="twoFactorDesignation" control={control} label="2FA Login Designation" options={TWO_FACTOR_DESIGNATION_OPTIONS} disabled={saving || readOnly} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="idleTimeoutSeconds" control={control} label="Idle Timeout In Secs" type="number" placeholder="300" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="loginTime" control={control} label="LogIn Time" type="time" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="logoutTime" control={control} label="LogOut Time" type="time" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormLookupField<BranchUserFormValues> name="authenticationType" control={control} label="Authentication Type" options={AUTHENTICATION_OPTIONS} disabled={saving || readOnly} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="badLoginCount" control={control} label="No. of Bad Login" type="number" placeholder="0" disabled={saving || readOnly} size="small" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormTextField<BranchUserFormValues> name="inoperativeDate" control={control} label="In-Operative Date" type="date" disabled={saving || readOnly} size="small" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
              Menu / Function Access Level
            </Typography>
            <Grid container spacing={1}>
              {([
                ['create', 'Create'],
                ['modify', 'Modify'],
                ['view', 'View'],
                ['authorise', 'Authorise'],
              ] as const).map(([fieldName, label]) => (
                <Grid item xs={6} sm={3} key={fieldName}>
                  <Controller
                    name={`accessLevel.${fieldName}`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(field.value)}
                            onChange={(_event, checked) => field.onChange(checked)}
                            disabled={saving || readOnly}
                          />
                        }
                        label={label}
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <FormControlLabel
            sx={{ mt: 1.25 }}
            control={
              <Controller
                name="sendLoginEmail"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={Boolean(field.value)}
                    onChange={(_event, checked) => field.onChange(checked)}
                    disabled={saving || readOnly || Boolean(editingUser)}
                  />
                )}
              />
            }
            label={<Typography variant="body2">Send login details by email</Typography>}
          />
          {Object.keys(errors).length > 0 && (
            <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
              Please correct the highlighted fields before saving.
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Bank theme: {themeName}. Lookup options are demonstration values until connected to backend master data.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
        {verifying && <Button variant="contained" color="success" onClick={onAuthenticate} disabled={saving}>
          {saving ? 'Authenticating…' : 'Authenticate'}
        </Button>}
        {!readOnly && <Button
          type="submit"
          form="branch-user-form"
          variant="contained"
          disabled={saving}
          startIcon={editingUser ? undefined : <AddOutlinedIcon />}
        >
          {saving ? 'Saving…' : editingUser ? 'Save changes' : 'Save user'}
        </Button>}
      </DialogActions>
    </Dialog>
  );
}
