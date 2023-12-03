import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, ctx) => {
  return 'Hi there';
});
