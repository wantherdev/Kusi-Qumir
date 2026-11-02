import { DeploymentConfig } from './deployment.model';
import { deploymentConfig as pagesConfig } from './deployment.config.pages';

export const deploymentConfig: DeploymentConfig = {
  ...pagesConfig,
  adminAtRoot: true,
};
