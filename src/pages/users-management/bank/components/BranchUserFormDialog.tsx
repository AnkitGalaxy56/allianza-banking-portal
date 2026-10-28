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
  STATUS_OPTIONS,
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
              {editingUser ? 'Edit User Master' : 'User Master'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingUser ? 'Update employee details and application permissions.' : 'Create a bank user and configure their login and access.'}
            </Typography>
          </Box>
          <IconButton aria-label="Close form" onClick={onClose} disabled={saving} size="small">
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <Divider />
        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <Box component="form" id="branch-user-form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.25}>
              {/* Column 1: employee identity and login controls */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormTextField<BranchUserFormValues>
                    name="employeeId" control={control} label="Emp ID" placeholder="Enter employee ID" disabled={saving} size="small"
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>
                      Employee Name
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(70px, 0.85fr) repeat(3, minmax(0, 1fr))',
                        gap: 1,
                        alignItems: 'start',
                      }}
                    >
                      <FormSelectField<BranchUserFormValues>
                        name="title"
                        control={control}
                        label="Mr/Ms"
                        options={TITLE_OPTIONS}
                        disabled={saving}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="firstName"
                        control={control}
                        label="First name"
                        placeholder="First"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="middleName"
                        control={control}
                        label="Middle name"
                        placeholder="Middle"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                      <FormTextField<BranchUserFormValues>
                        name="lastName"
                        control={control}
                        label="Last name"
                        placeholder="Last"
                        disabled={saving}
                        size="small"
                        showLabel={false}
                      />
                    </Box>
                  </Box>

                  <FormTextField<BranchUserFormValues>
                    name="mobile" control={control} label="Mobile" placeholder="10-digit mobile number" type="tel" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="userName" control={control} label="User Name" placeholder="Enter username" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="role" control={control} label="User Role" options={USER_ROLE_OPTIONS} disabled={saving}
                  />
                  <FormMultiLookupField<BranchUserFormValues>
                    name="multiBranchAccess" control={control} label="Multi Branch Access" options={BRANCH_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="loginTime" control={control} label="LogIn Time" type="time" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="twoFactorLogin" control={control} label="2FA Login" options={TWO_FACTOR_OPTIONS} disabled={saving}
                  />
                </Stack>
              </Grid>

              {/* Column 2: contact, display and security settings */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormTextField<BranchUserFormValues>
                    name="email" control={control} label="Email ID" placeholder="name@bank.example" type="email" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="displayName" control={control} label="Display Name" placeholder="Name shown in the portal" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="systemRole" control={control} label="System Role" options={SYSTEM_ROLE_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="idleTimeoutSeconds" control={control} label="Idle Timeout In Secs" type="number" placeholder="300" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="logoutTime" control={control} label="LogOut Time" type="time" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="authenticationType" control={control} label="Authentication Type" options={AUTHENTICATION_OPTIONS} disabled={saving}
                  />
                </Stack>
              </Grid>

              {/* Column 3: status, branch and audit settings */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <FormSelectField<BranchUserFormValues>
                    name="status" control={control} label="Status" options={STATUS_OPTIONS} disabled={saving} labelAbove
                  />
                  <FormTextField<BranchUserFormValues>
                    name="dateOfBirth" control={control} label="Date of Birth" type="date" disabled={saving} size="small"
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="twoFactorDesignation" control={control} label="2FA Login Designation" options={TWO_FACTOR_DESIGNATION_OPTIONS} disabled={saving}
                  />
                  <FormLookupField<BranchUserFormValues>
                    name="branchId" control={control} label="Branch" options={BRANCH_OPTIONS} disabled={saving}
                  />
                  <FormTextField<BranchUserFormValues>
                    name="badLoginCount" control={control} label="No. of Bad Login" type="number" placeholder="0" disabled={saving} size="small"
                  />
                  <FormTextField<BranchUserFormValues>
                    name="inoperativeDate" control={control} label="In-Operative Date" type="date" disabled={saving} size="small"
                  />
                </Stack>
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
                              disabled={saving}
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
                      disabled={saving || Boolean(editingUser)}
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
            Cancel
          </Button>
          <Button
            type="submit"
            form="branch-user-form"
            variant="contained"
            disabled={saving}
            startIcon={editingUser ? undefined : <AddOutlinedIcon />}
          >
            {saving ? 'Saving…' : editingUser ? 'Save changes' : 'Save user'}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
