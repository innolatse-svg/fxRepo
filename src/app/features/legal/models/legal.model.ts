export interface LegalCallout {
  type: 'warning' | 'info' | 'placeholder';
  title: string;
  text: string;
}

export interface LegalSubSection {
  title: string;
  content: string[];
}

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  subsections?: LegalSubSection[];
  callout?: LegalCallout;
  placeholder?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  draftNotice: string;
  sections: LegalSection[];
}
