import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { DocPattern } from 'src/app/(doclike)/(default)/patterns/page';

import {
  BaseButton,
  BaseButtonProps,
  computeButtonIconSize,
} from '@/components/buttons/base-button';
import config from '@/statics/config';

interface CommonButtonProps {
  size: BaseButtonProps['size'];
}

export const PatternGitHubButton: React.FC<
  {
    pattern: Pick<DocPattern, 'gitHubUrl'>;
  } & CommonButtonProps
> = ({ pattern, size }) => {
  if (!pattern.gitHubUrl) return null;
  return (
    <a target='_blank' rel='noreferrer' href={pattern.gitHubUrl} className='no-underline'>
      <BaseButton onClick={undefined} size={size}>
        {<FiGithub size={computeButtonIconSize(size)} title='Edit on GitHub' />}
      </BaseButton>
    </a>
  );
};
