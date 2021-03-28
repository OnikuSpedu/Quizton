interface authorMetaData {
  uid: string;
  username: string;
  hasProfilePicture: boolean;
}

export interface questionMetaData {
  kind: string;
  question: string; //HTML
  tag: string[];
  date: any; // TODO: Change to firebase timestamp type
  author: authorMetaData;
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
