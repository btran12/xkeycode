import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300, // Initial size
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: '100%',  // focused size
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

SearchListToolbar.propTypes = {
  filterCode: PropTypes.string,
  onFilterCode: PropTypes.func,
};

export default function SearchListToolbar({ filterCode, onFilterCode }) {
  return (
    <StyledRoot>
      <StyledSearch
        value={filterCode}
        onChange={onFilterCode}
        placeholder="Search code..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
    </StyledRoot>
  );
}
