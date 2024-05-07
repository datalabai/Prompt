import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


export default function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ }}>
      <CardHeader
        avatar={
          
            <Typography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Transaction&apos;s
        </Typography>
          
        }
        action={
          
           <span sx={{ bgcolor: red[500] }} aria-label="recipe">
           
          </span>
          
        }
        
      />
      <CardContent className='flex'>
        <ArrowCircleUpIcon fontSize='large' color="success"/>
        <div className='ml-2'>
        <Typography variant="body2" color="text.secondary" >
          Reward Earn for promt <span className='font-black'>Hacker Code...</span>
        </Typography> 
        <Typography variant="body2" color="text.secondary" >
         8 May 2024, at 12:30 PM
        </Typography>
        </div>
        <div className='ml-64 flex'>
          <AddIcon fontSize='small' color="success"/>
        <Typography variant="body2" color="green" className='font-black'>
          $190
        </Typography> 
        
        </div>
      </CardContent>

      <CardContent className='flex'>
        <ArrowCircleDownIcon fontSize='large' sx={{ color: red[500] }}/>
        <div className='ml-2'>
        <Typography variant="body2" color="text.secondary" >
          Debited amount for promt <span className='font-black'>Best Thea...</span>
        </Typography> 
        <Typography variant="body2" color="text.secondary" >
         8 May 2024, at 12:30 PM
        </Typography>
        </div>
        <div className='ml-64 flex'>
          <RemoveIcon fontSize='small' sx={{ color: red[500] }}/>
        <Typography variant="body2" color="red" className='font-black'>
          $190
        </Typography> 
        
        </div>
      </CardContent>

    </Card>
  );
}
