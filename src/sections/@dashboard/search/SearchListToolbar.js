import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material';
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
    width: '70%',  // focused size
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

export default function SearchListToolbar({ filterCode, onFilterCode, searchOption, onSearchOptionChange }) {
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

      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Search Mode</FormLabel>
        <RadioGroup
          row
          name="row-radio-buttons-group"
          value={searchOption}
          onChange={onSearchOptionChange}
        >
          <FormControlLabel value="code" control={<Radio size="small"/>} label="Code" />
          <FormControlLabel value="word" control={<Radio size="small"/>} label="Word" />
        </RadioGroup>
      </FormControl>

    </StyledRoot>
  );
}
