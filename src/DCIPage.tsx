import { useLazyQuery } from '@apollo/client';
import { Box, Button, Paper, Typography } from '@mui/material';
import template from './assets/import_template_empty.csv';
import instructions from './assets/DCI-Instructions.pdf';

import { Form, Formik } from 'formik';
import { Consumer, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DescriptiveToast, DescriptiveToastProps } from './fragments/DescriptiveToast';
import { START_IMPORT_QUERY } from './DCI/constants';
import {
  sxDCIButtonHeaderButtonsContainer,
  sxDCIButtonRoot,
  // TODO
  // ILX-36672
  // sxSaveButtonProgress,
  sxButtonWrapper,
} from './DCI/DCIButtonStyles';
import DCIForm, { DCIFormValues } from './DCI/DCIForm';
import { sxFormContainer, sxHeaderContainer, sxPageContainer } from './DCI/DCIPageStyles';
import { DCIValidationSchema } from './DCI/validation';
import * as React from 'react';

export declare const GlobalConsumer: Consumer<{}>;



const DCIPage = () => {
  const templateName = 'import_template_empty.csv';
  const instructionsName = 'DCI-Instructions.pdf';

  const intl = useIntl();
  const [isDirty, setIsDirty] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [descriptiveToast, setDescriptiveToastProps] = useState({
    open: false,
  } as DescriptiveToastProps);

  const [startImport, { data }] = useLazyQuery(START_IMPORT_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setDescriptiveToastProps({
        open: true,
        message: `${isDryRun ? intl.formatMessage({ id: 'dci.create.dry-run' }) + ': ' : ''}${
          data.startImport
        }`,
      });
    },
    onError: (error: Error) => {
      setDescriptiveToastProps({
        open: true,
        message: intl.formatMessage({ id: 'dci.error.start-import' }),
        severity: 'error',
      });
      console.error(error.message);
    },
  });

  useEffect(() => {
    const showPopupWhenDirty = (event: any) => {
      if (isDirty) {
        // ts-ignore
        (event || window.event).returnValue = intl.formatMessage({
          id: 'dci.create.dirty-message',
        }); // event.returnValue is for Gecko and window.event.returnValue is for IE
        return intl.formatMessage({ id: 'dci.create.dirty-message' }); // Older versions of Gecko + Webkit, Safari, Chrome etc.
      }
    };
    window.addEventListener('beforeunload', showPopupWhenDirty);
    return () => window.removeEventListener('beforeunload', showPopupWhenDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const headerButtons = [
    <Box key={'dci-buttons'} sx={sxDCIButtonHeaderButtonsContainer}>
      <Box sx={sxButtonWrapper}>
        <Button
          id={'dci-download-instructions-button'}
          sx={sxDCIButtonRoot}
          variant={'contained'}
          color={'primary'}
          key={'dci-download-instructions-button'}
          href={instructions}
          download={instructionsName}
        >
          {intl.formatMessage({ id: 'dci.create.download-instructions-button' })}
        </Button>
      </Box>
      <Box sx={sxButtonWrapper}>
        <Button
          id={'dci-download-template-button'}
          sx={sxDCIButtonRoot}
          variant={'contained'}
          color={'primary'}
          key={'dci-download-template-button'}
          href={template}
          download={templateName}
        >
          {intl.formatMessage({ id: 'dci.create.download-template-button' })}
        </Button>
      </Box>
      <Box sx={sxButtonWrapper}>
        <Button
          id={'dci-dry-run-button'}
          sx={sxDCIButtonRoot}
          color={'primary'}
          variant={'outlined'}
          type={'submit'}
          onClick={() => {
            setIsDryRun(true);
          }}
        >
          {intl.formatMessage({ id: 'dci.create.dry-run' })}
        </Button>
      </Box>
      <Box sx={sxButtonWrapper}>
        <Button
          id={'dci-start-import-button'}
          sx={sxDCIButtonRoot}
          variant={'contained'}
          color={'primary'}
          type={'submit'}
          key={'header-button-start-import'}
          onClick={() => {
            setIsDryRun(false);
          }}
        >
          {intl.formatMessage({ id: 'dci.create.start-import' })}
        </Button>
      </Box>
    </Box>,
  ];

  return (
    <GlobalConsumer>
      {({ tenant, v6: { loginUrl } }: any) => {
        return (
          <Formik
            validationSchema={DCIValidationSchema(intl)}
            initialValues={{
              intelexAccessToken: '',
              sftpUrl: '',
              sftpUserName: '',
              sftpPassword: '',
              metadataFilePath: '',
              email: '',
            }}
            onSubmit={(values: DCIFormValues, { resetForm }) => {
              startImport({
                variables: {
                  settings: {
                    apiKey: values.intelexAccessToken,
                    apiEndpoint: `${loginUrl}/${tenant}`,
                    metadataFile: values.metadataFilePath,
                    sftpUrl: values.sftpUrl,
                    sftpUser: values.sftpUserName,
                    sftpPassword: values.sftpPassword,
                    email: values.email,
                    dryRun: isDryRun,
                  },
                },
              });
              resetForm();
            }}
            enableReinitialize={true}
          >
            {({ dirty, values }) => (
              <Box sx={sxFormContainer}>
                <Form
                  onKeyUp={() => {
                    setIsDirty(dirty);
                  }}
                >
                  <Paper sx={sxPageContainer}>
                    <Typography variant={'h5'}>
                      {intl.formatMessage({ id: 'dci.header' })}
                    </Typography>
                    <Box sx={sxHeaderContainer}>{headerButtons}</Box>
                    {
                      <DCIForm
                        formValues={values}
                        setDescriptiveToastProps={setDescriptiveToastProps}
                      />
                    }
                    <DescriptiveToast
                      open={descriptiveToast.open}
                      setDescriptiveToastProps={setDescriptiveToastProps}
                      customAction={descriptiveToast.customAction}
                      variant="filled"
                      severity={descriptiveToast.severity}
                      message={descriptiveToast.message}
                      autoHide={false}
                    />
                  </Paper>
                </Form>
              </Box>
            )}
          </Formik>
        );
      }}
    </GlobalConsumer>
  );
};

export default DCIPage;
