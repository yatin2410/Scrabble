import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
    let errors  = {};
    
    if(validator.isEmpty(data.email))
    {
        errors.email= 'THIS FIELD IS REQUIRED';
    }
    if (!validator.isEmail(data.email))
    {
        errors.email = 'Email is INVALID';
    }
    if(validator.isEmpty(data.username))
    {
        errors.username= 'THIS FIELD IS REQUIRED';
    }

    if(validator.isEmpty(data.password))
    {
        errors.password= 'THIS FIELD IS REQUIRED';
    }
    
    if(validator.isEmpty(data.passwordConform))
    {
        errors.passwordConform= 'THIS FIELD IS REQUIRED';
    }

    if(!validator.equals(data.password,data.passwordConform))
    {
        errors.password = 'Confirm password doesnot match';
    }


    return {
        errors,
        isValid : isEmpty(errors)
    }
  
  }
