import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
// utils
import { fCurrency, fShortenNumber } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AppTopRelated({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AppTopRelated.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ApplicationItem({ app }) {
  const { shortcut, system, price, ratingNumber, totalReviews, name } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      >
        <Box component="img" src={shortcut} sx={{ width: 50, height: 50 }} />
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
         

          <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
            {system}
          </Typography>

          {/* <Label color={price === 0 ? 'success' : 'error'}>
            {price === 0 ? 'Free' : fCurrency(price)}
          </Label> */}
        </Stack>
      </Box>

      <Stack alignItems="flex-end">
        {/* <Rating readOnly size="small" precision={0.5} name="reviews" value={ratingNumber} /> */}
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {totalReviews} 
        </Typography>
      </Stack>
    </Stack>
  );
}

ApplicationItem.propTypes = {
  app: PropTypes.object,
};
