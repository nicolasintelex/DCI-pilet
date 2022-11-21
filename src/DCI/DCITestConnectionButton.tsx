import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { sxDCITestConnectButton } from './DCIButtonStyles';

export interface SFTPCredentials {
  credentials: {
    sftpUrl: string;
    sftpUserName: string;
    sftpPassword: string;
  }
}

export interface SFTPConnectionStatus {
  isConnected: boolean;
  statusMsg: string; // to be changed in 37533+37642 to bool filepathFound
}

export const DCI_IMPORT_TEST_SFTP_CONNECTION_QUERY = gql`
  query getSFTPConnectionStatus ($credentials: SFTPCredentials!) {
    getSFTPConnectionStatus (credentials: $credentials) @client {
      isConnected
      statusMsg
    }
  }
`;

interface ConnectionProps {
  formValues: any;
  setDescriptiveToastProps: any;
}

const DCITestConnectionButton = (connProps: ConnectionProps) => {
  const intl = useIntl();
  const client = useApolloClient(); // needed for workaround because https://github.com/IntelexTechnologies/intelex-one/pull/1891 likely broke something

  const testConnection = async () => {
    if (connProps.formValues.sftpUrl && connProps.formValues.sftpUserName && connProps.formValues.sftpPassword) {
      const credentials = {
        sftpUrl: connProps.formValues.sftpUrl,
        sftpUserName: connProps.formValues.sftpUserName,
        sftpPassword: connProps.formValues.sftpPassword
      };
      const { loading, data, error } = await client.query({
        query: DCI_IMPORT_TEST_SFTP_CONNECTION_QUERY,
        variables: { credentials }, // credentials needs to be wrapped in an object
        fetchPolicy: 'network-only',
      });
      if (loading) {
        setTimeout(() => {
          connProps.setDescriptiveToastProps({ // workaround for race condition
            open: true,
            severity: 'info',
            message: intl.formatMessage({ id: 'loading' })
          });
        }, 500);
      }
      if (data) {
        setTimeout(() => {
          connProps.setDescriptiveToastProps({
            open: true,
            severity: data.getSFTPConnectionStatus.isConnected ? 'success' : 'error',
            message: data.getSFTPConnectionStatus.statusMsg
            // to be implemented in 37533+37642
            //message: setDisplayMessage(data.getSFTPConnectionStatus)
          });
        }, 500);
      }
      if (error) {
        setTimeout(() => {
          connProps.setDescriptiveToastProps({
            open: true,
            severity: 'error',
            message: error.message
          });
        }, 500);
      }
    }
    else {
      setTimeout(() => {
        connProps.setDescriptiveToastProps({
          open: true,
          severity: 'warning',
          message: intl.formatMessage({ id: 'dci.test-connection.missing-input' })
        });
      }, 500);
    }
  }

  // to be implemented in 37533+37642
  /*const setDisplayMessage = (results: SFTPConnectionStatus) : string => {
    if(results.isConnected && results.filepathFound){
      // or use const [resultMessage, setResultMessage] = useState("");
      return intl.formatMessage({ id: 'dci.connection.connected-and-filepath' });
    }
    else if(results.isConnected && !results.filepathFound){
      return intl.formatMessage({ id: 'dci.connection.connected-no-filepath' });
    }
    else{
      return intl.formatMessage({ id: 'dci.connection.not-connected' });
    }
  }*/

  // remove 'style={{ display: 'none' }}' in future user story or tech chore to unhide for testing
  return (
    <Button
      id={'dci-test-connection-button'}
      data-testid={'dci-test-connection-button'}
      color={'primary'}
      variant={'outlined'}
      sx={sxDCITestConnectButton}
      type={'button'}
      onClick={testConnection}
      style={{ display: 'none' }}
    >
      {intl.formatMessage({ id: 'dci.create.test-connection-button' })}
    </Button>
  );
};

export default DCITestConnectionButton;
