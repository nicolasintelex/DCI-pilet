import { gql } from '@apollo/client';

export const START_IMPORT_QUERY = gql`
  query startImport($settings:ImportSettingsInput!) {
    startImport (settings:$settings)
  }
`;
