import * as React from 'react';
import { Snackbar, IconButton } from '@mui/material';
import { Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type DescriptiveToastProps = {
  open: boolean;
  severity?: 'info' | 'warning' | 'error' | 'success';
  variant?: 'outlined' | 'filled' | 'standard';
  customAction?: JSX.Element;
  message?: string;
  autoHide?: boolean;
  duration?: number;
};

export const DescriptiveToast = (
  props: DescriptiveToastProps & {
    setDescriptiveToastProps: React.Dispatch<React.SetStateAction<DescriptiveToastProps>>;
  },
) => {
  const handleClose = () => {
    props.setDescriptiveToastProps({ ...props, open: false });
  };

  return (
    <>
      <Snackbar
        id={'ILX-DescriptiveToastMessage-Snackbar'}
        open={props.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={props.autoHide === false ? null : props.duration ?? 5000}
        onClose={handleClose}
      >
        <Alert
          variant={props.variant ?? 'filled'}
          onClose={handleClose}
          severity={props.severity ?? 'success'}
          action={
            <>
              {props.customAction}
              <IconButton
                id={'ILX-DescriptiveToastMessage-Close'}
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          }
        >
          {props.message ?? 'Success'}
        </Alert>
      </Snackbar>
    </>
  );
};
