import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Stack,
  Container,
  Typography,
  Skeleton
} from '@mui/material';
import { ICD_SERVICE  } from '../services/IcdService';

// sections
import { SearchListToolbar } from '../sections/@dashboard/search';


// ----------------------------------------------------------------------

export default function SearchPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    'code': '',
    'codeType': '...',
    'description': '...',
    'characteristics': [],
    'similarCodes': []
  });

  const [filterCode, setFilterCode] = useState('');
  const [searchOption, setSearchOption] = useState('code');

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  }

  const handleFilterByCode = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  const handleSearch = (searchValue) => {
    setFilterCode(searchValue);

    if (searchValue.length > 3) {
      console.log(`Searching for ... ${searchValue}`);

      setIsLoading(true);

      fetch(ICD_SERVICE(searchOption, searchValue))
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoading(false);
            setResults(result);

            console.log(result)
          },

          (error) => {
            setIsLoading(false);
            setError(error);
          }
        )
    }
  }


  return (
    <>
      <Helmet>
        <title> Search | XKeyCode </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search
          </Typography>
        </Stack>

        <Card>
          <SearchListToolbar 
            filterCode={filterCode} 
            onFilterCode={handleFilterByCode}
            searchOption={searchOption}
            onSearchOptionChange={handleSearchOptionChange} />
        </Card>
        
        <Grid container mt={1}>
          <Grid xs={12} md={6} padding={1}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                  Definition
                </Typography>

                <Typography variant="h5" component="div">
                  {results.code.length === 0 || isLoading
                    ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={200}/> 
                    : `${filterCode} (${results.codeType})`
                  }
                </Typography>

                <Typography variant="body2">
                  {results.code.length === 0 || isLoading
                    ? 
                      <>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> 
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </>
                    : results.description
                  }
                </Typography>
                
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Characteristics
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {results.code.length === 0 || isLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      : results.characteristics.map(
                        (characteristic, index) =>
                          <Chip 
                            key={ index }
                            label={characteristic} size="small" variant="outlined"
                            sx={{ margin: 0.5 }} 
                            clickable
                            onClick={() => {
                                setSearchOption('word')
                                handleSearch(characteristic)
                              }
                            }
                          />
                    )}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Similar Codes
                  </Typography>
                  <Typography variant="body2">
                    {results.code.length === 0 || isLoading || results.similarCodes.length === 0
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      : results.similarCodes.slice(0, Math.min(10, results.similarCodes.length)).map
                        ((code, index) => 
                            <Chip
                              key={index}
                              label={code} size="small" variant="outlined"
                              sx={{ margin: 0.5 }}
                              clickable
                              onClick={() => {
                                  setSearchOption('code')
                                  handleSearch(code)
                                }
                              }
                            />
                    )}
                  </Typography>
                </CardContent>
              </CardActions>
            </Card>
          </Grid>

          <Grid xs={12} md={6} padding={1}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                  Details
                </Typography>
                <Stack spacing={1}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="rounded" height={60} />
                  <Skeleton variant="rounded" height={60} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
