import { ComponentType } from 'react';

export interface SwaggerUIProps {
  url?: string;
  spec?: any;
  docExpansion?: 'none' | 'list' | 'full';
  defaultModelsExpandDepth?: number;
  [key: string]: any;
}

declare const SwaggerUI: ComponentType<SwaggerUIProps>;
export default SwaggerUI;
