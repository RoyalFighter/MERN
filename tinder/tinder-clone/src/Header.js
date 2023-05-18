import React from 'react'
import './Header.css'
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import ForumIcon from '@mui/icons-material/Forum';
function Header() {
  return (
    <div class="header">
      {/* wraping inside icon btn gives ripple effect */}
      <IconButton>
      <PersonIcon className='header__icon' fontSize='large'/>
      </IconButton>
      <img className='header__logo' src="data:image/png;base64,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" alt="tinder logo" />
     <IconButton>
      <ForumIcon  fontSize='large' className='header__icon'/>
    </IconButton>

    </div>
  )
}

export default Header