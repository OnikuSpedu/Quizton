import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import SplitPlane from "./SplitPlane";
import * as quesdom from "../../types/quesdom";
import { useUser } from "../../hooks/useUser";
import QuestionPresenter from "./QuestionPresenter";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import { db } from "../../config/firebaseClient";
import postData from "../../utility/postData";
import QuestionScroller from "./QuestionScroller";

interface props {
  subject: string;
  topic: string;
  subtopic?: string;
}

function TopicPage({ subject, topic, subtopic }: props) {
  const [page, setPage] = useState<quesdom.PageData | null>(null);
  const [questions, setQuestions] =
    useState<QueryDocumentSnapshot<quesdom.Question>[]>(null);
  const [presenting, setPresenting] =
    useState<QueryDocumentSnapshot<quesdom.Question> | null>(null);
  const user = useUser();
  const [correct, setCorrect] = useState<boolean | null>(null);

  const onSubmit = (data) => {
    const mcQuestion = presenting.data() as quesdom.multipleChoice;
    const isCorrect = data.answer == mcQuestion.correctAnswer;
    setCorrect(isCorrect);
    console.log(isCorrect);
    fetch("/api/answerQuestion", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        qid: presenting.id,
        userAnswer: data.answer,
        correctAnswer: mcQuestion.correctAnswer,
        isCorrect,
      }),
    });
    postData("/api/addRecent", {
      qid: presenting.id,
      kind: "multipleChoice",
    }).then((res) => console.log(res));
  };

  useEffect(() => {
    if (!subject) return;
    fetch(`/SubjectPageJSON/${subject}.json`)
      .then((res) => res.json())
      .then((res) => setPage(res));
  }, [subject]);
  useEffect(() => {
    //First render: Load some questions for the user
    const questions = db.collection("/questions");
    let query = questions.limit(5).where("organization.subject", "==", subject);

    if (topic) query = query.where("organization.topic", "==", topic);
    if (subtopic) query = query.where("organization.subtopic", "==", subtopic);
    query.get().then((docSnapArray) => {
      setQuestions(
        docSnapArray.docs as QueryDocumentSnapshot<quesdom.Question>[]
      );
      setPresenting(
        docSnapArray.docs[0] as QueryDocumentSnapshot<quesdom.Question>
      );
      console.log(docSnapArray.docs);
    });
  }, []);
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar></Navbar>
      {user && page && (
        <main>
          <div className="w-full px-4 pb-10 pt-10 bg-blue-500 text-white ">
            <div className="flex flex-col">
              <p className="text-gray-200 text-lg">{page.subject}</p>
              <p className="font-bold text-3xl">
                Practice: {page.title} / {topic} /{" "}
                {subtopic === undefined ? "" : subtopic}
              </p>
            </div>
          </div>
          <div className="flex flex-row w-full">
            <section className="order-1 w-5/12 p-10">
              {presenting && questions && (
                <QuestionScroller
                  questions={questions}
                  questionClicked={(activeIndex) => {
                    setPresenting(questions[activeIndex]);
                  }}
                ></QuestionScroller>
              )}
            </section>
            <section className="order-2 w-7/12 p-10">
              {presenting && (
                <QuestionPresenter
                  data={presenting.data() as quesdom.multipleChoice}
                  onEditButtonClicked={() => {}}
                  qid={presenting.id}
                  key={presenting.id}
                  onSubmit={onSubmit}
                ></QuestionPresenter>
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

export default TopicPage;
