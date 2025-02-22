declare module '*.png';
declare module globalThis {
  var token: string;
  var allergyDropdownData: IallergyDropdownData[][];
  var diagnosisDropdownData: IdiagnosisDropdownData[];
}
export interface IallergyDropdownData {
  AllergenId?: number;
  Name: string;
  Code?: string;
  Status?: string;
  OnsetId?: number;
  ReactionsId?: number;
}

export interface IdiagnosisDropdownData {
  DiagnosisChronicityLevel: {
    DiagnosisChronicityLevelId: number;
    ShortName: string;
  }[];
  DiagnosisSeverityLevel: {
    DiagnosisSeverityLevelId: number;
    ShortName: string;
  }[];
}
