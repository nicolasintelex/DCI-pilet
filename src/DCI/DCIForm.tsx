import { useState, useRef } from 'react';
import {
  TextField,
  TextFieldProps,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  FilledInput,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { Field, useFormikContext, FormikTouched, FormikErrors } from 'formik';
import {
  sxDCIForm,
  sxInputField,
  sxSectionHeader,
  sxSftpDetailsHeaderContainer,
} from './DCIFormStyles';
import { Box } from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import DCITestConnectionButton from './DCITestConnectionButton';

export interface DCIFormValues {
  intelexAccessToken: string;
  sftpUrl: string;
  sftpUserName: string;
  sftpPassword: string;
  metadataFilePath: string;
  email: string;
}

interface TestButtonProps {
  formValues: any;
  setDescriptiveToastProps: any;
}

const CreateMaskedField = (props: TextFieldProps & { touched: boolean }) => {
  const error = props.error && props.touched;
  const [showMaskedInput, setShowMaskedInput] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);
  let helperText;
  if (error) {
    helperText = props.error;
  }

  return (
    <FormControl error={error} className={props.className} variant="filled">
      <InputLabel ref={labelRef}>
        {props.label + (props.required && !props.value ? ' *' : '')}
      </InputLabel>
      <FilledInput
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        type={showMaskedInput ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setShowMaskedInput(!showMaskedInput);
              }}
              onMouseDown={event => event.preventDefault()}
              size="large"
            >
              {showMaskedInput ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText ? (
        <FormHelperText id={`${props.id}-helper-text`}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

const CreateFormTextField = (props: TextFieldProps & { touched: boolean }) => {
  const error = props.error && props.touched;

  let helperText;
  if (error) {
    helperText = props.error;
  }

  return (
    <TextField
      id={props.id}
      label={props.label + (props.required && !props.value ? ' *' : '')}
      name={props.name}
      error={error}
      className={props.className}
      helperText={helperText}
      value={props.value}
      onChange={props.onChange}
      autoComplete={'off'}
      multiline={props.multiline}
      rows={props.rows}
      style={props.style}
      variant={'filled'}
    />
  );
};

const DCIForm = (testButtonProps: TestButtonProps) => {
  const intl = useIntl();
  const {
    errors,
    touched,
  }: {
    errors: FormikErrors<DCIFormValues>;
    touched: FormikTouched<DCIFormValues>;
  } = useFormikContext();

  return (
    <Box id={'DCIForm'} sx={sxDCIForm}>
      <Typography variant={'body1'} sx={sxSectionHeader}>
        {intl.formatMessage({ id: 'dci.section.user-for-import' })}
      </Typography>
      <Field
        sx={sxInputField}
        as={CreateMaskedField}
        id={'dci-intelex-access-token-input'}
        name={'intelexAccessToken'}
        error={errors.intelexAccessToken}
        touched={touched.intelexAccessToken}
        label={intl.formatMessage({ id: 'dci.create.intelex-api-key' })}
        required={true}
      />
      <Box sx={sxSftpDetailsHeaderContainer}>
        <Typography variant={'body1'} sx={sxSectionHeader}>
          {intl.formatMessage({ id: 'dci.section.sftp-settings' })}
        </Typography>
        <DCITestConnectionButton
          formValues={testButtonProps.formValues}
          setDescriptiveToastProps={testButtonProps.setDescriptiveToastProps}
        />
      </Box>
      <Field
        as={CreateFormTextField}
        id={'dci-sftp-url-input'}
        name={'sftpUrl'}
        error={errors.sftpUrl}
        touched={touched.sftpUrl}
        sx={sxInputField}
        label={intl.formatMessage({ id: 'dci.create.sftp-url' })}
        required={true}
      />
      <Field
        as={CreateFormTextField}
        id={'dci-sftp-username-input'}
        name={'sftpUserName'}
        error={errors.sftpUserName}
        touched={touched.sftpUserName}
        sx={sxInputField}
        label={intl.formatMessage({ id: 'dci.create.sftp-username' })}
        required={true}
      />
      <Field
        as={CreateMaskedField}
        id={'dci-sftp-password-input'}
        name={'sftpPassword'}
        error={errors.sftpPassword}
        touched={touched.sftpPassword}
        sx={sxInputField}
        label={intl.formatMessage({ id: 'dci.create.sftp-password' })}
        required={true}
      />
      <Typography variant={'body1'} sx={sxSectionHeader}>
        {intl.formatMessage({ id: 'dci.section.import-settings' })}
      </Typography>
      <Field
        as={CreateFormTextField}
        id={'dci-metadata-file-path-input'}
        name={'metadataFilePath'}
        error={errors.metadataFilePath}
        touched={touched.metadataFilePath}
        sx={sxInputField}
        label={intl.formatMessage({ id: 'dci.create.metadata-file-path' })}
        required={true}
      />
      <Field
        as={CreateFormTextField}
        id={'dci-email-input'}
        name={'email'}
        error={errors.email}
        touched={touched.email}
        sx={sxInputField}
        label={intl.formatMessage({ id: 'dci.create.email' })}
        required={true}
      />
    </Box>
  );
};

export default DCIForm;
