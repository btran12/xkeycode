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
  const MAX_CODES_TO_DISPLAY = 30;

  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);
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

      if (searchOption === 'code') {
        setIsCodeLoading(true);
      } else {
        setIsWordLoading(true);
      }

      fetch(ICD_SERVICE(searchOption, searchValue))
        .then(res => res.json())
        .then(
          (result) => {
            
            if (searchOption === 'code') {
              setIsCodeLoading(false);
              setCodeResults(result);
            } else {
              setIsWordLoading(false);
              setWordResults(result);
            }
            
            console.log(result)
          },

          (error) => {
            setIsCodeLoading(false);
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

                {codeResults.code.length === 0 || isCodeLoading
                  ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={200} animation={isCodeLoading} /> 
                  : <Typography variant="h5" component="div"> {codeResults.code} ({codeResults.codeType}) </Typography>
                }

                {codeResults.code.length === 0 || isCodeLoading
                  ? 
                    <>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isCodeLoading} /> 
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isCodeLoading} />
                    </>
                : <Typography variant="body2"> {codeResults.description} </Typography>
                }
                
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Characteristics
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {codeResults.code.length === 0 || isCodeLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isCodeLoading} />
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
                    {codeResults.code.length === 0 || isCodeLoading || codeResults.similarCodes.length === 0
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isCodeLoading} />
                      : codeResults.similarCodes.slice(0, Math.min(MAX_CODES_TO_DISPLAY, codeResults.similarCodes.length)).map
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
                  {wordResults.word.length === 0 || isWordLoading
                    ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isWordLoading}/>
                    : wordResults.word
                  }
                </Typography>
                
                  {wordResults.word.length === 0 || isWordLoading
                    ?
                    <>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isWordLoading} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isWordLoading} />
                    </>
                  : <Typography variant="body2"> {wordResults.definition} </Typography>
                  }
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Related Diagnosis Codes
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    {wordResults.dxCodes.length === 0 || isWordLoading
                      ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isWordLoading} />
                      : 
                          wordResults.dxCodes.slice(0, Math.min(MAX_CODES_TO_DISPLAY, wordResults.dxCodes.length)).map(
                          (code, index) =>
                            <Chip
                              key={index}
                              label={code} size="small" variant="outlined"
                              sx={{ margin: 0.5 }}
                              clickable
                              onClick={() => handleSearch('code', code)}
                            />
                          )
                      }
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Related Procedure Codes
                  </Typography>
                  
                  {wordResults.sgCodes.length === 0 || isWordLoading
                    ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation={isWordLoading} />
                    : wordResults.sgCodes.slice(0, Math.min(MAX_CODES_TO_DISPLAY, wordResults.sgCodes.length)).map(
                      (code, index) =>
                        <Chip
                          key={index}
                          label={code} size="small" variant="outlined"
                          sx={{ margin: 0.5 }}
                          clickable
                          onClick={() => handleSearch('code', code)}
                        />
                    )}
                </CardContent>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
