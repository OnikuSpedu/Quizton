export interface questionMetaData {
  kind: string;
  question: string; //HTML
  tag: string[];
  explanation: string;
}

export interface shortAnswer extends questionMetaData {
  kind: "shortAnswer";
  answer: string;
}

export interface multipleChoice extends questionMetaData {
  kind: "multipleChoice";
  answerChoices: string[];
  correctAnswer: number;
}
//Refer to typescript discriminated unions
export type Question = shortAnswer | multipleChoice;

export type Quiz = {
  questions: Question[];
  date: Date;
};

export interface Delta {
  ops: any[];
}

export interface ClientMCInputs {
  question: Delta;
  explanation: Delta;
  answer: number;
  choices: { value: Delta }[];
  tags: { value: string }[];
}
