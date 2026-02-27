import type { CVData, CVSettings } from '../../types/cv';

export interface TemplateProps {
  cvData: CVData;
  settings: CVSettings;
  className?: string;
}

export interface TemplateComponent {
  (props: TemplateProps & { ref?: React.Ref<HTMLDivElement> }): React.ReactElement | null;
}
