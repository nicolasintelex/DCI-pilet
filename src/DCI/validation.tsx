import * as yup from 'yup';
import { validateUrl } from '../utils/validationUtils';

yup.addMethod(yup.string, 'validUrl', validateUrl);

export const DCIValidationSchema = (intl: {
  formatMessage: (
    arg0: any,
  ) => string | ((params: Partial<yup.TestMessageParams>) => any) | undefined;
}) => {
  return yup.object().shape({
    intelexAccessToken: yup
      .string()
      .required(intl.formatMessage({ id: 'dci.error.intelex-access-token' })),
    sftpUrl: yup.string().required(intl.formatMessage({ id: 'dci.error.sftp-url' })),
    sftpUserName: yup.string().required(intl.formatMessage({ id: 'dci.error.sftp-username' })),
    sftpPassword: yup.string().required(intl.formatMessage({ id: 'dci.error.sftp-password' })),
    metadataFilePath: yup
      .string()
      .required(intl.formatMessage({ id: 'dci.error.metadata-file-path' })),
    email: yup
      .string()
      .email(intl.formatMessage({ id: 'dci.error.invalid-email' }))
      .required(intl.formatMessage({ id: 'dci.error.email' })),
  });
};
