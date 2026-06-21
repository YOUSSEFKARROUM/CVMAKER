export * from './types';
export * from './utils';
export * from './components';
export * from './budapest';
export * from './brunei';
export * from './vladivostok';
export * from './sydney';
export * from './shanghai';
export * from './kiev';
export * from './rotterdam';
export * from './tokyo';
export * from './chicago';
export * from './modern';
export * from './stanford';
export * from './cambridge';
export * from './oxford';
export * from './otago';
export * from './berkeley';
export * from './harvard';
export * from './auckland';
export * from './edinburgh';
export * from './princeton';

import type React from 'react';
import type { TemplateProps } from './types';
import { BudapestTemplate } from './budapest';
import { BruneiTemplate } from './brunei';
import { VladivostokTemplate } from './vladivostok';
import { SydneyTemplate } from './sydney';
import { ShanghaiTemplate } from './shanghai';
import { KievTemplate } from './kiev';
import { RotterdamTemplate } from './rotterdam';
import { TokyoTemplate } from './tokyo';
import { ChicagoTemplate } from './chicago';
import { ModernTemplate } from './modern';
import { StanfordTemplate } from './stanford';
import { CambridgeTemplate } from './cambridge';
import { OxfordTemplate } from './oxford';
import { OtagoTemplate } from './otago';
import { BerkeleyTemplate } from './berkeley';
import { HarvardTemplate } from './harvard';
import { AucklandTemplate } from './auckland';
import { EdinburghTemplate } from './edinburgh';
import { PrincetonTemplate } from './princeton';
import { TEMPLATES, type TemplateMeta } from '../../data/templates';

type TemplateFC = React.ForwardRefExoticComponent<TemplateProps & React.RefAttributes<HTMLDivElement>>;

const TEMPLATE_COMPONENTS: Record<string, TemplateFC> = {
  budapest:    BudapestTemplate,
  brunei:      BruneiTemplate,
  vladivostok: VladivostokTemplate,
  sydney:      SydneyTemplate,
  shanghai:    ShanghaiTemplate,
  kiev:        KievTemplate,
  rotterdam:   RotterdamTemplate,
  tokyo:       TokyoTemplate,
  chicago:     ChicagoTemplate,
  modern:      ModernTemplate,
  stanford:    StanfordTemplate,
  cambridge:   CambridgeTemplate,
  oxford:      OxfordTemplate,
  otago:       OtagoTemplate,
  berkeley:    BerkeleyTemplate,
  harvard:     HarvardTemplate,
  auckland:    AucklandTemplate,
  edinburgh:   EdinburghTemplate,
  princeton:   PrincetonTemplate,
};

export function getTemplateComponent(id: string): TemplateFC {
  return TEMPLATE_COMPONENTS[id] ?? TEMPLATE_COMPONENTS['modern'];
}

export function getAllTemplates(): TemplateMeta[] {
  return TEMPLATES;
}
