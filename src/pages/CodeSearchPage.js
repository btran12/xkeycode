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
} from '@mui/material';
import { ICD_SERVICE  } from '../services/IcdService';

// sections
import { SearchListToolbar } from '../sections/@dashboard/search';


// ----------------------------------------------------------------------

export default function SearchPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    'codeType': '...',
    'description': '...'
  });

  const [filterCode, setFilterCode] = useState('Code');

  const sampleCharacteristics = ['Bacterial', 'Meningitis', 'Salmonella'];
  const sampleSimilarCodes = ['A020', 'A021', 'A0220', 'A0222', 'A0223', 'A0224', 'A020', 'A021', 'A0220', 'A0222', 'A0223', 'A0224'];

  const handleFilterByCode = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  const handleSearch = (searchValue) => {
    setFilterCode(searchValue);

    if (searchValue.length > 3) {
      console.log(`Searching for ... ${searchValue}`);

      setIsLoading(true);

      fetch(ICD_SERVICE('code', searchValue))
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
          <SearchListToolbar filterCode={filterCode} onFilterCode={handleFilterByCode} />
        </Card>
        
        <Grid container mt={1}>
          <Grid xs={12} md={6} padding={1}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                  Definition
                </Typography>

                <Typography variant="h5" component="div">
                  { filterCode } ({results.codeType})
                </Typography>

                <Typography variant="body2">
                  {results.description}
                </Typography>
                
              </CardContent>
              <CardActions>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Characteristics
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {sampleCharacteristics.map(
                      (characteristic, index) =>
                        <Chip 
                          key={ index }
                          label={characteristic} size="small" variant="outlined"
                          sx={{ margin: 0.5 }} 
                          clickable
                          onClick={() => handleSearch(characteristic)}
                        />
                    )}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Similar Codes
                  </Typography>
                  <Typography variant="body2">
                    {sampleSimilarCodes.slice(0, Math.min(10, sampleSimilarCodes.length)).map
                    ((code, index) => 
                        <Chip
                          key={index}
                          label={code} size="small" variant="outlined"
                          sx={{ margin: 0.5 }}
                          clickable
                          onClick={() => handleSearch(code)}
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
                <Typography variant="body2">
                  Ipsum lorem
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
