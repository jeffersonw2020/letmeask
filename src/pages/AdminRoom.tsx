import { useHistory, useParams } from 'react-router-dom'
import { FormEvent, useState } from 'react';

import logoImg from '../assets/images/logo.svg';
import emptyQuestionImg from '../assets/images/empty-questions.svg';
import deleteModalImg from '../assets/images/delete-modal.svg';
import excluirImg from '../assets/images/excluir.svg';
import answerImg from '../assets/images/check.svg';
import checkImg from '../assets/images/answer.svg';

import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { Answered } from '../components/Answered';
import { RoomCode } from '../components/RoomCode';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [answeredQuestion, setAnsweredQuestion] = useState('');
  const [questionOnId, setQuestionOnId] = useState('');
  const { title, questions } = useRoom(roomId);


  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (answeredQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const answered = {
      id: questionOnId,
      content: answeredQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      }
    };

    await database.ref(`rooms/${roomId}/questions/${questionOnId}/answered`).update(answered);

    setAnsweredQuestion('');
    handleOffAnswer(questionOnId);
  }
  async function handleRoomAfterDeleteAndMovedHome() {
    history.push('/');
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    handleRoomAfterDeleteAndMovedHome();
  }

  async function handleDeleteQuestionFromModal(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }
  async function handleDeleteAnswerFromModal(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}/answered`).remove();
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: false,
      onAnswer: false,
    })
  }
  async function handleOnAnswer(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
      onAnswer: true,
    })
    setQuestionOnId(questionId);
  }

  async function handleOffAnswer(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      onAnswer: false,
    })
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    if (isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      })
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      })
    }
  }



  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Modal
              image={deleteModalImg}
              title='Encerrar sala'
              description='Tem certeza que você deseja encerrar esta sala?'
              buttonExcluir='Sim, encerrar'
              typeModalText="encerrar"
              handleDelete={handleEndRoom}
            />

          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        {questions.length < 1 &&
          <div className='empty-questions'>
            <img src={emptyQuestionImg} alt="empty questions" />
            <strong>Nenhuma pergunta por aqui...</strong>
            <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
          </div>}
        <div className="question-list">
          {questions.map(question => {
            return (

              <>
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                      >
                        <img src={checkImg} alt="Dar destaque à pergunta" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOnAnswer(question.id)}
                      >
                        <img src={answerImg} alt="Responder à pergunta" />
                      </button>
                    </>
                  )}

                  <Modal
                    image={excluirImg}
                    title='Excluir pergunta'
                    description='Tem certeza que você deseja excluir esta pergunta?'
                    buttonExcluir='Sim, excluir'
                    typeModalText="pergunta"
                    handleDelete={() => handleDeleteQuestionFromModal(question.id)}
                  />
                </Question>
                <Answered
                  key={question.id}
                  answered={question.answered}
                >
                  <Modal
                    image={excluirImg}
                    title='Excluir resposta'
                    description='Tem certeza que você deseja excluir esta resposta?'
                    buttonExcluir='Sim, excluir'
                    typeModalText="resposta"
                    handleDelete={() => handleDeleteAnswerFromModal(question.id)}
                  />
                </Answered>
                {question.onAnswer && <form onSubmit={handleSendQuestion} className='answered-question'>
                  <textarea
                    placeholder="O que você quer Responder?"
                    onChange={event => setAnsweredQuestion(event.target.value)}
                    value={answeredQuestion}
                  />

                  <div className="form-footer">
                    {user ? (
                      <div className="user-info">
                        <img src={user.avatar} alt={user.name} />
                        <span>{user.name}</span>
                      </div>
                    ) : (
                      <span>.</span>
                    )}
                    <Button
                      type="submit"
                      disabled={!user}
                    >Enviar resposta</Button>
                  </div>
                </form>}
              </>
            );
          })}
        </div>
      </main>
    </div>
  );
}