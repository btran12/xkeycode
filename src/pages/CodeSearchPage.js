import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  const [codeResults, setCodeResults] = useState({
    'code': '',
    'codeType': '...',
    'description': '...',
    'characteristics': [],
    'similarCodes': []
  });

  const [wordResults, setWordResults] = useState({
    'word': '',
    'definition': 'Unknown',
    'dxCodes': [],
    'sgCodes': []
  });

  const [filterCode, setFilterCode] = useState('');
  const [searchOption, setSearchOption] = useState('code');

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
    handleSearch(event.target.value, filterCode);
  }

  const handleFilterByCode = (event) => {
    const { value } = event.target;
    handleSearch(searchOption, value);
  };

  const handleSearch = (searchOption, searchValue) => {
    setFilterCode(searchValue);
    setSearchOption(searchOption);

    if (searchValue.length > 3) {
      console.log(`Searching for ${searchOption}... ${searchValue}`);

      setIsLoading(true);

      fetch(ICD_SERVICE(searchOption, searchValue))
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoading(false);

            if (searchOption === 'code') {
              setCodeResults(result);
            } else {
              setWordResults(result);
            }
            
            console.log(result)
          },

          (error) => {
            setIsLoading(false);
            setError(error);
            console.error(error);
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
          <Grid item xs={12} md={6} padding={1}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                  Code Definition
                </Typography>

                <Typography variant="h5" component="div">
                  {codeResults.code.length === 0 || isLoading
                    ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={200} animation={isLoading} /> 
                    : `${codeResults.code} (${codeResults.codeType})`
                  }
                </Typography>

                <Typography variant="body2">
                  {codeResults.code.length === 0 || isLoading
                    ? 
                      <>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} /> 
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      </>
                    : codeResults.description
                  }
                </Typography>
                
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Characteristics
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {codeResults.code.length === 0 || isLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      : codeResults.characteristics.map(
                        (characteristic, index) =>
                          <Chip 
                            key={ index }
                            label={characteristic} size="small" variant="outlined"
                            sx={{ margin: 0.5 }} 
                            clickable
                            onClick={() => handleSearch('word', characteristic)}
                          />
                    )}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Similar Codes
                  </Typography>
                  <Typography variant="body2">
                    {codeResults.code.length === 0 || isLoading || codeResults.similarCodes.length === 0
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      : codeResults.similarCodes.slice(0, Math.min(10, codeResults.similarCodes.length)).map
                        ((code, index) => 
                            <Chip
                              key={index}
                              label={code} size="small" variant="outlined"
                              sx={{ margin: 0.5 }}
                              clickable
                            onClick={() => handleSearch('code', code)}
                            />
                    )}
                  </Typography>
                </CardContent>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} padding={1}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                  Word Definition
                </Typography>

                <Typography variant="h5" component="div">
                  {wordResults.word.length === 0 || isLoading
                    ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading}/>
                    : wordResults.word
                  }
                </Typography>
                <Typography variant="body2">
                  {wordResults.word.length === 0 || isLoading
                    ?
                    <>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                    </>
                    : wordResults.definition
                  }
                </Typography>
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Related Diagnosis Codes
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {wordResults.dxCodes.length === 0 || isLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      : wordResults.dxCodes.map(
                        (code, index) =>
                          <Chip
                            key={index}
                            label={code} size="small" variant="outlined"
                            sx={{ margin: 0.5 }}
                            clickable
                            onClick={() => handleSearch('code', code)}
                          />
                      )}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Related Procedure Codes
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {wordResults.sgCodes.length === 0 || isLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isLoading} />
                      : wordResults.sgCodes.map(
                        (code, index) =>
                          <Chip
                            key={index}
                            label={code} size="small" variant="outlined"
                            sx={{ margin: 0.5 }}
                            clickable
                            onClick={() => handleSearch('code', code)}
                          />
                      )}
                  </Typography>
                </CardContent>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
